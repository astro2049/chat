<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_user_can_store()
    {
        $response = $this->postJson('api/users', [
            'name' => 'Jerry',
            'password' => 'astro'
        ]);

        $response->assertCreated()->assertJson([
            'name' => 'Jerry'
        ]);
    }

    public function test_user_can_login()
    {
        $password = 'Wicked Game';
        /** @var User $user */
        $user = User::factory()->create([
            'password' => Hash::make($password)
        ]);

        $response = $this->postJson('api/login', [
            'name' => $user->name,
            'password' => $password
        ])->assertOk()->json();

        $this->assertSame($user->name, $response['user']['name']);
        $this->assertArrayHasKey('token', $response);
    }

    public function test_can_get_myself()
    {
        /** @var User $user */
        $user = User::factory()->create([
            'password' => Hash::make('Terminus')
        ]);

        $this->get('api/users/me')->assertUnauthorized();

        $response = $this->actingAs($user)->get('api/users/me')->assertOk()->json();

        $this->assertSame($user->name, $response['name']);
    }

    public function test_user_can_add_a_friend()
    {
        /** @var User $me */
        $me = User::factory()->create();
        /** @var User $friend */
        $friend = User::factory()->create();

        Http::fake([
            config('notification.service_url') . '/api/notifications/new-friend' => Http::response()
        ]);

        $this->post('api/users/1/friends/' . $friend->name)->assertUnauthorized();

        $this->actingAs($me);
        $this->post('api/users/1/friends/' . $friend->name)->assertNoContent();
        $this->post('api/users/1/friends/' . $friend->name)->assertForbidden();

        $this->assertSame($me->friends()->get()[0]->name, $friend->name);
        $this->assertSame($friend->friends()->get()[0]->name, $me->name);
    }

    public function test_user_can_delete_a_friend()
    {
        /** @var User $me */
        $me = User::factory()->create();
        /** @var User $friend */
        $friend = User::factory()->create();

        $me->friends()->save($friend);
        $friend->friends()->save($me);

        $this->delete('api/users/1/friends/' . $friend->name)->assertUnauthorized();

        $this->actingAs($me);
        $this->delete('api/users/1/friends/' . $friend->name)->assertNoContent();
        $this->delete('api/users/1/friends/' . $friend->name)->assertForbidden();

        $this->assertEmpty($me->friends()->get());
        $this->assertEmpty($friend->friends()->get());
    }
}
