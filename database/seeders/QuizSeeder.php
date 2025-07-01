<?php

namespace Database\Seeders;

use App\Models\Quiz;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quizzes = [
            // Module 1 - Stress Management
            [
                'module_id' => 1,
                'question' => 'Apa yang dimaksud dengan stres?',
                'option_a' => 'Rasa lelah',
                'option_b' => 'Respons tubuh terhadap tekanan',
                'option_c' => 'Gangguan tidur',
                'option_d' => 'Perasaan bahagia',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 1,
                'question' => 'Manakah yang merupakan gejala stres fisik?',
                'option_a' => 'Sakit kepala',
                'option_b' => 'Merasa senang',
                'option_c' => 'Tidur nyenyak',
                'option_d' => 'Nafsu makan bertambah',
                'correct_answer' => 'A',
            ],
            [
                'module_id' => 1,
                'question' => 'Teknik manajemen stres yang efektif adalah?',
                'option_a' => 'Menghindari semua masalah',
                'option_b' => 'Meditasi dan relaksasi',
                'option_c' => 'Bekerja tanpa istirahat',
                'option_d' => 'Mengonsumsi kafein berlebihan',
                'correct_answer' => 'B',
            ],

            // Module 2 - Public Speaking
            [
                'module_id' => 2,
                'question' => 'Apa hal penting dalam public speaking?',
                'option_a' => 'Berteriak',
                'option_b' => 'Bicara cepat',
                'option_c' => 'Kontak mata',
                'option_d' => 'Diam saja',
                'correct_answer' => 'C',
            ],
            [
                'module_id' => 2,
                'question' => 'Bagaimana cara mengatasi gugup saat presentasi?',
                'option_a' => 'Berlatih sebelumnya',
                'option_b' => 'Tidak persiapan',
                'option_c' => 'Berbicara tanpa jeda',
                'option_d' => 'Menghindari audiens',
                'correct_answer' => 'A',
            ],
            [
                'module_id' => 2,
                'question' => 'Struktur presentasi yang baik dimulai dengan?',
                'option_a' => 'Kesimpulan',
                'option_b' => 'Pembukaan yang menarik',
                'option_c' => 'Detail teknis',
                'option_d' => 'Sesi tanya jawab',
                'correct_answer' => 'B',
            ],

            // Module 3 - Time Management
            [
                'module_id' => 3,
                'question' => 'Prinsip utama manajemen waktu adalah?',
                'option_a' => 'Bekerja sepanjang hari',
                'option_b' => 'Prioritas dan perencanaan',
                'option_c' => 'Multitasking terus menerus',
                'option_d' => 'Menunda semua tugas',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 3,
                'question' => 'Teknik Pomodoro menggunakan interval waktu?',
                'option_a' => '15 menit',
                'option_b' => '25 menit',
                'option_c' => '45 menit',
                'option_d' => '60 menit',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 3,
                'question' => 'Matrix Eisenhower membagi tugas berdasarkan?',
                'option_a' => 'Waktu dan tempat',
                'option_b' => 'Penting dan mendesak',
                'option_c' => 'Mudah dan sulit',
                'option_d' => 'Suka dan tidak suka',
                'correct_answer' => 'B',
            ],

            // Module 4 - Emotional Intelligence
            [
                'module_id' => 4,
                'question' => 'Kecerdasan emosional meliputi kemampuan untuk?',
                'option_a' => 'Menghitung dengan cepat',
                'option_b' => 'Mengenali dan mengelola emosi',
                'option_c' => 'Menghapal informasi',
                'option_d' => 'Berbicara banyak bahasa',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 4,
                'question' => 'Empati adalah kemampuan untuk?',
                'option_a' => 'Mengkritik orang lain',
                'option_b' => 'Memahami perasaan orang lain',
                'option_c' => 'Menyembunyikan emosi',
                'option_d' => 'Menghindari konflik',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 4,
                'question' => 'Cara meningkatkan kesadaran diri adalah?',
                'option_a' => 'Menghindari refleksi',
                'option_b' => 'Menyalahkan orang lain',
                'option_c' => 'Refleksi dan self-assessment',
                'option_d' => 'Mengabaikan feedback',
                'correct_answer' => 'C',
            ],

            // Module 5 - Team Collaboration
            [
                'module_id' => 5,
                'question' => 'Elemen penting dalam kerja tim yang efektif adalah?',
                'option_a' => 'Kompetisi antar anggota',
                'option_b' => 'Komunikasi dan kepercayaan',
                'option_c' => 'Bekerja sendiri-sendiri',
                'option_d' => 'Menghindari konflik',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 5,
                'question' => 'Konflik dalam tim sebaiknya?',
                'option_a' => 'Dihindari total',
                'option_b' => 'Diselesaikan dengan diskusi terbuka',
                'option_c' => 'Dibiarkan sampai hilang sendiri',
                'option_d' => 'Diserahkan pada atasan',
                'correct_answer' => 'B',
            ],
            [
                'module_id' => 5,
                'question' => 'Peran pemimpin tim yang baik adalah?',
                'option_a' => 'Mengontrol semua keputusan',
                'option_b' => 'Memfasilitasi dan memberdayakan anggota',
                'option_c' => 'Bekerja sendiri',
                'option_d' => 'Menghindari tanggung jawab',
                'correct_answer' => 'B',
            ],
        ];

        foreach ($quizzes as $quiz) {
            Quiz::create($quiz);
        }
    }
}
