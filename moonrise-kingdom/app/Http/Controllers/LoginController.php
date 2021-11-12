<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function authenticate(Request $request): array
    {
        $this->validate($request, [
            'name' => ['required', 'between:2,21'],
            'password' => ['required', 'between:2,21']
        ]);

        $success = auth()->attempt([
            'name' => $request['name'],
            'password' => $request['password']
        ]);
        if (!$success) {
            abort(401);
        }

        $token = auth()->user()->createToken('traveler')->plainTextToken;

        return [
            'user' => auth()->user(),
            'token' => $token
        ];
    }
}
