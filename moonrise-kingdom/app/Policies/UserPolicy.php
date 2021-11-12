<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function operatingOnMyself(User $me, User $user): bool
    {
        return $me->name === $user->name;
    }
}
