<?php

namespace App\Models;

use App\Models\Traits\BelongsToCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int    id
 * @property string $name
 */
class ChatRoom extends Model
{
    use BelongsToCreator;
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    protected $appends = [
        'resource_type'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'pivot'
    ];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_chatroom');
    }

    public function getResourceTypeAttribute(): string
    {
        return $this->table;
    }
}
