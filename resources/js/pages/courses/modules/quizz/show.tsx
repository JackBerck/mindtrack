import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Award, CheckCircle, Clock, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizShowProps {
    courseId: string;
    moduleId: string;
    quizId: string;
}

// Mock quiz data - in real app, this would come from props
const mockQuiz = {
    id: 1,
    moduleId: 2,
    title: 'Quiz: Teknik Pernapasan 4-7-8',
    description: 'Uji pemahamanmu tentang teknik pernapasan untuk mengelola stres',
    timeLimit: 300, // 5 minutes in seconds
    questions: [
        {
            id: 1,
            question: 'Apa yang dimaksud dengan teknik pernapasan 4-7-8?',
            options: [
                'Tarik napas 4 detik, tahan 7 detik, buang 8 detik',
                'Tarik napas 4 kali, tahan 7 kali, buang 8 kali',
                'Bernapas 4 menit, istirahat 7 menit, ulangi 8 kali',
                'Tarik napas 8 detik, tahan 7 detik, buang 4 detik',
            ],
            correctAnswer: 0,
            explanation: 'Teknik 4-7-8 adalah menarik napas selama 4 detik, menahan napas selama 7 detik, dan membuang napas selama 8 detik.',
        },
        {
            id: 2,
            question: 'Kapan waktu terbaik untuk melakukan teknik pernapasan 4-7-8?',
            options: ['Hanya saat merasa stres berat', 'Setiap hari sebagai rutinitas', 'Hanya sebelum tidur', 'Hanya saat bangun tidur'],
            correctAnswer: 1,
            explanation: 'Teknik ini paling efektif jika dilakukan secara rutin setiap hari, tidak hanya saat stres.',
        },
        {
            id: 3,
            question: 'Berapa kali sebaiknya mengulangi siklus pernapasan 4-7-8 untuk pemula?',
            options: ['10-15 kali', '20-25 kali', '3-4 kali', '1-2 kali'],
            correctAnswer: 2,
            explanation: 'Untuk pemula, disarankan mengulangi siklus 3-4 kali untuk menghindari pusing atau tidak nyaman.',
        },
    ],
};

const mockCourse = {
    id: 1,
    title: 'Mengelola Stres Ringan',
};

const mockModule = {
    id: 2,
    title: 'Teknik Pernapasan 4-7-8',
};

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
        title: mockCourse.title,
        href: `/courses/${mockCourse.id}`,
    },
    {
        title: mockModule.title,
        href: `/courses/${mockCourse.id}/modules/${mockModule.id}`,
    },
    {
        title: 'Quiz',
        href: `/courses/${mockCourse.id}/modules/${mockModule.id}/quiz/${mockQuiz.id}`,
    },
];

export default function QuizShow({ courseId, moduleId, quizId }: QuizShowProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit);
    const [quizStarted, setQuizStarted] = useState(false);

    const handleStartQuiz = () => {
        setQuizStarted(true);
        // Start timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < mockQuiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmitQuiz = () => {
        setShowResults(true);
    };

    const calculateScore = () => {
        let correct = 0;
        mockQuiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return {
            correct,
            total: mockQuiz.questions.length,
            percentage: Math.round((correct / mockQuiz.questions.length) * 100),
        };
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const score = showResults ? calculateScore() : null;

    if (!quizStarted) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${mockQuiz.title} - Quiz`} />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
                    <div className="mx-auto max-w-3xl space-y-6">
                        <Button asChild variant="ghost">
                            <a href={`/courses/${courseId}/modules/${moduleId}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Modul
                            </a>
                        </Button>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                    <HelpCircle className="h-8 w-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl text-slate-800">{mockQuiz.title}</CardTitle>
                                <CardDescription className="text-lg">{mockQuiz.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid gap-4 text-center md:grid-cols-3">
                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <HelpCircle className="mx-auto mb-2 h-6 w-6 text-slate-600" />
                                        <p className="font-medium text-slate-800">{mockQuiz.questions.length} Pertanyaan</p>
                                        <p className="text-sm text-slate-600">Multiple choice</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <Clock className="mx-auto mb-2 h-6 w-6 text-slate-600" />
                                        <p className="font-medium text-slate-800">{Math.floor(mockQuiz.timeLimit / 60)} Menit</p>
                                        <p className="text-sm text-slate-600">Batas waktu</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <Award className="mx-auto mb-2 h-6 w-6 text-slate-600" />
                                        <p className="font-medium text-slate-800">70% untuk lulus</p>
                                        <p className="text-sm text-slate-600">Skor minimum</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <h3 className="mb-2 font-medium text-blue-800">Petunjuk Quiz:</h3>
                                    <ul className="space-y-1 text-sm text-blue-700">
                                        <li>• Pilih jawaban yang paling tepat untuk setiap pertanyaan</li>
                                        <li>• Kamu bisa kembali ke pertanyaan sebelumnya</li>
                                        <li>• Quiz akan otomatis selesai jika waktu habis</li>
                                        <li>• Skor minimum 70% untuk lulus</li>
                                    </ul>
                                </div>

                                <Button
                                    onClick={handleStartQuiz}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    size="lg"
                                >
                                    Mulai Quiz
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (showResults) {
        const isPassed = score!.percentage >= 70;

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${mockQuiz.title} - Hasil Quiz`} />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
                    <div className="mx-auto max-w-3xl space-y-6">
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardHeader className="text-center">
                                <div
                                    className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                                        isPassed ? 'bg-green-100' : 'bg-red-100'
                                    }`}
                                >
                                    {isPassed ? <CheckCircle className="h-10 w-10 text-green-600" /> : <XCircle className="h-10 w-10 text-red-600" />}
                                </div>
                                <CardTitle className={`text-3xl ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
                                    {isPassed ? 'Selamat! Quiz Lulus! 🎉' : 'Quiz Belum Lulus 😔'}
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    {isPassed
                                        ? 'Kamu berhasil menguasai materi dengan baik!'
                                        : 'Jangan menyerah! Coba pelajari materi lagi dan ulangi quiz.'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="mb-2 text-6xl font-bold text-slate-800">{score!.percentage}%</div>
                                    <p className="text-slate-600">
                                        {score!.correct} dari {score!.total} jawaban benar
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-800">Review Jawaban:</h3>
                                    {mockQuiz.questions.map((question, index) => {
                                        const userAnswer = selectedAnswers[index];
                                        const isCorrect = userAnswer === question.correctAnswer;

                                        return (
                                            <div key={question.id} className="rounded-lg bg-slate-50 p-4">
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                                                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                    >
                                                        {isCorrect ? (
                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-2 font-medium text-slate-800">
                                                            {index + 1}. {question.question}
                                                        </p>
                                                        <div className="space-y-1 text-sm">
                                                            <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                                Jawaban kamu: {question.options[userAnswer] || 'Tidak dijawab'}
                                                            </p>
                                                            {!isCorrect && (
                                                                <p className="text-green-700">
                                                                    Jawaban benar: {question.options[question.correctAnswer]}
                                                                </p>
                                                            )}
                                                            <p className="mt-2 text-slate-600">{question.explanation}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3">
                                    {!isPassed && (
                                        <Button
                                            onClick={() => {
                                                setShowResults(false);
                                                setQuizStarted(false);
                                                setCurrentQuestion(0);
                                                setSelectedAnswers([]);
                                                setTimeLeft(mockQuiz.timeLimit);
                                            }}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Ulangi Quiz
                                        </Button>
                                    )}

                                    <Button
                                        asChild
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    >
                                        <a href={`/courses/${courseId}`}>Kembali ke Course</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const currentQ = mockQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${mockQuiz.title} - Pertanyaan ${currentQuestion + 1}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <a href={`/courses/${courseId}/modules/${moduleId}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Keluar Quiz
                            </a>
                        </Button>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="h-4 w-4" />
                                <span className={timeLeft < 60 ? 'font-medium text-red-600' : ''}>{formatTime(timeLeft)}</span>
                            </div>
                            <Badge variant="secondary">
                                {currentQuestion + 1} / {mockQuiz.questions.length}
                            </Badge>
                        </div>
                    </div>

                    {/* Progress */}
                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="mb-2 flex justify-between text-sm text-slate-600">
                                <span>Progress Quiz</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </CardContent>
                    </Card>

                    {/* Question */}
                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-800">Pertanyaan {currentQuestion + 1}</CardTitle>
                            <CardDescription className="text-lg text-slate-700">{currentQ.question}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {currentQ.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                                        selectedAnswers[currentQuestion] === index
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                                selectedAnswers[currentQuestion] === index ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                            }`}
                                        >
                                            {selectedAnswers[currentQuestion] === index && <div className="h-2 w-2 rounded-full bg-white" />}
                                        </div>
                                        <span className="text-slate-800">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button onClick={handlePrevQuestion} disabled={currentQuestion === 0} variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Sebelumnya
                        </Button>

                        <div className="flex gap-2">
                            {currentQuestion === mockQuiz.questions.length - 1 ? (
                                <Button
                                    onClick={handleSubmitQuiz}
                                    disabled={selectedAnswers.length !== mockQuiz.questions.length}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                    Selesai Quiz
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextQuestion}
                                    disabled={selectedAnswers[currentQuestion] === undefined}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                >
                                    Selanjutnya
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
