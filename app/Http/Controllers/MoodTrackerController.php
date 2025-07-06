<?php

namespace App\Http\Controllers;

use App\Models\MoodTracker;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoodTrackerController extends Controller
{
    /**
     * Display the mood tracker page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $moodEntries = MoodTracker::where('user_id', auth()->id())
            ->orderBy('tracked_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(30) // Last 30 entries
            ->get();

        return Inertia::render('mood-tracker/index', [
            'moodEntries' => $moodEntries
        ]);
    }

    /**
     * Store a new mood entry.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'mood' => 'required|string|in:happy,neutral,sad,stressed,calm',
            'note' => 'nullable|string|max:1000',
        ]);

        // Check if user already tracked mood today
        $today = now()->toDateString();
        $existingEntry = MoodTracker::where('user_id', auth()->id())
            ->whereDate('tracked_at', $today)
            ->first();

        if ($existingEntry) {
            // Update existing entry
            $existingEntry->update([
                'mood' => $request->input('mood'),
                'note' => $request->input('note', ''),
            ]);
        } else {
            // Create new entry
            MoodTracker::create([
                'user_id' => auth()->id(),
                'mood' => $request->input('mood'),
                'note' => $request->input('note', ''),
                'tracked_at' => $today,
            ]);
        }

        return redirect()->back()->with('success', 'Mood berhasil disimpan!');
    }

    /**
     * Get mood analytics for dashboard
     */
    public function analytics()
    {
        $userId = auth()->id();
        
        // Get mood data for the last 7 days
        $weeklyMoods = MoodTracker::where('user_id', $userId)
            ->where('tracked_at', '>=', now()->subDays(7))
            ->orderBy('tracked_at', 'desc')
            ->get();

        // Get today's mood
        $todayMood = MoodTracker::where('user_id', $userId)
            ->whereDate('tracked_at', now()->toDateString())
            ->first();

        return response()->json([
            'weeklyMoods' => $weeklyMoods,
            'todayMood' => $todayMood,
            'hasTrackedToday' => $todayMood !== null
        ]);
    }
}