<?php

namespace App\Http\Controllers;

use App\Models\AssessmentResult;
use App\Models\SelfAssessment;
use App\Models\SelfAssessmentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SelfAssessmentController extends Controller
{
    public function index(Request $request)
    {
        $assessments = SelfAssessment::with('category')->get();
        $categories = SelfAssessmentCategory::withCount('selfAssessments')->get();
        $recentResults = $request->user()->assessmentResults()
            ->with('assessment')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
        $totalResults = $request->user()->assessmentResults()->count();
        $avarageScoreResults = $request->user()->assessmentResults()
            ->avg('score');
        $streak = $request->user()->assessmentResults()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        return Inertia::render('self-assessment/index', [
            'assessments' => $assessments,
            'categories' => $categories,
            'recentResults' => $recentResults,
            'stats' => [
                'total' => $assessments->count(),
                'completed' => $totalResults,
                'averageScore' => number_format($avarageScoreResults ?? 0, 2),
                'streak' => $streak,
            ],
        ]);
    }

    public function show(SelfAssessment $assessment)
    {
        $assessment->load(['category', 'questions']);

        // Format pertanyaan untuk frontend
        $questions = $assessment->questions->map(function ($q) {
            return [
                'id' => $q->id,
                'question' => $q->question,
                'type' => $q->type, // misal: likert, pilihan_ganda, dsb
                'options' => $q->options, // array, pastikan sudah di-cast di model
            ];
        });

        return Inertia::render('self-assessment/show', [
            'assessment' => [
                'id' => $assessment->id,
                'slug' => $assessment->slug,
                'title' => $assessment->title,
                'description' => $assessment->description,
                'duration' => $assessment->duration ?? '5-7 menit',
                'difficulty' => ucfirst($assessment->difficulty),
                'category' => $assessment->category ? $assessment->category->name : null,
                'instructions' => [
                    'Bacalah setiap pernyataan dengan seksama',
                    'Pilih jawaban yang paling sesuai dengan kondisi Anda dalam 2 minggu terakhir',
                    'Tidak ada jawaban yang benar atau salah',
                    'Jawablah dengan jujur sesuai perasaan Anda',
                ],
                'questions' => $questions,
            ],
        ]);
    }


    public function submit(Request $request, SelfAssessment $assessment)
    {
        $data = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|integer|min:1|max:10',
        ]);

        // Hitung total skor dan rata-rata
        $scores = array_values($data['answers']);
        $totalScore = array_sum($scores);
        $questionCount = count($scores);
        $average = $questionCount > 0 ? $totalScore / $questionCount : 0;

        // Logic feedback kategori
        if ($average < 4) {
            $result = "🌟 Sangat Baik! Tidak ditemukan indikasi masalah berarti. Terus pertahankan kebiasaan positif dan jaga kesehatan mental Anda. Jangan ragu untuk berbagi semangat positif kepada orang di sekitar Anda!";
        } elseif ($average < 6) {
            $result = "😊 Cukup Baik. Kondisi mental Anda cukup stabil, namun tetaplah waspada terhadap perubahan suasana hati. Lanjutkan aktivitas yang membuat Anda bahagia dan jangan lupa luangkan waktu untuk diri sendiri.";
        } elseif ($average < 8) {
            $result = "⚠️ Perlu Perhatian. Terdapat beberapa gejala yang perlu diwaspadai. Cobalah lakukan relaksasi, atur pola tidur, dan evaluasi rutinitas harian Anda. Jangan sungkan untuk bercerita kepada orang terdekat jika merasa butuh dukungan.";
        } else {
            $result = "🚩 Perlu Konsultasi. Hasil menunjukkan adanya gejala yang cukup signifikan. Disarankan untuk berkonsultasi dengan profesional agar mendapatkan bantuan dan solusi yang tepat. Ingat, Anda tidak sendiri dan bantuan selalu tersedia.";
        }

        // Simpan ke tabel hasil assessment user
        AssessmentResult::create([
            'user_id' => Auth::id(),
            'assessment_id' => $assessment->id,
            'score' => $average,
            'result' => $result,
        ]);

        return redirect()->route('self-assessments.index')->with('success', 'Hasil assessment berhasil disimpan.');
    }

    public function history(Request $request)
    {
        $results = $request->user()->assessmentResults()
            ->with('assessment.category')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        

        return Inertia::render('self-assessment/history/index', [
            'results' => $results,
        ]);
    }
}
