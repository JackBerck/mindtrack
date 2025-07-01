<?php

namespace Database\Seeders;

use App\Models\Journal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JournalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $journals = [
            [
                'user_id' => 1,
                'title' => 'Hari yang Melelahkan',
                'content' => 'Hari ini saya merasa sangat lelah tapi tetap berusaha semangat.',
            ],
            [
                'user_id' => 2,
                'title' => 'Pengalaman Public Speaking Pertama',
                'content' => 'Hari ini saya berhasil bicara di depan umum dengan lancar.',
            ],
            [
                'user_id' => 3,
                'title' => 'Pencapaian Kecil yang Berarti',
                'content' => 'Berhasil menyelesaikan proyek kecil hari ini. Merasa bangga dengan usaha yang telah dilakukan.',
            ],
            [
                'user_id' => 4,
                'title' => 'Refleksi Akhir Pekan',
                'content' => 'Minggu ini penuh dengan tantangan, tapi saya belajar banyak hal baru yang berharga.',
            ],
            [
                'user_id' => 5,
                'title' => 'Moment Kebahagiaan Sederhana',
                'content' => 'Hari ini menikmati secangkir kopi sambil membaca buku. Kadang kebahagiaan ada di hal-hal sederhana.',
            ],
        ];

        foreach ($journals as $journal) {
            Journal::create($journal);
        }
    }
}
