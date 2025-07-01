<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CommunityRoom extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'is_anonymous',
        'user_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($room) {
            if (empty($room->slug)) {
                $room->slug = $room->generateUniqueSlug($room->name);
            }
        });

        static::updating(function ($room) {
            if ($room->isDirty('name') && empty($room->slug)) {
                $room->slug = $room->generateUniqueSlug($room->name);
            }
        });
    }

    /**
     * Get the user that owns the community room.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate unique slug from name
     */
    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
