<?php

namespace App\Http\Controllers;

use App\Models\FriendPivot;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
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

        $friendPivot = FriendPivot::query()
            ->where(
                fn($q) => $q
                    ->where(
                        fn($q1) => $q1->where('host_user_id', $user->id)
                            ->where('guest_user_id', $friend->id)
                    )->orWhere(
                        fn($q2) => $q2->where('host_user_id', $friend->id)
                            ->where('guest_user_id', $user->id)
                    ))
            ->first();

        // return if friendship is already established
        if ($friendPivot != null) {
            return response()->noContent();
        }

        /** @var FriendPivot $newFriendPivot0 */
        $newFriendPivot0 = FriendPivot::query()->create([
            'host_user_id' => $user->id,
            'guest_user_id' => $friend->id
        ]);
        /** @var FriendPivot $newFriendPivot1 */
        $newFriendPivot1 = FriendPivot::query()->create([
            'host_user_id' => $friend->id,
            'guest_user_id' => $user->id
        ]);
        $newFriendPivot0->update(['duet_id' => $newFriendPivot0->id]);
        $newFriendPivot1->update(['duet_id' => $newFriendPivot0->id]);

        Http::Post(config('notification.service_url') . '/api/notifications/new-friend', [
            'name' => $friendName
        ]);

        return response()->noContent();
    }
}
