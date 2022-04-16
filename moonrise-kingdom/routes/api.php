<?php

use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('users', [UserController::class, 'store']);
Route::post('login', [LoginController::class, 'authenticate']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('users/me', [UserController::class, 'me']);
    Route::post('users/{user}/friends/{friend}', [UserController::class, 'addFriend']);
    Route::delete('users/{user}/friends/{friend}', [UserController::class, 'deleteFriend']);

    Route::resource('chatRooms', ChatRoomController::class)->only('store', 'destroy');
    Route::post('chatRooms/{chatRoom}/members', [ChatRoomController::class, 'addMember']);
    Route::delete('chatRooms/{chatRoom}/members', [ChatRoomController::class, 'deleteMember']);
});
