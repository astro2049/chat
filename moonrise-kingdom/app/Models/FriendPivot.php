<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $duet_id
 * @property int $host_user_id
 * @property int $guest_user_id
 */
class FriendPivot extends Model
{
    use HasFactory;

    protected $table = 'friends';

    protected $fillable = [
        'duet_id',
        'host_user_id',
        'guest_user_id'
    ];
}
