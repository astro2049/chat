<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => ['required', 'between:2,21', (new Unique('users'))->withoutTrashed()],
            'password' => ['required', 'between:2,21']
        ]);

        return User::query()->create([
            'name' => $request->get('name'),
            'password' => Hash::make($request->get('password'))
        ]);
    }

    public function me(): Model|Collection|Builder|array|null
    {
        $userId = auth()->id();

        return User::query()->with(['friends', 'chatRooms'])->find($userId);
    }
}
