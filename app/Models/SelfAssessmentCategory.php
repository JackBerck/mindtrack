<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelfAssessmentCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = self::generateUniqueSlug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = self::generateUniqueSlug($category->name);
            }
        });
    }

    /**
     * Generate unique slug from name
     */
    private static function generateUniqueSlug($name)
    {
        $slug = \Illuminate\Support\Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (self::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Get the self-assessments for the category.
     */
    public function selfAssessments()
    {
        return $this->hasMany(SelfAssessment::class);
    }
}
