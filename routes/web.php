<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use function Termwind\render;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Course Modules and Quizzes
    Route::get('courses/{course:slug}/modules/{module:slug}', [App\Http\Controllers\ModuleController::class, 'show'])
        ->name('modules.show')
        ->where(['course' => '[a-z0-9-]+', 'module' => '[a-z0-9-]+']);
    Route::get('courses/{course:slug}/modules/{module:slug}/quizzes/{quiz:slug}', function ($course, $module, $quiz) {
        return Inertia::render('courses/modules/quizzes/show', ['course' => $course, 'module' => $module, 'quiz' => $quiz]);
    })->name('quizzes.show');
    Route::get('courses', function () {
        return Inertia::render('courses/index');
    })->name('courses.index');
    Route::get('courses/{course:slug}', [App\Http\Controllers\CourseController::class, 'show'])->name('courses.show');

    // Mood Tracker Routes
    Route::get('/mood-tracker', [App\Http\Controllers\MoodTrackerController::class, 'index'])->name('mood-tracker.index');
    Route::get('/mood-tracker/analytics', [App\Http\Controllers\MoodTrackerController::class, 'analytics'])->name('mood-tracker.analytics');
    Route::get('/mood-tracker/create', [App\Http\Controllers\MoodTrackerController::class, 'create'])->name('mood-tracker.create');
    Route::post('/mood-tracker', [App\Http\Controllers\MoodTrackerController::class, 'store'])->name('mood-tracker.store');
    Route::get('/mood-tracker/{moodTracker}', [App\Http\Controllers\MoodTrackerController::class, 'show'])
        ->where('moodTracker', '[0-9]+')
        ->name('mood-tracker.show');
    Route::get('/mood-tracker/{moodTracker}/edit', [App\Http\Controllers\MoodTrackerController::class, 'edit'])->name('mood-tracker.edit');
    Route::put('/mood-tracker/{moodTracker}/edit', [App\Http\Controllers\MoodTrackerController::class, 'update'])->name('mood-tracker.update');
    Route::delete('/mood-tracker/{moodTracker}', [App\Http\Controllers\MoodTrackerController::class, 'destroy'])->name('mood-tracker.destroy');

    // Journal Routes
    Route::get('/journal', [App\Http\Controllers\JournalController::class, 'index'])->name('journal.index');
    Route::get('/journal/create', [App\Http\Controllers\JournalController::class, 'create'])->name('journal.create');
    Route::post('/journal', [App\Http\Controllers\JournalController::class, 'store'])->name('journal.store');
    Route::get('/journal/{journal:slug}', [App\Http\Controllers\JournalController::class, 'show'])->name('journal.show');
    Route::get('/journal/{journal:slug}/edit', [App\Http\Controllers\JournalController::class, 'edit'])->name('journal.edit');
    Route::put('/journal/{journal:slug}/edit', [App\Http\Controllers\JournalController::class, 'update'])->name('journal.update');
    Route::delete('/journal/{journal:slug}', [App\Http\Controllers\JournalController::class, 'destroy'])->name('journal.destroy');

    // Self-Assessment Routes
    Route::get('/self-assessments', [App\Http\Controllers\SelfAssessmentController::class, 'index'])->name('self-assessments.index');
    Route::get('/self-assessments/{assessment:slug}', [App\Http\Controllers\SelfAssessmentController::class, 'show'])
        ->name('self-assessments.show')
        ->where('assessment', '[a-z0-9-]+');
    Route::post('/self-assessments/{assessment:slug}', [App\Http\Controllers\SelfAssessmentController::class, 'submit'])
        ->name('self-assessments.submit')
        ->where('assessment', '[a-z0-9-]+');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
