<?php

namespace Database\Seeders;

use App\Models\SelfAssessment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SelfAssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assessments = [
            [
                'title' => 'Tes Kesehatan Mental',
                'description' => 'Penilaian untuk mengukur kesehatan mental Anda.',
            ],
            [
                'title' => 'Tes Tingkat Stres',
                'description' => 'Penilaian untuk mengukur tingkat stres Anda.',
            ],
            [
                'title' => 'Tes Kecemasan',
                'description' => 'Penilaian untuk mengukur tingkat kecemasan dan kekhawatiran Anda.',
            ],
            [
                'title' => 'Tes Depresi',
                'description' => 'Penilaian untuk mengidentifikasi gejala depresi.',
            ],
        ];

        // Buat assessments terlebih dahulu
        foreach ($assessments as $assessment) {
            SelfAssessment::create($assessment);
        }

        $assessmentQuestions = [
            // Questions for Tes Kesehatan Mental (ID: 1)
            [
                'self_assessment_id' => 1,
                'question' => 'Saya sering merasa cemas tanpa alasan jelas.',
            ],
            [
                'self_assessment_id' => 1,
                'question' => 'Saya kesulitan untuk tidur nyenyak.',
            ],
            [
                'self_assessment_id' => 1,
                'question' => 'Saya merasa mudah tersinggung atau marah.',
            ],
            
            // Questions for Tes Tingkat Stres (ID: 2)
            [
                'self_assessment_id' => 2,
                'question' => 'Saya merasa kewalahan dengan tanggung jawab harian.',
            ],
            [
                'self_assessment_id' => 2,
                'question' => 'Saya sulit berkonsentrasi pada pekerjaan.',
            ],
            [
                'self_assessment_id' => 2,
                'question' => 'Saya sering merasa lelah meskipun sudah beristirahat.',
            ],
            
            // Questions for Tes Kecemasan (ID: 3)
            [
                'self_assessment_id' => 3,
                'question' => 'Saya khawatir berlebihan tentang hal-hal kecil.',
            ],
            [
                'self_assessment_id' => 3,
                'question' => 'Saya mengalami gejala fisik seperti jantung berdebar saat cemas.',
            ],
            
            // Questions for Tes Depresi (ID: 4)
            [
                'self_assessment_id' => 4,
                'question' => 'Saya kehilangan minat pada aktivitas yang biasanya saya nikmati.',
            ],
            [
                'self_assessment_id' => 4,
                'question' => 'Saya merasa sedih atau putus asa hampir setiap hari.',
            ],
        ];

        foreach ($assessmentQuestions as $question) {
            SelfAssessment::find($question['self_assessment_id'])
                ->questions()
                ->create([
                    'self_assessment_id' => $question['self_assessment_id'],
                    'question' => $question['question'],
                ]);
        }
    }
}
