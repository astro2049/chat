<?php

namespace Tests\Feature;

use App\Models\ChatRoom;
use App\Models\User;
use Tests\TestCase;

class ChatRoomTest extends TestCase
{
    public function test_user_can_create_chatroom()
    {
        /** @var User $user */
        $user = User::factory()->create([]);

        $this->postJson('api/chatRooms', [
            'name' => 'Paradise'
        ])->assertUnauthorized();

        $this->actingAs($user)->postJson('api/chatRooms', [
            'name' => 'Paradise'
        ])->assertCreated();

        /** @var ChatRoom $chatroom */
        $chatroom = ChatRoom::query()->find(1);
        $this->assertSame($chatroom->name, 'Paradise');
        $this->assertSame($chatroom->members()->get()->first()['name'], $user->name);
    }

    public function test_user_can_join_chat_rooms()
    {
        ChatRoom::factory()->create();

        /** @var User $user1 */
        $user1 = User::factory()->create();
        $this->patchJson('api/chatRooms/1', [])->assertUnauthorized();
        $this->actingAs($user1)->patchJson('api/chatRooms/1', [])->assertNoContent();

        /** @var User $user2 */
        $user2 = User::factory()->create();
        $this->actingAs($user2)->patchJson('api/chatRooms/1', [])->assertNoContent();

        /** @var ChatRoom $chatroom */
        $chatroom = ChatRoom::query()->find(1);
        $this->assertSame($chatroom->members()->get()->find(1)['name'], $user1->name);
        $this->assertSame($chatroom->members()->get()->find(2)['name'], $user2->name);
    }
}
