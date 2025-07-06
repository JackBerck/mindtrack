<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Journal extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'mood',
        'word_count',
        'user_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($journal) {
            if (empty($journal->slug)) {
                $journal->slug = $journal->generateUniqueSlug($journal->title);
            }
        });

        static::updating(function ($journal) {
            if ($journal->isDirty('title')) {
                $journal->slug = $journal->generateUniqueSlug($journal->title);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get excerpt of content
     */
    public function getExcerptAttribute($maxLength = 150)
    {
        if (strlen($this->content) <= $maxLength) {
            return $this->content;
        }
        return substr($this->content, 0, $maxLength) . '...';
    }

    /**
     * Get reading time in minutes
     */
    public function getReadingTimeAttribute()
    {
        return max(1, ceil($this->word_count / 200));
    }

    /**
     * Generate unique slug from title
     */
    private function generateUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id ?? 0)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
