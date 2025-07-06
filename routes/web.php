<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Courses Routes
    Route::get('courses', function () {
        return Inertia::render('courses/index');
    })->name('courses.index');
    Route::get('courses/{course:slug}', [App\Http\Controllers\CourseController::class, 'show'])->name('courses.show');

    // Mood Tracker Routes
    Route::get('/mood-tracker', [App\Http\Controllers\MoodTrackerController::class, 'index'])->name('mood-tracker.index');
    Route::post('/mood-tracker', [App\Http\Controllers\MoodTrackerController::class, 'store'])->name('mood-tracker.store');
    Route::get('/api/mood-analytics', [App\Http\Controllers\MoodTrackerController::class, 'analytics'])->name('mood-tracker.analytics');

    Route::get('courses/{course:slug}/modules/{module:slug}', [App\Http\Controllers\ModuleController::class, 'show'])
        ->name('modules.show')
        ->where(['course' => '[a-z0-9-]+', 'module' => '[a-z0-9-]+']);

    Route::get('courses/{course:slug}/modules/{module:slug}/quizzes/{quiz:slug}', function ($course, $module, $quiz) {
        return Inertia::render('courses/modules/quizzes/show', ['course' => $course, 'module' => $module, 'quiz' => $quiz]);
    })->name('quizzes.show');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
