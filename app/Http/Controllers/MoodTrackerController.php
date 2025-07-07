<?php

namespace App\Http\Controllers;

use App\Models\MoodTracker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MoodTrackerController extends Controller
{
    /**
     * Display the mood tracker dashboard.
     */
    public function index()
    {
        $userId = auth()->id();

        // Get recent mood entries (last 30 days)
        $moodEntries = MoodTracker::where('user_id', $userId)
            ->where('tracked_at', '>=', now()->subDays(30))
            ->orderBy('tracked_at', 'desc')
            ->get();

        // Calculate statistics
        $stats = $this->calculateStats($userId);

        // Check if user has tracked mood today
        $todayEntry = MoodTracker::where('user_id', $userId)
            ->whereDate('tracked_at', today())
            ->first();

        return Inertia::render('mood-tracker/index', [
            'moodEntries' => $moodEntries,
            'stats' => $stats,
            'todayEntry' => $todayEntry,
            'hasTrackedToday' => $todayEntry !== null,
        ]);
    }

    /**
     * Show the form for creating a new mood entry.
     */
    public function create(Request $request)
    {
        $targetDate = $request->get('date', today()->toDateString());

        // Check if entry already exists for this date
        $existingEntry = MoodTracker::where('user_id', auth()->id())
            ->whereDate('tracked_at', $targetDate)
            ->first();

        return Inertia::render('mood-tracker/create', [
            'targetDate' => $targetDate,
            'existingEntry' => $existingEntry,
            'isToday' => $targetDate === today()->toDateString(),
        ]);
    }

    /**
     * Store a new mood entry.
     */
    public function store(Request $request)
    {
        $request->validate([
            'mood' => 'required|string|in:happy,neutral,sad,stressed,calm',
            'intensity' => 'required|integer|min:1|max:5',
            'note' => 'nullable|string|max:1000',
            'triggers' => 'nullable|array',
            'triggers.*' => 'string|max:100',
            'tracked_at' => 'required|date',
        ]);

        $userId = auth()->id();
        $trackedAt = Carbon::parse($request->tracked_at)->toDateString();

        // Check if user already tracked mood for this date
        $existingEntry = MoodTracker::where('user_id', $userId)
            ->whereDate('tracked_at', $trackedAt)
            ->first();

        if ($existingEntry) {
            // Update existing entry
            $existingEntry->update([
                'mood' => $request->mood,
                'intensity' => $request->intensity,
                'note' => $request->note ?? '',
                'triggers' => $request->triggers ?? [],
            ]);

            $message = 'Mood berhasil diperbarui!';
        } else {
            // Create new entry
            MoodTracker::create([
                'user_id' => $userId,
                'mood' => $request->mood,
                'intensity' => $request->intensity,
                'note' => $request->note ?? '',
                'triggers' => $request->triggers ?? [],
                'tracked_at' => $trackedAt,
            ]);

            $message = 'Mood berhasil disimpan!';
        }

        return redirect()->route('mood-tracker.index')->with('success', $message);
    }

    /**
     * Show the specified mood entry.
     */
    public function show(MoodTracker $moodTracker)
    {
        if ($moodTracker->user_id !== auth()->id()) {
            abort(403);
        }

        // Get previous and next entries for navigation
        $previousEntry = MoodTracker::where('user_id', auth()->id())
            ->where('tracked_at', '<', $moodTracker->tracked_at)
            ->orderBy('tracked_at', 'desc')
            ->first();

        $nextEntry = MoodTracker::where('user_id', auth()->id())
            ->where('tracked_at', '>', $moodTracker->tracked_at)
            ->orderBy('tracked_at', 'asc')
            ->first();

        return Inertia::render('mood-tracker/show', [
            'moodEntry' => $moodTracker,
            'previousEntry' => $previousEntry,
            'nextEntry' => $nextEntry,
            'insights' => $this->generateMoodInsights($moodTracker),
        ]);
    }

    /**
     * Generate insights for specific mood entry
     */
    private function generateMoodInsights(MoodTracker $moodEntry)
    {
        $insights = [];

        switch ($moodEntry->mood) {
            case 'happy':
                if (in_array('Interaksi dengan orang lain', $moodEntry->triggers ?? [])) {
                    $insights[] = 'Hari yang produktif! Interaksi positif dengan orang lain tampaknya menjadi kunci kebahagiaan hari ini.';
                } else {
                    $insights[] = 'Hari yang menyenangkan! Pertahankan aktivitas yang membuat bahagia.';
                }
                break;
            case 'neutral':
                $insights[] = 'Hari yang stabil. Pertahankan rutinitas yang sudah baik.';
                break;
            case 'sad':
                $insights[] = 'Hari yang kurang baik. Ingat bahwa perasaan ini normal dan akan berlalu.';
                break;
            case 'stressed':
                $insights[] = 'Tingkat stres cukup tinggi. Pertimbangkan teknik relaksasi atau istirahat.';
                break;
            case 'calm':
                $insights[] = 'Ketenangan yang baik. Manfaatkan momen ini untuk refleksi diri.';
                break;
        }

        // Add intensity-based insights
        if ($moodEntry->intensity >= 4) {
            $insights[] = 'Intensitas emosi cukup tinggi hari ini. Perhatikan pola yang mungkin berulang.';
        }

        return $insights;
    }

    /**
     * Show the form for editing the specified mood entry.
     */
    public function edit(MoodTracker $moodTracker)
    {
        if ($moodTracker->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('mood-tracker/edit', [
            'moodEntry' => $moodTracker,
        ]);
    }

    /**
     * Update the specified mood entry.
     */
    public function update(Request $request, MoodTracker $moodTracker)
    {
        if ($moodTracker->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'mood' => 'required|string|in:happy,neutral,sad,stressed,calm',
            'intensity' => 'required|integer|min:1|max:5',
            'note' => 'nullable|string|max:1000',
            'triggers' => 'nullable|array',
            'triggers.*' => 'string|max:100',
        ]);

        $moodTracker->update([
            'mood' => $request->mood,
            'intensity' => $request->intensity,
            'note' => $request->note ?? '',
            'triggers' => $request->triggers ?? [],
        ]);

        return redirect()->route('mood-tracker.show', $moodTracker->id)->with('success', 'Mood berhasil diperbarui!');
    }

    /**
     * Remove the specified mood entry.
     */
    public function destroy(MoodTracker $moodTracker)
    {
        if ($moodTracker->user_id !== auth()->id()) {
            abort(403);
        }

        $moodTracker->delete();

        return redirect()->route('mood-tracker.index')->with('success', 'Mood entry berhasil dihapus!');
    }

    /**
     * Calculate mood statistics
     */
    private function calculateStats($userId)
    {
        $last30Days = MoodTracker::where('user_id', $userId)
            ->where('tracked_at', '>=', now()->subDays(30))
            ->get();

        $totalEntries = $last30Days->count();
        $streakDays = $this->calculateStreak($userId);

        // Most common mood
        $moodCounts = $last30Days->groupBy('mood')->map->count();
        $mostCommonMood = $moodCounts->sortDesc()->keys()->first();

        // Average intensity
        $averageIntensity = $last30Days->avg('intensity');

        // Most common triggers
        $allTriggers = $last30Days->pluck('triggers')->flatten()->filter();
        $triggerCounts = $allTriggers->countBy();
        $topTriggers = $triggerCounts->sortDesc()->take(5);

        return [
            'totalEntries' => $totalEntries,
            'streakDays' => $streakDays,
            'mostCommonMood' => $mostCommonMood,
            'averageIntensity' => round($averageIntensity, 1),
            'topTriggers' => $topTriggers,
            'moodDistribution' => $moodCounts,
        ];
    }

    /**
     * Calculate current tracking streak
     */
    private function calculateStreak($userId)
    {
        $streak = 0;
        $currentDate = today();

        while (true) {
            $hasEntry = MoodTracker::where('user_id', $userId)
                ->whereDate('tracked_at', $currentDate)
                ->exists();

            if (!$hasEntry) {
                break;
            }

            $streak++;
            $currentDate = $currentDate->subDay();
        }

        return $streak;
    }

    /**
     * Display mood analytics page
     */
    public function analytics(Request $request)
    {
        $userId = auth()->id();
        $period = $request->get('period', '30'); // Default 30 days

        // Get mood data based on period
        $startDate = now()->subDays((int)$period);
        $moodEntries = MoodTracker::where('user_id', $userId)
            ->where('tracked_at', '>=', $startDate)
            ->orderBy('tracked_at', 'desc')
            ->get();

        // Calculate comprehensive analytics
        $analytics = $this->calculateAnalytics($userId, $period);

        return Inertia::render('mood-tracker/analytics', [
            'analytics' => $analytics,
            'selectedPeriod' => $period,
            'totalEntries' => $moodEntries->count(),
        ]);
    }

    /**
     * Calculate comprehensive analytics
     */
    private function calculateAnalytics($userId, $period)
    {
        $startDate = now()->subDays((int)$period);
        $moodEntries = MoodTracker::where('user_id', $userId)
            ->where('tracked_at', '>=', $startDate)
            ->get();

        $totalEntries = $moodEntries->count();

        if ($totalEntries === 0) {
            return $this->getEmptyAnalytics();
        }

        // Basic stats
        $streakDays = $this->calculateStreak($userId);
        $longestStreak = $this->calculateLongestStreak($userId);
        $averageIntensity = round($moodEntries->avg('intensity'), 1);

        // Mood distribution
        $moodDistribution = $moodEntries->groupBy('mood')->map->count()->toArray();

        // Weekly trends (last 4 weeks)
        $weeklyTrends = $this->calculateWeeklyTrends($moodEntries);

        // Top triggers
        $topTriggers = $this->calculateTopTriggers($moodEntries);

        // Mood patterns
        $moodPatterns = $this->calculateMoodPatterns($moodEntries);

        // Calculate mood score
        $moodScore = $this->calculateMoodScore($moodDistribution, $totalEntries, $averageIntensity);

        // Generate insights
        $insights = $this->generateInsights($moodEntries, $moodDistribution, $topTriggers);

        return [
            'totalEntries' => $totalEntries,
            'currentStreak' => $streakDays,
            'longestStreak' => $longestStreak,
            'averageIntensity' => $averageIntensity,
            'moodDistribution' => $moodDistribution,
            'weeklyTrends' => $weeklyTrends,
            'topTriggers' => $topTriggers,
            'moodPatterns' => $moodPatterns,
            'moodScore' => $moodScore,
            'insights' => $insights,
        ];
    }

    /**
     * Calculate weekly trends
     */
    private function calculateWeeklyTrends($moodEntries)
    {
        $trends = [];
        $groupedByWeek = $moodEntries->groupBy(function ($entry) {
            return Carbon::parse($entry->tracked_at)->startOfWeek()->format('Y-m-d');
        });

        $weekNumber = 1;
        foreach ($groupedByWeek->sortKeys() as $weekStart => $weekEntries) {
            $weekData = ['week' => "Minggu {$weekNumber}"];
            $weekMoods = $weekEntries->groupBy('mood')->map->count();

            foreach (['happy', 'neutral', 'calm', 'stressed', 'sad'] as $mood) {
                $weekData[$mood] = $weekMoods->get($mood, 0);
            }

            $trends[] = $weekData;
            $weekNumber++;
        }

        return array_slice($trends, -4); // Last 4 weeks
    }

    /**
     * Calculate top triggers
     */
    private function calculateTopTriggers($moodEntries)
    {
        $allTriggers = $moodEntries->pluck('triggers')->flatten()->filter();
        $triggerCounts = $allTriggers->countBy();

        $topTriggers = [];
        foreach ($triggerCounts->sortDesc()->take(5) as $trigger => $count) {
            // Calculate impact based on associated moods
            $triggerEntries = $moodEntries->filter(function ($entry) use ($trigger) {
                return in_array($trigger, $entry->triggers ?? []);
            });

            $positiveMoods = $triggerEntries->whereIn('mood', ['happy', 'calm'])->count();
            $negativeMoods = $triggerEntries->whereIn('mood', ['sad', 'stressed'])->count();

            $impact = 'mixed';
            if ($positiveMoods > $negativeMoods * 1.5) {
                $impact = 'positive';
            } elseif ($negativeMoods > $positiveMoods * 1.5) {
                $impact = 'negative';
            }

            $topTriggers[] = [
                'trigger' => $trigger,
                'count' => $count,
                'impact' => $impact,
            ];
        }

        return $topTriggers;
    }

    /**
     * Calculate mood patterns
     */
    private function calculateMoodPatterns($moodEntries)
    {
        // Group by day of week
        $dayMoods = $moodEntries->groupBy(function ($entry) {
            return Carbon::parse($entry->tracked_at)->dayOfWeek;
        });

        $dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        $dayScores = [];

        foreach ($dayMoods as $dayNum => $entries) {
            $averageIntensity = $entries->avg('intensity');
            $positiveCount = $entries->whereIn('mood', ['happy', 'calm'])->count();
            $score = ($averageIntensity * 2) + ($positiveCount / $entries->count() * 10);
            $dayScores[$dayNum] = $score;
        }

        $bestDay = $dayScores ? $dayNames[array_keys($dayScores, max($dayScores))[0]] : 'Tidak ada data';
        $worstDay = $dayScores ? $dayNames[array_keys($dayScores, min($dayScores))[0]] : 'Tidak ada data';

        // Most common mood
        $commonMood = $moodEntries->groupBy('mood')->map->count()->sortDesc()->keys()->first() ?? 'neutral';

        return [
            'bestDay' => $bestDay,
            'worstDay' => $worstDay,
            'bestTime' => 'Sore', // Simplified for now
            'commonMood' => $commonMood,
        ];
    }

    /**
     * Calculate mood score (0-100)
     */
    private function calculateMoodScore($moodDistribution, $totalEntries, $averageIntensity)
    {
        if ($totalEntries === 0) return 0;

        $weights = ['happy' => 5, 'calm' => 4, 'neutral' => 3, 'stressed' => 2, 'sad' => 1];
        $totalScore = 0;

        foreach ($moodDistribution as $mood => $count) {
            $totalScore += ($weights[$mood] ?? 3) * $count;
        }

        $baseScore = ($totalScore / ($totalEntries * 5)) * 100;
        $intensityBonus = ($averageIntensity - 3) * 5; // Bonus/penalty based on intensity

        return max(0, min(100, round($baseScore + $intensityBonus)));
    }

    /**
     * Calculate longest streak
     */
    private function calculateLongestStreak($userId)
    {
        $allEntries = MoodTracker::where('user_id', $userId)
            ->orderBy('tracked_at', 'desc')
            ->pluck('tracked_at')
            ->map(function ($date) {
                return Carbon::parse($date)->toDateString();
            })
            ->unique()
            ->sort()
            ->values();

        if ($allEntries->isEmpty()) return 0;

        $longestStreak = 1;
        $currentStreak = 1;

        for ($i = 1; $i < $allEntries->count(); $i++) {
            $currentDate = Carbon::parse($allEntries[$i]);
            $previousDate = Carbon::parse($allEntries[$i - 1]);

            if ($currentDate->diffInDays($previousDate) === 1) {
                $currentStreak++;
                $longestStreak = max($longestStreak, $currentStreak);
            } else {
                $currentStreak = 1;
            }
        }

        return $longestStreak;
    }

    /**
     * Generate insights
     */
    private function generateInsights($moodEntries, $moodDistribution, $topTriggers)
    {
        $insights = [];

        // Weekend vs weekday analysis
        $weekendEntries = $moodEntries->filter(function ($entry) {
            $dayOfWeek = Carbon::parse($entry->tracked_at)->dayOfWeek;
            return in_array($dayOfWeek, [0, 6]); // Sunday = 0, Saturday = 6
        });

        $weekdayEntries = $moodEntries->filter(function ($entry) {
            $dayOfWeek = Carbon::parse($entry->tracked_at)->dayOfWeek;
            return !in_array($dayOfWeek, [0, 6]);
        });

        if ($weekendEntries->count() > 0 && $weekdayEntries->count() > 0) {
            $weekendPositive = $weekendEntries->whereIn('mood', ['happy', 'calm'])->count() / $weekendEntries->count();
            $weekdayPositive = $weekdayEntries->whereIn('mood', ['happy', 'calm'])->count() / $weekdayEntries->count();

            if ($weekendPositive > $weekdayPositive * 1.2) {
                $insights[] = 'Kamu cenderung lebih bahagia di akhir pekan';
            }
        }

        // Top trigger analysis
        if (!empty($topTriggers)) {
            $positiveTriggersCount = collect($topTriggers)->where('impact', 'positive')->count();
            if ($positiveTriggersCount >= 3) {
                $insights[] = 'Interaksi sosial memiliki dampak positif pada mood';
            }
        }

        // Stress trend
        $recentStress = $moodEntries->take(7)->where('mood', 'stressed')->count();
        $olderStress = $moodEntries->skip(7)->take(7)->where('mood', 'stressed')->count();

        if ($recentStress < $olderStress) {
            $insights[] = 'Tingkat stres menurun dalam 2 minggu terakhir';
        }

        // Most common mood insight
        $mostCommonMood = collect($moodDistribution)->sortDesc()->keys()->first();
        if ($mostCommonMood === 'happy') {
            $insights[] = 'Mood dominan kamu adalah bahagia - pertahankan!';
        }

        // Default insights if none generated
        if (empty($insights)) {
            $insights = [
                'Terus konsisten dalam tracking mood',
                'Perhatikan pola yang muncul dari waktu ke waktu',
                'Identifikasi trigger yang berulang',
                'Gunakan data ini untuk self-improvement',
            ];
        }

        return array_slice($insights, 0, 4); // Max 4 insights
    }

    /**
     * Get empty analytics structure
     */
    private function getEmptyAnalytics()
    {
        return [
            'totalEntries' => 0,
            'currentStreak' => 0,
            'longestStreak' => 0,
            'averageIntensity' => 0,
            'moodDistribution' => [],
            'weeklyTrends' => [],
            'topTriggers' => [],
            'moodPatterns' => [
                'bestDay' => 'Tidak ada data',
                'worstDay' => 'Tidak ada data',
                'bestTime' => 'Tidak ada data',
                'commonMood' => 'neutral',
            ],
            'moodScore' => 0,
            'insights' => [
                'Mulai tracking mood untuk melihat analytics',
                'Konsistensi adalah kunci untuk insights yang akurat',
                'Data akan lebih meaningful setelah 1-2 minggu',
                'Jangan lupa catat trigger dan catatan',
            ],
        ];
    }
}
