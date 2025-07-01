<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityMessage extends Model
{
    protected $fillable = [
        'message',
        'user_id',
        'community_room_id',
    ];

    /**
     * Get the user that owns the community message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the community room that the message belongs to.
     */
    public function communityRoom()
    {
        return $this->belongsTo(CommunityRoom::class);
    }
}
