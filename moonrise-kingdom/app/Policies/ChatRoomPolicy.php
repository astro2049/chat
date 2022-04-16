<?php

namespace App\Policies;

use App\Models\ChatRoom;
use App\Models\User;

class ChatRoomPolicy
{
    public function destroy(User $me, ChatRoom $chatRoom): bool
    {
        return $chatRoom->isCreatedBy($me);
    }
}
