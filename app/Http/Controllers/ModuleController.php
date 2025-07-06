<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Logic to display modules
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function show(Course $course, $moduleSlug)
    {
        // Validasi bahwa module dengan slug tersebut ada di course ini
        $module = $course->modules()
            ->where('slug', $moduleSlug)
            ->with(['quizzes'])
            ->firstOrFail();

        // Load modules untuk navigasi
        $course->load(['modules' => function ($query) {
            $query->orderBy('created_at');
        }]);

        return inertia('courses/modules/show', [
            'course' => $course,
            'module' => $module,
        ]);
    }
}
