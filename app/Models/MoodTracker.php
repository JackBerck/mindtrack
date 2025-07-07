<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MoodTracker extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mood',
        'intensity',
        'note',
        'triggers',
        'tracked_at',
    ];

    protected $casts = [
        'triggers' => 'array',
        'tracked_at' => 'date',
        'intensity' => 'integer',
    ];

    /**
     * Get the user that owns the mood tracker.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for filtering by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('tracked_at', [$startDate, $endDate]);
    }
}