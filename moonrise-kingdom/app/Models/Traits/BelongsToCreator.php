<?php

namespace App\Models\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Trait BelongsToCreator.
 *
 * @property int $creator_id
 * @property User $creator
 */
trait BelongsToCreator
{
    public static function bootBelongsToCreator()
    {
        static::creating(function (Model $model) {
            $model->creator_id = \auth()->id();
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function isCreatedBy(User|int $user): bool
    {
        if ($user instanceof User) {
            $user = $user->id;
        }

        return $this->creator_id == \intval($user);
    }
}
