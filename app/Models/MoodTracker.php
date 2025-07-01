<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoodTracker extends Model
{
    protected $fillable = [
        'user_id',
        'mood',
        'notes',
        'tracked_at',
    ];

    /**
     * Get the user that owns the mood tracker.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
