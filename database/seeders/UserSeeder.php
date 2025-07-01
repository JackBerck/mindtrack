<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'johndoe@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'janesmith@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Michael Johnson',
                'email' => 'michaeljohnson@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Sarah Wilson',
                'email' => 'sarahwilson@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'David Brown',
                'email' => 'davidbrown@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emilydavis@example.com',
                'password' => bcrypt('password123'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
