<?php

namespace Tests\Feature;

use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Support\Facades\Http;
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
        $this->assertTrue($chatroom->isCreatedBy($user));
    }

    public function test_user_can_delete_chatroom()
    {
        /** @var User $astro */
        $astro = User::factory()->create([]);
        /** @var User $thunder */
        $thunder = User::factory()->create([]);

        /** @var ChatRoom $paradise */
        $paradise = $this->actingAs($astro)->postJson('api/chatRooms', [
            'name' => 'Paradise'
        ])->assertCreated()->getOriginalContent();
        /** @var ChatRoom $insomnia */
        $insomnia = $this->actingAs($astro)->postJson('api/chatRooms', [
            'name' => 'Insomnia'
        ])->assertCreated()->getOriginalContent();

        Http::fake([
            config('notification.service_url') . '/api/notifications/chat-room-disbanded' => Http::response()
        ]);

        $this->actingAs($thunder)->delete('api/chatRooms/1')
            ->assertForbidden();
        $this->assertNotSoftDeleted($paradise);

        $this->actingAs($astro)->delete('api/chatRooms/1')
            ->assertNoContent();
        $this->assertSoftDeleted($paradise);

        $this->assertCount(1, $astro->chatRooms()->get());
        /** @var ChatRoom $retrievedInsomnia */
        $retrievedInsomnia = $astro->chatRooms()->get()->get(0);
        $this->assertSame($insomnia->id, $retrievedInsomnia->id);
        $this->assertSame($insomnia->name, $retrievedInsomnia->name);
    }

    public function test_user_can_join_a_chat_room()
    {
        /** @var User $astro */
        $astro = User::factory()->create();
        $this->actingAs($astro)->postJson('api/chatRooms', [
            'name' => 'Paradise'
        ])->assertCreated();

        /** @var User $user2 */
        $user2 = User::factory()->create();
        $this->actingAs($user2)->post('api/chatRooms/1/members')->assertNoContent();

        /** @var ChatRoom $chatroom */
        $chatroom = ChatRoom::query()->find(1);
        $this->assertSame($chatroom->members()->get()->find(1)['name'], $astro->name);
        $this->assertSame($chatroom->members()->get()->find(2)['name'], $user2->name);
    }

    public function test_user_can_leave_a_chat_room()
    {
        /** @var User $jerry */
        $jerry = User::factory()->create(['name' => 'jerry']);
        /** @var ChatRoom $chatRoom */
        $chatRoom = $this->actingAs($jerry)->postJson('api/chatRooms', [
            'name' => 'Paradise'
        ])->assertCreated()->getOriginalContent();

        /** @var User $abby */
        $abby = User::factory()->create(['name' => 'abby']);

        $chatRoom->members()->save($jerry);
        $chatRoom->members()->save($abby);

        $this->actingAs($jerry)->delete('api/chatRooms/1/members')->assertNoContent();

        $chatRoom->refresh();

        // assert that abby is the only member of chat room No.1
        $this->assertCount(1, $chatRoom->members()->get());
        $this->assertSame('abby', $chatRoom->members()->get()[0]->name);
    }
}
