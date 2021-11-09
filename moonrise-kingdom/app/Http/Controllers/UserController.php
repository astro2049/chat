<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
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

    public function me(): Authenticatable
    {
        return auth()->user();
    }
}
