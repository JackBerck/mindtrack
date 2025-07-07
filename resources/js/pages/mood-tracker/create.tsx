import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Cloud, CloudRain, Frown, Heart, Lightbulb, Meh, Save, Smile, Sparkles, Sun, Target } from 'lucide-react';
import { useState } from 'react';

interface MoodEntry {
    id: number;
    mood: string;
    intensity: number;
    note: string;
    triggers: string[];
    tracked_at: string;
}

interface Props {
    targetDate: string;
    existingEntry?: MoodEntry;
    isToday: boolean;
}

const moodOptions = [
    {
        value: 'happy',
        label: 'Bahagia',
        emoji: '😊',
        icon: Smile,
        color: 'text-green-500 bg-green-50 border-green-200 hover:bg-green-100',
        description: 'Merasa senang dan positif',
        weather: Sun,
        suggestions: ['Bagikan kebahagiaan dengan orang lain', 'Catat momen spesial hari ini', 'Lakukan aktivitas yang kamu suka'],
    },
    {
        value: 'neutral',
        label: 'Biasa',
        emoji: '😐',
        icon: Meh,
        color: 'text-yellow-500 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        description: 'Perasaan stabil, tidak terlalu tinggi atau rendah',
        weather: Cloud,
        suggestions: ['Coba lakukan sesuatu yang baru', 'Hubungi teman atau keluarga', 'Baca buku atau dengar musik'],
    },
    {
        value: 'sad',
        label: 'Sedih',
        emoji: '😢',
        icon: Frown,
        color: 'text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100',
        description: 'Merasa down atau kecewa',
        weather: CloudRain,
        suggestions: ['Izinkan diri untuk merasakan emosi ini', 'Berbicara dengan orang terpercaya', 'Lakukan self-care'],
    },
    {
        value: 'stressed',
        label: 'Stres',
        emoji: '😰',
        icon: Frown,
        color: 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100',
        description: 'Merasa tertekan atau cemas',
        weather: CloudRain,
        suggestions: ['Praktik teknik pernapasan', 'Buat prioritas tugas', 'Istirahat sejenak'],
    },
    {
        value: 'calm',
        label: 'Tenang',
        emoji: '😌',
        icon: Smile,
        color: 'text-purple-500 bg-purple-50 border-purple-200 hover:bg-purple-100',
        description: 'Merasa damai dan rileks',
        weather: Sun,
        suggestions: ['Nikmati momen ketenangan ini', 'Lakukan meditasi', 'Refleksikan hari ini'],
    },
];

const moodTriggers = [
    'Cuaca hari ini',
    'Interaksi dengan orang lain',
    'Pekerjaan/tugas',
    'Kesehatan fisik',
    'Tidur malam sebelumnya',
    'Makanan yang dikonsumsi',
    'Aktivitas fisik',
    'Media sosial',
    'Berita yang dibaca',
    'Musik yang didengar',
];

export default function CreateMoodTracker({ targetDate, existingEntry, isToday }: Props) {
    const [data, setData] = useState({
        mood: existingEntry?.mood || '',
        intensity: existingEntry?.intensity || 3,
        note: existingEntry?.note || '',
        triggers: existingEntry?.triggers || [],
        tracked_at: targetDate,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mood Tracker', href: '/mood-tracker' },
        { title: existingEntry ? 'Edit Mood' : 'Track Mood', href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.mood) {
            setErrors({ mood: 'Pilih mood terlebih dahulu.' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        const method = existingEntry ? 'put' : 'post';
        const url = existingEntry ? `/mood-tracker/${existingEntry.id}` : '/mood-tracker';

        router[method](
            url,
            {
                mood: data.mood,
                intensity: data.intensity,
                note: data.note,
                triggers: data.triggers,
                tracked_at: data.tracked_at,
            },
            {
                onSuccess: () => {
                    // Will be redirected by controller
                },
                onError: (error) => {
                    setErrors(error);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    const toggleTrigger = (trigger: string) => {
        setData((prev) => ({
            ...prev,
            triggers: prev.triggers.includes(trigger) ? prev.triggers.filter((t) => t !== trigger) : [...prev.triggers, trigger],
        }));
    };

    const selectedMoodConfig = data.mood ? moodOptions.find((m) => m.value === data.mood) : null;
    const WeatherIcon = selectedMoodConfig?.weather || Cloud;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={existingEntry ? 'Edit Mood' : 'Track Mood'} />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href="/mood-tracker">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Tracker
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(targetDate)}</span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Progress Steps */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-center">
                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="flex items-center">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                                        currentStep >= step ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-600'
                                                    }`}
                                                >
                                                    {step}
                                                </div>
                                                {step < 3 && (
                                                    <div className={`mx-4 h-1 w-20 ${currentStep > step ? 'bg-purple-500' : 'bg-slate-200'}`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex justify-between text-xs text-slate-600 lg:px-0 xl:px-42">
                                        <span className="text-center flex-1">Pilih Mood</span>
                                        <span className="text-center flex-1">Intensitas</span>
                                        <span className="text-center flex-1">Catatan</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Step 1: Mood Selection */}
                                {currentStep === 1 && (
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardHeader className="text-center">
                                            <CardTitle className="flex items-center justify-center gap-2 text-slate-800">
                                                <Heart className="h-6 w-6 text-purple-500" />
                                                Bagaimana perasaanmu {isToday ? 'hari ini' : 'saat itu'}?
                                            </CardTitle>
                                            <CardDescription>Pilih mood yang paling menggambarkan perasaanmu</CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                                {moodOptions.map((mood) => {
                                                    const IconComponent = mood.icon;
                                                    const WeatherIconComponent = mood.weather;
                                                    return (
                                                        <button
                                                            key={mood.value}
                                                            type="button"
                                                            onClick={() => setData((prev) => ({ ...prev, mood: mood.value }))}
                                                            className={`rounded-xl border-2 p-6 text-left transition-all hover:scale-105 ${
                                                                data.mood === mood.value
                                                                    ? mood.color + ' shadow-lg ring-4 ring-purple-200'
                                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <div className="mb-3 flex items-center gap-4">
                                                                <div className="text-4xl">{mood.emoji}</div>
                                                                <div>
                                                                    <h3 className="font-semibold text-slate-800">{mood.label}</h3>
                                                                    <p className="text-sm text-slate-600">{mood.description}</p>
                                                                </div>
                                                                <WeatherIconComponent className="ml-auto h-6 w-6 text-slate-400" />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {errors.mood && <p className="mt-2 text-sm text-red-600">{errors.mood}</p>}

                                            <div className="mt-6 text-center">
                                                <Button
                                                    type="button"
                                                    onClick={() => setCurrentStep(2)}
                                                    disabled={!data.mood}
                                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                >
                                                    Lanjut ke Intensitas
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Step 2: Intensity */}
                                {currentStep === 2 && selectedMoodConfig && (
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardHeader className="text-center">
                                            <div className="mb-2 flex items-center justify-center gap-3">
                                                <div className="text-3xl">{selectedMoodConfig.emoji}</div>
                                                <WeatherIcon className="h-8 w-8 text-slate-500" />
                                            </div>
                                            <CardTitle className="text-slate-800">
                                                Seberapa {selectedMoodConfig.label.toLowerCase()} perasaanmu?
                                            </CardTitle>
                                            <CardDescription>Geser slider untuk menunjukkan intensitas</CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm text-slate-600">
                                                    <span>Sedikit</span>
                                                    <span>Sangat</span>
                                                </div>
                                                <Slider
                                                    value={[data.intensity]}
                                                    onValueChange={(value) => setData((prev) => ({ ...prev, intensity: value[0] }))}
                                                    max={5}
                                                    min={1}
                                                    step={1}
                                                    className="w-full"
                                                />
                                                <div className="text-center">
                                                    <div className="mb-2 text-6xl">
                                                        {Array.from({ length: data.intensity }, (_, i) => selectedMoodConfig.emoji).join('')}
                                                    </div>
                                                    <p className="text-lg font-medium text-slate-800">Level {data.intensity} dari 5</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCurrentStep(1)}
                                                    className="flex-1 bg-transparent"
                                                >
                                                    Kembali
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => setCurrentStep(3)}
                                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                >
                                                    Lanjut ke Catatan
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Step 3: Notes and Triggers */}
                                {currentStep === 3 && selectedMoodConfig && (
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                                <Sparkles className="h-5 w-5 text-purple-500" />
                                                Ceritakan lebih detail
                                            </CardTitle>
                                            <CardDescription>Tambahkan catatan dan faktor yang mempengaruhi mood (opsional)</CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            {/* Notes */}
                                            <div className="space-y-2">
                                                <Label htmlFor="note" className="text-slate-700">
                                                    Catatan Mood
                                                </Label>
                                                <Textarea
                                                    id="note"
                                                    value={data.note}
                                                    onChange={(e) => setData((prev) => ({ ...prev, note: e.target.value }))}
                                                    placeholder="Apa yang membuatmu merasa seperti ini? Ceritakan tentang harimu..."
                                                    className="min-h-[120px] resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                                />
                                                {errors.note && <p className="text-sm text-red-600">{errors.note}</p>}
                                            </div>

                                            {/* Mood Triggers */}
                                            <div className="space-y-3">
                                                <Label className="text-slate-700">Faktor yang Mempengaruhi</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {moodTriggers.map((trigger) => (
                                                        <button
                                                            key={trigger}
                                                            type="button"
                                                            onClick={() => toggleTrigger(trigger)}
                                                            className={`rounded-lg border p-2 text-left text-sm transition-colors ${
                                                                data.triggers.includes(trigger)
                                                                    ? 'border-purple-300 bg-purple-100 text-purple-700'
                                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            {trigger}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCurrentStep(2)}
                                                    className="flex-1 bg-transparent"
                                                >
                                                    Kembali
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {isLoading ? 'Menyimpan...' : existingEntry ? 'Update Mood' : 'Simpan Mood'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Current Selection Preview */}
                            {selectedMoodConfig && (
                                <Card className={`border-0 shadow-lg ${selectedMoodConfig.color}`}>
                                    <CardContent className="p-6 text-center">
                                        <WeatherIcon className="mx-auto mb-3 h-12 w-12 opacity-60" />
                                        <div className="mb-2 text-4xl">{selectedMoodConfig.emoji}</div>
                                        <h3 className="mb-1 font-semibold">{selectedMoodConfig.label}</h3>
                                        {currentStep >= 2 && <p className="text-sm opacity-80">Intensitas: {data.intensity}/5</p>}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Suggestions */}
                            {selectedMoodConfig && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-slate-800">
                                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                                            Saran untuk Mood Ini
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {selectedMoodConfig.suggestions.map((suggestion, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                                <p className="text-sm text-slate-600">{suggestion}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Daily Goal */}
                            <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-2">
                                        <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <div>
                                            <h3 className="mb-1 font-medium text-green-800">Goal Harian</h3>
                                            <p className="text-sm text-green-700">
                                                Tracking mood setiap hari membantu memahami pola emosional dan meningkatkan kesadaran diri.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Tips Mood Tracking</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Catat mood di waktu yang sama setiap hari</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Jujur dengan perasaanmu, tidak ada jawaban yang salah</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Perhatikan pola dan trigger yang berulang</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Gunakan data untuk self-reflection dan improvement</p>
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
