<?php

namespace Database\Seeders;

use App\Models\CourseCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courseCategories = [
            ['name' => 'Manajemen Kecemasan', 'slug' => 'manajemen-kecemasan', 'description' => 'Kursus yang berfokus pada pemahaman dan pengelolaan gangguan kecemasan dan stres.'],
            ['name' => 'Dukungan Depresi', 'slug' => 'dukungan-depresi', 'description' => 'Kursus yang menyediakan alat dan strategi untuk mengatasi depresi.'],
            ['name' => 'Mindfulness & Meditasi', 'slug' => 'mindfulness-meditasi', 'description' => 'Kursus yang mengajarkan praktik mindfulness dan teknik meditasi untuk kesehatan mental.'],
            ['name' => 'Manajemen Stres', 'slug' => 'manajemen-stres', 'description' => 'Kursus tentang mengidentifikasi pemicu stres dan mengembangkan mekanisme koping yang sehat.'],
            ['name' => 'Perawatan Diri & Kesejahteraan', 'slug' => 'perawatan-diri-kesejahteraan', 'description' => 'Kursus yang mempromosikan praktik perawatan diri dan kesehatan mental secara keseluruhan.'],
        ];

        foreach ($courseCategories as $category) {
            CourseCategory::create($category);
        }
    }
}
