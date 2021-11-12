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
        $this->addUserToChatroom($chatRoom);

        return $chatRoom->refresh();
    }

    public function update(ChatRoom $chatRoom): Response
    {
        $this->addUserToChatroom($chatRoom);

        return response()->noContent();
    }

    public function addUserToChatroom(ChatRoom $chatRoom): ChatRoom
    {
        $chatRoom->members()->syncWithoutDetaching(auth()->user()->id);

        return $chatRoom->refresh();
    }
}
