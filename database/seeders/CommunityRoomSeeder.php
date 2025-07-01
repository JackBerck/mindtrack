<?php

namespace Database\Seeders;

use App\Models\CommunityRoom;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommunityRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $communityRooms = [
            [
                'name' => 'Curhat Tanpa Nama',
                'is_anonymous' => true,
                'user_id' => 1, // Assuming user with ID 1 is the admin or creator
            ],
            [
                'name' => 'Tips Produktivitas',
                'is_anonymous' => false,
                'user_id' => 2, // Assuming user with ID 2 is the admin or creator
            ],
            [
                'name' => 'Diskusi Kesehatan Mental',
                'is_anonymous' => false,
                'user_id' => 3, // Assuming user with ID 3 is the admin or creator
            ],
            [
                'name' => 'Bincang Santai',
                'is_anonymous' => true,
                'user_id' => 4, // Assuming user with ID 4 is the admin or creator
            ],
            [
                'name' => 'Konseling Online',
                'is_anonymous' => false,
                'user_id' => 5, // Assuming user with ID 5 is the admin or creator
            ],
            [
                'name' => 'Support Group',
                'is_anonymous' => true,
                'user_id' => 1, // Assuming user with ID 1 is the admin or creator
            ],
        ];

        foreach ($communityRooms as $room) {
            CommunityRoom::create($room);
        }
    }
}
