<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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
