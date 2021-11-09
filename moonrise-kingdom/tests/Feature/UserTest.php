<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
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

        $response = $this->actingAs($user)->get('api/users/me')->assertOk()->json();

        $this->assertSame($user->name, $response['name']);
    }
}
