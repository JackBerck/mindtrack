<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $courses = Course::latest()->take(2)->get();
        $user = Auth::user()->load([
            'moodTrackers' => function ($query) {
                $query->whereDate('created_at', today());
            },
            'userCourses',
            'userBadgesWithProgress'
        ]);

        return inertia('dashboard', [
            'courses' => $courses,
            'user' => $user,
        ]);
    }
}
