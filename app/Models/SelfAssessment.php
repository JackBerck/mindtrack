<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class SelfAssessment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'difficulty', // Difficulty level (e.g., easy, medium, hard)
        'tags', // JSON array of tags
        'self_assessment_category_id', // Foreign key to SelfAssessmentCategory
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'tags' => 'array', // Cast tags to array for JSON storage
    ];
    
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($assessment) {
            if (empty($assessment->slug)) {
                $assessment->slug = $assessment->generateUniqueSlug($assessment->title);
            }
        });

        static::updating(function ($assessment) {
            if ($assessment->isDirty('title') && empty($assessment->slug)) {
                $assessment->slug = $assessment->generateUniqueSlug($assessment->title);
            }
        });
    }

    /**
     * Get the questions for the self-assessment.
     */
    public function questions()
    {
        return $this->hasMany(AssessmentQuestion::class);
    }

    /**
     * Get the category for the self-assessment.
     */
    public function category()
    {
        return $this->belongsTo(SelfAssessmentCategory::class, 'self_assessment_category_id');
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
