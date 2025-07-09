import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Brain, CheckCircle, ChevronLeft, ChevronRight, Clock, Lightbulb } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface AssessmentQuestion {
    id: number;
    question: string;
    // Tidak perlu type/min/max/minLabel/maxLabel, cukup id & question
}

interface Assessment {
    id: number;
    slug: string;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    category: string | null;
    instructions: string[];
    questions: AssessmentQuestion[];
}

interface Props {
    assessment: Assessment;
}

export default function AssessmentShowPage({ assessment }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Self Assessments', href: '/self-assessments' },
        { title: assessment.title, href: `/self-assessments/${assessment.slug}` },
    ];

    const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'complete'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm<{
        assessment_id: number;
        answers: Record<number, number>;
        // notes: string;
    }>({
        assessment_id: assessment.id,
        answers: {},
        // notes: '',
    });

    useEffect(() => {
        if (currentStep === 'questions' && startTime) {
            const interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep, startTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartAssessment = () => {
        setCurrentStep('questions');
        setStartTime(new Date());
    };

    const handleNext = () => {
        if (currentQuestion < assessment.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            handleSubmit(new Event('submit') as unknown as React.FormEvent);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('self-assessments.submit', assessment.slug), {
            onSuccess: () => {
                setCurrentStep('complete');
                setStartTime(null);
                setTimeElapsed(0);
                reset();
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            },
        });
    };

    const currentQuestionData = assessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
    const isCurrentAnswered = currentQuestionData && data.answers[currentQuestionData.id] !== undefined;

    // Introduction Step
    if (currentStep === 'intro') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={assessment.title} />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="mx-auto">
                            {/* Header */}
                            {/* <div className="mb-8 text-center">
                                <Link href="/self-assessments">
                                    <Button variant="ghost" className="mb-4">
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Daftar Assessment
                                    </Button>
                                </Link>
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                                    <Brain className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">{assessment.title}</h1>
                                <p className="text-lg text-gray-600">{assessment.description}</p>
                            </div> */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                                        Informasi Assessment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <Brain className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <p className="font-semibold">{assessment.questions.length} Pertanyaan</p>
                                            <p className="text-sm text-gray-600">Total soal</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <Clock className="h-6 w-6 text-green-600" />
                                            </div>
                                            <p className="font-semibold">{assessment.duration}</p>
                                            <p className="text-sm text-gray-600">Estimasi waktu</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                                <CheckCircle className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <p className="font-semibold">{assessment.difficulty}</p>
                                            <p className="text-sm text-gray-600">Tingkat kesulitan</p>
                                        </div>
                                    </div>

                                    <Alert className="mb-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Penting:</strong> Hasil assessment ini bukan diagnosis medis. Jika Anda merasa membutuhkan bantuan
                                            profesional, silakan konsultasi dengan psikolog atau psikiater.
                                        </AlertDescription>
                                    </Alert>

                                    <div>
                                        <h3 className="mb-3 font-semibold">Petunjuk Pengerjaan:</h3>
                                        <ul className="space-y-2">
                                            {assessment.instructions.map((instruction, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                                    <span className="text-gray-700">{instruction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="text-center">
                                <Button
                                    onClick={handleStartAssessment}
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    Mulai Assessment
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Questions Step
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assessment.title} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mx-auto max-w-3xl">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(timeElapsed)}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {currentQuestion + 1} dari {assessment.questions.length}
                                    </Badge>
                                </div>
                            </div>

                            <Progress value={progress} className="h-2" />
                            <p className="mt-2 text-sm text-gray-600">Progress: {Math.round(progress)}% selesai</p>
                        </div>

                        {/* Question Card */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-xl">Pertanyaan {currentQuestion + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-6 text-lg text-gray-800">{currentQuestionData.question}</p>

                                {/* SKALA 1-10 */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="mb-2 flex w-full items-center justify-between">
                                        <span className="text-xs text-gray-500">Tidak Pernah</span>
                                        <span className="text-xs text-gray-500">Selalu</span>
                                    </div>
                                    <div className="flex w-full justify-between gap-1">
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setData('answers', { ...data.answers, [currentQuestionData.id]: val })}
                                                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition ${
                                                    data.answers[currentQuestionData.id] === val
                                                        ? 'border-blue-500 bg-blue-500 text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-100'
                                                } `}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                    {data.answers[currentQuestionData.id] && (
                                        <div className="mt-2 text-sm text-blue-600">
                                            Skor dipilih: <b>{data.answers[currentQuestionData.id]}</b>
                                        </div>
                                    )}
                                </div>

                                {/* Tidak jadi menambahkan notes, mungkin untuk next update */}
                                {/* Notes section for last question */}
                                {/* {currentQuestion === assessment.questions.length - 1 && (
                                    <div className="mt-8 rounded-lg bg-blue-50 p-4">
                                        <Label htmlFor="notes" className="mb-2 block text-base font-medium">
                                            Catatan Tambahan (Opsional)
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Tuliskan hal-hal yang ingin Anda sampaikan terkait kondisi Anda saat ini..."
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                )} */}
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Sebelumnya
                            </Button>

                            <div className="text-sm text-gray-600">
                                {currentQuestion + 1} dari {assessment.questions.length} pertanyaan
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!isCurrentAnswered || processing}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                {currentQuestion === assessment.questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        {/* Error Messages */}
                        {errors.answers && (
                            <Alert className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.answers}</AlertDescription>
                            </Alert>
                        )}

                        {/* Help Text */}
                        {!isCurrentAnswered && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">Pilih salah satu jawaban untuk melanjutkan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
