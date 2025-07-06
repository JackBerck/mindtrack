<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            [
                'name' => 'First Steps',
                'description' => 'Menyelesaikan course pertama',
                'icon' => '🏃‍♂️',
                'type' => 'milestone',
                'criteria' => ['courses_completed' => 1],
            ],
            [
                'name' => 'Learning Enthusiast',
                'description' => 'Menyelesaikan 5 course',
                'icon' => '📚',
                'type' => 'achievement',
                'criteria' => ['courses_completed' => 5],
            ],
            [
                'name' => 'Mental Health Champion',
                'description' => 'Menyelesaikan 3 course mental health',
                'icon' => '🧠',
                'type' => 'achievement',
                'criteria' => ['mental_health_courses' => 3],
            ],
            [
                'name' => 'Streak Master',
                'description' => 'Belajar 7 hari berturut-turut',
                'icon' => '🔥',
                'type' => 'achievement',
                'criteria' => ['daily_streak' => 7],
            ],
            [
                'name' => 'Quiz Master',
                'description' => 'Mendapat nilai 100% di 5 quiz',
                'icon' => '🎯',
                'type' => 'achievement',
                'criteria' => ['perfect_quizzes' => 5],
            ],
            [
                'name' => 'Early Bird',
                'description' => 'Bergabung di bulan pertama platform',
                'icon' => '🐦',
                'type' => 'special',
                'criteria' => ['early_user' => true],
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}