<?php

namespace App\Services;

use App\Models\User;
use App\Models\Badge;
use App\Models\UserBadge;

class BadgeService
{
    /**
     * Check and award badges for a user based on their activities
     */
    public function checkAndAwardBadges(User $user): array
    {
        $newBadges = [];
        $badges = Badge::where('is_active', true)->get();

        foreach ($badges as $badge) {
            if (!$user->hasBadge($badge->id) && $this->meetsCriteria($user, $badge)) {
                if ($user->awardBadge($badge->id)) {
                    $newBadges[] = $badge;
                }
            }
        }

        return $newBadges;
    }

    /**
     * Check if user meets badge criteria
     */
    private function meetsCriteria(User $user, Badge $badge): bool
    {
        $criteria = $badge->criteria;

        if (!$criteria) {
            return false;
        }

        // Check courses completed
        if (isset($criteria['courses_completed'])) {
            $completedCourses = $user->courseProgress()
                ->where('completion_percentage', 100)
                ->count();

            if ($completedCourses < $criteria['courses_completed']) {
                return false;
            }
        }

        // Check mental health courses
        if (isset($criteria['mental_health_courses'])) {
            $mentalHealthCourses = $user->courseProgress()
                ->whereHas('course', function ($query) {
                    $query->where('category', 'Mental Health');
                })
                ->where('completion_percentage', 100)
                ->count();

            if ($mentalHealthCourses < $criteria['mental_health_courses']) {
                return false;
            }
        }

        // Check perfect quiz scores
        if (isset($criteria['perfect_quizzes'])) {
            $perfectQuizzes = $user->quizAttempts()
                ->where('score', 100)
                ->count();

            if ($perfectQuizzes < $criteria['perfect_quizzes']) {
                return false;
            }
        }

        // Check daily streak
        if (isset($criteria['daily_streak'])) {
            $currentStreak = $this->calculateCurrentStreak($user);

            if ($currentStreak < $criteria['daily_streak']) {
                return false;
            }
        }

        // Check early user
        if (isset($criteria['early_user'])) {
            $platformLaunchDate = '2025-01-01'; // Set your platform launch date
            $earlyPeriodEnd = date('Y-m-d', strtotime($platformLaunchDate . ' +1 month'));

            if ($user->created_at->format('Y-m-d') > $earlyPeriodEnd) {
                return false;
            }
        }

        return true;
    }

    /**
     * Calculate current learning streak
     */
    private function calculateCurrentStreak(User $user): int
    {
        // Implement logic to calculate consecutive days of learning
        // This could be based on course progress, quiz attempts, etc.
        return 0; // Placeholder
    }

    /**
     * Get user's badge progress
     */
    public function getBadgeProgress(User $user): array
    {
        $badges = Badge::where('is_active', true)->get();
        $progress = [];

        foreach ($badges as $badge) {
            $hasAchieved = $user->hasBadge($badge->id);
            $progressPercentage = $hasAchieved ? 100 : $this->calculateProgress($user, $badge);

            $progress[] = [
                'badge' => $badge,
                'achieved' => $hasAchieved,
                'progress' => $progressPercentage,
                'achieved_at' => $hasAchieved ? $user->userBadges()->where('badge_id', $badge->id)->first()->achieved_at : null,
            ];
        }

        return $progress;
    }

    /**
     * Calculate progress towards a badge
     */
    private function calculateProgress(User $user, Badge $badge): int
    {
        $criteria = $badge->criteria;
        if (!$criteria) return 0;

        $totalCriteria = count($criteria);
        $metCriteria = 0;

        foreach ($criteria as $key => $value) {
            switch ($key) {
                case 'courses_completed':
                    $completed = $user->courseProgress()->where('completion_percentage', 100)->count();
                    $metCriteria += min($completed / $value, 1);
                    break;
                    // Add other criteria calculations
            }
        }

        return min(($metCriteria / $totalCriteria) * 100, 100);
    }
}
