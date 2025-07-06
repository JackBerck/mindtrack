<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Mengelola Stres Ringan',
                'description' => 'Belajar mengelola stres dengan cara sederhana.',
                'slug' => 'mengelola-stres-ringan',
                'thumbnail' => 'course-images/stress-course.jpg',
                'tags' => ['stres', 'manajemen', 'kesehatan mental'],
                'what_you_will_learn' => ['Teknik relaksasi', 'Identifikasi pemicu stres', 'Strategi coping'],
                'time_to_complete' => 120,
                'course_category_id' => 1,
                'level' => 'beginner',
            ],
            [
                'title' => 'Public Speaking untuk Pemula',
                'description' => 'Cara membangun rasa percaya diri saat berbicara.',
                'slug' => 'public-speaking-untuk-pemula',
                'thumbnail' => 'course-images/public-speaking-course.jpg',
                'tags' => ['public speaking', 'komunikasi', 'kepercayaan diri'],
                'what_you_will_learn' => ['Teknik presentasi', 'Mengatasi demam panggung', 'Body language'],
                'time_to_complete' => 180,
                'course_category_id' => 2,
                'level' => 'beginner',
            ],
            [
                'title' => 'Mindfulness dan Meditasi',
                'description' => 'Teknik mindfulness untuk ketenangan mental.',
                'slug' => 'mindfulness-dan-meditasi',
                'thumbnail' => 'course-images/mindfulness-course.jpg',
                'tags' => ['mindfulness', 'meditasi', 'ketenangan'],
                'what_you_will_learn' => ['Teknik meditasi dasar', 'Mindful breathing', 'Kesadaran diri'],
                'time_to_complete' => 150,
                'course_category_id' => 3,
                'level' => 'beginner',
            ],
            [
                'title' => 'Mengatasi Kecemasan Sosial',
                'description' => 'Strategi praktis untuk mengurangi kecemasan dalam situasi sosial.',
                'slug' => 'mengatasi-kecemasan-sosial',
                'thumbnail' => 'course-images/social-anxiety-course.jpg',
                'tags' => ['kecemasan', 'sosial', 'terapi'],
                'what_you_will_learn' => ['Teknik exposure therapy', 'Cognitive restructuring', 'Social skills'],
                'time_to_complete' => 200,
                'course_category_id' => 4,
                'level' => 'intermediate',
            ],
            [
                'title' => 'Membangun Kepercayaan Diri',
                'description' => 'Langkah-langkah meningkatkan rasa percaya diri.',
                'slug' => 'membangun-kepercayaan-diri',
                'thumbnail' => 'course-images/confidence-course.jpg',
                'tags' => ['kepercayaan diri', 'self esteem', 'pengembangan diri'],
                'what_you_will_learn' => ['Self affirmation', 'Goal setting', 'Positive thinking'],
                'time_to_complete' => 160,
                'course_category_id' => 5,
                'level' => 'beginner',
            ],
            [
                'title' => 'Manajemen Emosi',
                'description' => 'Cara mengenali dan mengelola emosi dengan baik.',
                'slug' => 'manajemen-emosi',
                'thumbnail' => 'course-images/emotion-management-course.jpg',
                'tags' => ['emosi', 'manajemen', 'regulasi'],
                'what_you_will_learn' => ['Emotional awareness', 'Regulation techniques', 'Healthy expression'],
                'time_to_complete' => 140,
                'course_category_id' => 1,
                'level' => 'intermediate',
            ]
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
