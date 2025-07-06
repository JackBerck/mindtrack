<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalController extends Controller
{
    /**
     * Display the journal page.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = auth()->user()->journals();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Mood filter
        if ($request->filled('mood')) {
            $query->where('mood', $request->get('mood'));
        }

        $journals = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString(); // Preserve query parameters in pagination links

        // Calculate stats
        $allJournals = auth()->user()->journals;
        $stats = [
            'total_journals' => $allJournals->count(),
            'writing_streak' => 7, // Calculate actual streak later
            'happy_percentage' => $allJournals->count() > 0
                ? round(($allJournals->where('mood', 'happy')->count() / $allJournals->count()) * 100)
                : 0,
            'total_words' => $allJournals->sum('word_count'),
        ];

        return Inertia::render('journals/index', [
            'journals' => $journals,
            'stats' => $stats,
            'filters' => [
                'search' => $request->get('search', ''),
                'mood' => $request->get('mood', ''),
            ]
        ]);
    }

    /**
     * Show the form for creating a new journal entry.
     */
    public function create()
    {
        return Inertia::render('journals/create');
    }

    /**
     * Store a new journal entry.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'mood' => 'required|string|in:happy,neutral,sad,stressed,calm',
        ]);

        $wordCount = str_word_count(strip_tags($request->content));

        Journal::create([
            'title' => $request->title,
            'content' => $request->content,
            'mood' => $request->mood,
            'word_count' => $wordCount,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('journal.index')->with('success', 'Jurnal berhasil dibuat.');
    }

    /**
     * Display the specified journal.
     */
    public function show(Journal $journal)
    {
        // Ensure the journal belongs to the authenticated user
        if ($journal->user_id !== auth()->id()) {
            abort(403);
        }

        // Get related journals (same mood or recent journals)
        $relatedJournals = auth()->user()->journals()
            ->where('id', '!=', $journal->id)
            ->where(function ($query) use ($journal) {
                $query->where('mood', $journal->mood)
                    ->orWhere('created_at', '>=', now()->subDays(30));
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->select('id', 'title', 'slug', 'created_at')
            ->get();

        return Inertia::render('journals/show', [
            'journal' => $journal->load('user'),
            'relatedJournals' => $relatedJournals,
        ]);
    }

    /**
     * Show the form for editing the specified journal.
     */
    public function edit(Journal $journal)
    {
        if ($journal->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('journals/edit', [
            'journal' => $journal
        ]);
    }

    /**
     * Update the specified journal.
     */
    public function update(Request $request, Journal $journal)
    {
        if ($journal->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'mood' => 'required|string|in:happy,neutral,sad,stressed,calm',
        ]);

        $wordCount = str_word_count(strip_tags($request->content));

        $journal->update([
            'title' => $request->title,
            'content' => $request->content,
            'mood' => $request->mood,
            'word_count' => $wordCount,
        ]);

        return redirect()->route('journal.show', $journal->slug)->with('success', 'Journal updated successfully.');
    }

    /**
     * Remove the specified journal.
     */
    public function destroy(Journal $journal)
    {
        if ($journal->user_id !== auth()->id()) {
            abort(403);
        }

        $journal->delete();

        return redirect()->route('journal.index')->with('success', 'Journal deleted successfully.');
    }
}
