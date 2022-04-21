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
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function store(Request $request): Model|Builder
    {
        $this->validate($request, [
            'name' => ['required', 'between:1,21'],
            'password' => ['required', 'between:1,21']
        ]);

        if (User::query()->where('name', $request->get('name'))->exists()) {
            abort(403, '23');
        }

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
     * @throws AuthorizationException
     */
    public function addFriend(User $user, User $friend): Response
    {
        $this->authorize('operatingOnMyself', $user);

        if ($user->name == $friend->name) {
            abort(403, 'nah');
        }

        $friendPivots = $this->findFriendPivots($user, $friend);

        // abort if friendship is already established
        if ($friendPivots->isNotEmpty()) {
            abort(403, 'already friends :)');
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

        Http::withoutVerifying()
            ->Post(config('notification.service_url') . '/api/notifications/new-friend', [
                'name' => $friend->name
            ]);

        return response()->noContent();
    }

    private function findFriendPivots(User $user, User $friend): Collection|array
    {
        return FriendPivot::query()
            ->where(
                fn ($q) => $q
                    ->where(
                        fn ($q1) => $q1->where('host_user_id', $user->id)
                            ->where('guest_user_id', $friend->id)
                    )->orWhere(
                        fn ($q2) => $q2->where('host_user_id', $friend->id)
                            ->where('guest_user_id', $user->id)
                    )
            )
            ->get();
    }

    /**
     * @throws AuthorizationException
     */
    public function deleteFriend(User $user, User $friend): Response
    {
        $this->authorize('operatingOnMyself', $user);

        if ($user->name == $friend->name) {
            abort(403, 'nah');
        }

        $friendPivots = $this->findFriendPivots($user, $friend);

        // abort if friendship is not established
        if ($friendPivots->isEmpty()) {
            abort(403, 'not friends yet');
        }

        foreach ($friendPivots as $friendPivot) {
            $friendPivot->delete();
        }

        Http::withoutVerifying()
            ->Post(config('notification.service_url') . '/api/notifications/ended-friendship', [
                'guest_name' => $friend->name,
                'initiator_name' => $user->name
            ]);

        return response()->noContent();
    }
}
