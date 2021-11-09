<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $name
 */
class ChatRoom extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_chatroom');
    }
}
