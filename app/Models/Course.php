<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'slug',
        'thumbnail',
        'tags',
        'what_you_will_learn',
        'time_to_complete',
        'course_category_id',
        'level',
    ];

    protected $casts = [
        'tags' => 'array', // Store tags as an array
        'what_you_will_learn' => 'array', // Store learning outcomes as an array
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($course) {
            if (empty($course->slug)) {
                $course->slug = $course->generateUniqueSlug($course->title);
            }
        });

        static::updating(function ($course) {
            if ($course->isDirty('title') && empty($course->slug)) {
                $course->slug = $course->generateUniqueSlug($course->title);
            }
        });
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function category()
    {
        return $this->belongsTo(CourseCategory::class);
    }

    /**
     * Generate unique slug from title
     */
    private function generateUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}