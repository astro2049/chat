<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class ChatRoomController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function store(Request $request): ChatRoom
    {
        $this->validate($request, [
            'name' => ['required', 'between:2,21'],
        ]);

        /** @var ChatRoom $chatRoom */
        $chatRoom = ChatRoom::query()->create($request->all());
        $chatRoom->members()->syncWithoutDetaching(auth()->user()->id);

        return $chatRoom->refresh();
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(ChatRoom $chatRoom): Response
    {
        $this->authorize('destroy', $chatRoom);

        $chatRoom->delete();

        Http::withoutVerifying()
            ->Post(config('notification.service_url') . '/api/notifications/chat-room-disbanded', [
                'id' => $chatRoom->id,
                'members' => $chatRoom->members()->get()->pluck('name')->toArray()
            ]);

        return \response()->noContent();
    }

    public function addMember(ChatRoom $chatRoom): Response
    {
        $chatRoom->members()->syncWithoutDetaching(auth()->user()->id);

        return response()->noContent();
    }

    public function deleteMember(ChatRoom $chatRoom): Response
    {
        $chatRoom->members()->detach(auth()->user()->id);

        return response()->noContent();
    }
}
