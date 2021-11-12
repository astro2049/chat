<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function store(Request $request): Model|Builder
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

    /**
     * @throws ValidationException
     * @throws AuthorizationException
     */
    public function update(Request $request, User $user): Response
    {
        $this->validate($request, [
            'newFriend' => ['required', 'string']
        ]);

        $this->authorize('operatingOnMyself', $user);

        $friendName = $request->input('newFriend');

        /** @var User $friend */
        $friend = User::query()->where('name', $friendName)->first();
        if ($friend == null) {
            abort(403, 'target friend does not exist');
        }
        if ($user->name == $friend->name) {
            abort(403, 'nah');
        }

        $user->friends()->syncWithoutDetaching($friend);
        $friend->friends()->syncWithoutDetaching($user);

        return response()->noContent();
    }
}
