<?php

namespace Tests\Feature;

use Tests\TestCase;

class ChatRoomTest extends TestCase
{
    public function test_chatroom_can_store()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_chatroom_can_show()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
