<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use Illuminate\Cache\Events\CacheHit;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChatRoomController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => ['required', 'between:2,21'],
        ]);

        return ChatRoom::query()->create([$request->all()]);
    }

    public function show($chatroom)
    {
        return $chatroom;
    }

    /**
     * @throws ValidationException
     */
    public function update(Request $request, ChatRoom $chatroom): bool
    {
        $this->validate($request, [
            'name' => ['required', 'between:2,21'],
        ]);

        return $chatroom->update($request->all());
    }
}
