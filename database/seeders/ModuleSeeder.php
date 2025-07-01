<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            [
                'course_id' => 1,
                'title' => 'Apa Itu Stres?',
                'content_type' => 'text',
                'content_url' => '/modules/stress-intro',
            ],
            [
                'course_id' => 1,
                'title' => 'Teknik Pernapasan 4-7-8',
                'content_type' => 'video',
                'content_url' => '/modules/breathing-technique',
            ],
            [
                'course_id' => 2,
                'title' => 'Dasar Public Speaking',
                'content_type' => 'text',
                'content_url' => '/modules/public-speaking-basics',
            ],
            [
                'course_id' => 2,
                'title' => 'Cara Mengatasi Rasa Gugup',
                'content_type' => 'video',
                'content_url' => '/modules/overcome-nervousness',
            ],
            [
                'course_id' => 3,
                'title' => 'Pengenalan Mindfulness',
                'content_type' => 'text',
                'content_url' => '/modules/mindfulness-intro',
            ],
            [
                'course_id' => 3,
                'title' => 'Meditasi 10 Menit',
                'content_type' => 'video',
                'content_url' => '/modules/10-minute-meditation',
            ],
            [
                'course_id' => 4,
                'title' => 'Mengenal Kecemasan',
                'content_type' => 'text',
                'content_url' => '/modules/understanding-anxiety',
            ],
            [
                'course_id' => 4,
                'title' => 'Latihan Relaksasi Otot',
                'content_type' => 'video',
                'content_url' => '/modules/muscle-relaxation',
            ],
            [
                'course_id' => 5,
                'title' => 'Komunikasi Efektif',
                'content_type' => 'text',
                'content_url' => '/modules/effective-communication',
            ],
            [
                'course_id' => 5,
                'title' => 'Body Language Positif',
                'content_type' => 'video',
                'content_url' => '/modules/positive-body-language',
            ],
        ];

        foreach ($modules as $module) {
            Module::create($module);
        }
    }
}
