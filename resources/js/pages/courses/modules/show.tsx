import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Course, Module, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, FileText, HelpCircle, Pause, Play, Star, ThumbsDown, ThumbsUp, Video } from 'lucide-react';
import { useState } from 'react';

interface ModuleShowProps {
    course: Course;
    module: Module;
}

export default function ModuleShow({ course, module }: ModuleShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: course.title,
            href: `/courses/${course.slug}`,
        },
        {
            title: module.title,
            href: `/courses/${course.slug}/modules/${module.slug}`,
        },
    ];

    console.log('Course:', course);
    console.log('Module:', module);

    const [isPlaying, setIsPlaying] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [moduleCompleted, setModuleCompleted] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleCompleteModule = () => {
        setModuleCompleted(true);
        // In real app, make API call to mark module as completed
    };

    const handleQuizSubmit = () => {
        setQuizSubmitted(true);
        const currentQuiz = module.quizzes[currentQuizIndex];
        if (selectedAnswer !== null) {
            const selectedOption = ['A', 'B', 'C', 'D'][selectedAnswer];
            if (selectedOption === currentQuiz.correct_answer) {
                // Correct answer logic
                if (currentQuizIndex === module.quizzes.length - 1) {
                    setModuleCompleted(true);
                }
            }
        }
    };

    const handleNextQuiz = () => {
        if (currentQuizIndex < module.quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedAnswer(null);
            setQuizSubmitted(false);
        } else {
            setShowQuiz(false);
            setModuleCompleted(true);
        }
    };

    // Find next and previous modules
    const currentModuleIndex = course.modules.findIndex((m) => m.id === module.id);
    const nextModule = currentModuleIndex < course.modules.length - 1 ? course.modules[currentModuleIndex + 1] : null;
    const prevModule = currentModuleIndex > 0 ? course.modules[currentModuleIndex - 1] : null;

    // Mock content untuk demo
    const mockContent = {
        transcript: `
        Selamat datang di modul ${module.title}.
        
        Dalam modul ini, Anda akan mempelajari konsep-konsep dasar yang penting untuk ${course.title.toLowerCase()}.
        
        Poin-poin utama yang akan dibahas:
        1. Pemahaman dasar tentang topik ini
        2. Teknik-teknik praktis yang dapat diterapkan
        3. Tips untuk mengatasi tantangan umum
        4. Strategi untuk mengembangkan kemampuan lebih lanjut
        
        Mari kita mulai pembelajaran ini dengan semangat!
        `,
        keyPoints: [
            'Memahami konsep dasar dengan baik adalah kunci sukses',
            'Praktik secara konsisten akan meningkatkan kemampuan',
            'Jangan takut membuat kesalahan, itu bagian dari pembelajaran',
            'Terapkan ilmu yang dipelajari dalam kehidupan sehari-hari',
        ],
    };

    // Estimasi durasi berdasarkan content type
    const estimatedDuration = module.content_type === 'video' ? '10 menit' : '5 menit';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${module.title} - ${course.title}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Back Button */}
                    <Button asChild variant="ghost" className="mb-4">
                        <a href={`/courses/${course.slug}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Course
                        </a>
                    </Button>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Module Header */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <Badge className="bg-blue-100 text-blue-700">
                                                    {module.content_type === 'video' ? (
                                                        <Video className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <FileText className="mr-1 h-3 w-3" />
                                                    )}
                                                    {module.content_type === 'video' ? 'Video' : 'Artikel'}
                                                </Badge>
                                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{estimatedDuration}</span>
                                                </div>
                                                {module.quizzes && module.quizzes.length > 0 && (
                                                    <Badge variant="outline">
                                                        <HelpCircle className="mr-1 h-3 w-3" />
                                                        {module.quizzes.length} Quiz
                                                    </Badge>
                                                )}
                                            </div>
                                            <h1 className="mb-2 text-3xl font-bold text-slate-800">{module.title}</h1>
                                            <p className="leading-relaxed text-slate-600">
                                                Modul ini akan membahas {module.title.toLowerCase()} sebagai bagian dari course {course.title}.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Video/Content Player */}
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                {module.content_type === 'video' ? (
                                    <div className="relative aspect-video bg-slate-900">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Button onClick={handlePlayPause} size="lg" className="bg-white/90 text-slate-800 hover:bg-white">
                                                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                                            </Button>
                                        </div>
                                        <div className="absolute right-4 bottom-4 left-4">
                                            <Progress value={30} className="h-1 bg-white/20" />
                                        </div>
                                    </div>
                                ) : (
                                    <CardContent className="p-6">
                                        <div className="prose max-w-none">
                                            <div className="leading-relaxed whitespace-pre-line text-slate-700">{mockContent.transcript}</div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>

                            {/* Transcript Toggle (for video content) */}
                            {module.content_type === 'video' && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-slate-800">Transkrip</CardTitle>
                                            <Button variant="outline" size="sm" onClick={() => setShowTranscript(!showTranscript)}>
                                                {showTranscript ? 'Sembunyikan' : 'Tampilkan'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    {showTranscript && (
                                        <CardContent>
                                            <div className="leading-relaxed whitespace-pre-line text-slate-700">{mockContent.transcript}</div>
                                        </CardContent>
                                    )}
                                </Card>
                            )}

                            {/* Key Points */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Poin Penting</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockContent.keyPoints.map((point, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <Star className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                                                <span className="text-slate-700">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quiz Section */}
                            {module.quizzes && module.quizzes.length > 0 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800">
                                            <HelpCircle className="h-5 w-5 text-blue-500" />
                                            Quiz ({module.quizzes.length} pertanyaan)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {!showQuiz ? (
                                            <div className="py-8 text-center">
                                                <p className="mb-4 text-slate-600">
                                                    Selesaikan materi di atas, lalu kerjakan quiz untuk menguji pemahaman Anda.
                                                </p>
                                                <Button onClick={() => setShowQuiz(true)} className="bg-blue-500 hover:bg-blue-600">
                                                    Mulai Quiz
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-slate-800">
                                                        Pertanyaan {currentQuizIndex + 1} dari {module.quizzes.length}
                                                    </h3>
                                                    <Progress value={((currentQuizIndex + 1) / module.quizzes.length) * 100} className="h-2 w-24" />
                                                </div>

                                                {module.quizzes[currentQuizIndex] && (
                                                    <>
                                                        <h4 className="font-medium text-slate-800">{module.quizzes[currentQuizIndex].question}</h4>
                                                        <div className="space-y-2">
                                                            {[
                                                                { label: 'A', text: module.quizzes[currentQuizIndex].option_a },
                                                                { label: 'B', text: module.quizzes[currentQuizIndex].option_b },
                                                                { label: 'C', text: module.quizzes[currentQuizIndex].option_c },
                                                                { label: 'D', text: module.quizzes[currentQuizIndex].option_d },
                                                            ].map((option, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => !quizSubmitted && setSelectedAnswer(index)}
                                                                    disabled={quizSubmitted}
                                                                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                                                        quizSubmitted
                                                                            ? option.label === module.quizzes[currentQuizIndex].correct_answer
                                                                                ? 'border-green-200 bg-green-50 text-green-700'
                                                                                : index === selectedAnswer &&
                                                                                    option.label !== module.quizzes[currentQuizIndex].correct_answer
                                                                                  ? 'border-red-200 bg-red-50 text-red-700'
                                                                                  : 'border-slate-200 bg-slate-50 text-slate-600'
                                                                            : selectedAnswer === index
                                                                              ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    <span className="font-medium">{option.label}.</span> {option.text}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {!quizSubmitted ? (
                                                            <Button
                                                                onClick={handleQuizSubmit}
                                                                disabled={selectedAnswer === null}
                                                                className="bg-blue-500 hover:bg-blue-600"
                                                            >
                                                                Submit Jawaban
                                                            </Button>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <div
                                                                    className={`rounded-lg p-3 ${
                                                                        selectedAnswer !== null &&
                                                                        ['A', 'B', 'C', 'D'][selectedAnswer] ===
                                                                            module.quizzes[currentQuizIndex].correct_answer
                                                                            ? 'border border-green-200 bg-green-50'
                                                                            : 'border border-red-200 bg-red-50'
                                                                    }`}
                                                                >
                                                                    <p
                                                                        className={`font-medium ${
                                                                            selectedAnswer !== null &&
                                                                            ['A', 'B', 'C', 'D'][selectedAnswer] ===
                                                                                module.quizzes[currentQuizIndex].correct_answer
                                                                                ? 'text-green-700'
                                                                                : 'text-red-700'
                                                                        }`}
                                                                    >
                                                                        {selectedAnswer !== null &&
                                                                        ['A', 'B', 'C', 'D'][selectedAnswer] ===
                                                                            module.quizzes[currentQuizIndex].correct_answer
                                                                            ? '✅ Benar!'
                                                                            : '❌ Kurang tepat'}
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-slate-600">
                                                                        Jawaban yang benar adalah: {module.quizzes[currentQuizIndex].correct_answer}
                                                                    </p>
                                                                </div>

                                                                <Button onClick={handleNextQuiz} className="bg-blue-500 hover:bg-blue-600">
                                                                    {currentQuizIndex === module.quizzes.length - 1
                                                                        ? 'Selesai Quiz'
                                                                        : 'Pertanyaan Selanjutnya'}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Module Completion */}
                            {!moduleCompleted && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-6 text-center">
                                        <h3 className="mb-2 font-semibold text-slate-800">Selesaikan Modul</h3>
                                        <p className="mb-4 text-slate-600">Klik tombol di bawah untuk menandai modul ini sebagai selesai.</p>
                                        <Button onClick={handleCompleteModule} className="bg-emerald-500 hover:bg-emerald-600">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Tandai Selesai
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Success Message */}
                            {moduleCompleted && (
                                <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                                    <CardContent className="p-6 text-center">
                                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                                        <h3 className="mb-2 text-xl font-bold text-slate-800">Modul Selesai! 🎉</h3>
                                        <p className="mb-4 text-slate-600">Selamat! Anda telah menyelesaikan modul "{module.title}".</p>
                                        <div className="flex justify-center gap-3">
                                            {nextModule && (
                                                <Button asChild className="bg-blue-500 hover:bg-blue-600">
                                                    <a href={`/courses/${course.slug}/modules/${nextModule.slug}`}>
                                                        <ArrowRight className="mr-2 h-4 w-4" />
                                                        Modul Selanjutnya
                                                    </a>
                                                </Button>
                                            )}
                                            <Button asChild variant="outline">
                                                <a href={`/courses/${course.slug}`}>Kembali ke Course</a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Course Progress */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Progress Course</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">0/{course.modules.length} modul</span>
                                            <span className="font-medium text-slate-800">0%</span>
                                        </div>
                                        <Progress value={0} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Module Navigation */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Daftar Modul</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {course.modules.map((courseModule, index) => (
                                        <a
                                            key={courseModule.id}
                                            href={`/courses/${course.slug}/modules/${courseModule.slug}`}
                                            className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                                                courseModule.id === module.id
                                                    ? 'border border-blue-200 bg-blue-100 text-blue-700'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex-shrink-0">
                                                {false ? ( // moduleCompleted placeholder
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
                                                        {index + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="truncate text-sm font-medium">{courseModule.title}</span>
                                        </a>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Navigation */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="space-y-3 p-4">
                                    {prevModule && (
                                        <Button asChild variant="outline" className="w-full justify-start">
                                            <a href={`/courses/${course.slug}/modules/${prevModule.slug}`}>
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Modul Sebelumnya
                                            </a>
                                        </Button>
                                    )}
                                    {nextModule && (
                                        <Button asChild className="w-full justify-start bg-blue-500 hover:bg-blue-600">
                                            <a href={`/courses/${course.slug}/modules/${nextModule.slug}`}>
                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                Modul Selanjutnya
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Feedback */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Feedback</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-3 text-sm text-slate-600">Apakah modul ini membantu?</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <ThumbsUp className="mr-1 h-4 w-4" />
                                            Ya
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <ThumbsDown className="mr-1 h-4 w-4" />
                                            Tidak
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
