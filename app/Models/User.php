<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the journals for the user.
     */
    public function journals()
    {
        return $this->hasMany(Journal::class);
    }

    /**
     * Get the mood trackers for the user.
     */
    public function moodTrackers()
    {
        return $this->hasMany(MoodTracker::class);
    }

    /**
     * Get the courses for the user.
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'user_courses')
            ->withTimestamps()
            ->withPivot('progress', 'is_completed');
    }

    /**
     * Get the badges for the user.
     */
    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withTimestamps()
            ->withPivot('achieved_at');
    }

    public function userBadges()
    {
        return $this->hasMany(UserBadge::class);
    }

    public function hasBadges($badgeId)
    {
        return $this->badges()->where('badge_id', $badgeId)->exists();
    }

    public function awardBadge($badgeId)
    {
        if (!$this->userBadges($badgeId)) {
            $this->badges()->attach($badgeId, ['achieved_at' => now()]);
            return true; // Badge awarded successfully
        }

        return false; // Badge already awarded
    }

    /**
     * Get the user courses with progress.
     */
    public function userCourses()
    {
        return $this->hasMany(UserCourse::class)
            ->with('course')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get the user badges with progress.
     */
    public function userBadgesWithProgress()
    {
        return $this->hasMany(UserBadge::class)
            ->with('badge')
            ->orderBy('achieved_at', 'desc');
    }

    /**
     * Get the assessment results for the user.
     */
    public function assessmentResults()
    {
        return $this->hasMany(AssessmentResult::class);
    }
}
