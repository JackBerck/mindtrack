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
                'thumbnail' => 'course-images/stress-course.jpg',
            ],
            [
                'title' => 'Public Speaking untuk Pemula',
                'description' => 'Cara membangun rasa percaya diri saat berbicara.',
                'thumbnail' => 'course-images/public-speaking-course.jpg',
            ],
            [
                'title' => 'Mindfulness dan Meditasi',
                'description' => 'Teknik mindfulness untuk ketenangan mental.',
                'thumbnail' => 'course-images/mindfulness-course.jpg',
            ],
            [
                'title' => 'Mengatasi Kecemasan Sosial',
                'description' => 'Strategi praktis untuk mengurangi kecemasan dalam situasi sosial.',
                'thumbnail' => 'course-images/social-anxiety-course.jpg',
            ],
            [
                'title' => 'Membangun Kepercayaan Diri',
                'description' => 'Langkah-langkah meningkatkan rasa percaya diri.',
                'thumbnail' => 'course-images/confidence-course.jpg',
            ],
            [
                'title' => 'Manajemen Emosi',
                'description' => 'Cara mengenali dan mengelola emosi dengan baik.',
                'thumbnail' => 'course-images/emotion-management-course.jpg',
            ]
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
