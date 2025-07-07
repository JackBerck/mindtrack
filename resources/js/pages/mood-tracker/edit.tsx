import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Frown,
    Heart,
    Meh,
    Save,
    Smile,
    Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface MoodEntry {
    id: number;
    mood: string;
    intensity: number;
    note: string;
    triggers: string[];
    tracked_at: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    moodEntry: MoodEntry;
}

const moodOptions = [
    {
        value: 'happy',
        label: 'Bahagia',
        emoji: '😊',
        icon: Smile,
        color: 'text-green-500 bg-green-50 border-green-200 hover:bg-green-100',
        description: 'Merasa senang dan positif',
    },
    {
        value: 'neutral',
        label: 'Biasa',
        emoji: '😐',
        icon: Meh,
        color: 'text-yellow-500 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        description: 'Perasaan stabil, tidak terlalu tinggi atau rendah',
    },
    {
        value: 'sad',
        label: 'Sedih',
        emoji: '😢',
        icon: Frown,
        color: 'text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100',
        description: 'Merasa down atau kecewa',
    },
    {
        value: 'stressed',
        label: 'Stres',
        emoji: '😰',
        icon: Frown,
        color: 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100',
        description: 'Merasa tertekan atau cemas',
    },
    {
        value: 'calm',
        label: 'Tenang',
        emoji: '😌',
        icon: Smile,
        color: 'text-purple-500 bg-purple-50 border-purple-200 hover:bg-purple-100',
        description: 'Merasa damai dan rileks',
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

export default function EditMoodPage({ moodEntry }: Props) {
    const [intensity, setIntensity] = useState([moodEntry.intensity]);
    const [hasChanges, setHasChanges] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mood Tracker', href: '/mood-tracker' },
        { title: 'Edit Mood', href: '#' },
    ];

    const { data, setData, put, processing, errors, isDirty } = useForm({
        mood: moodEntry.mood,
        intensity: moodEntry.intensity,
        note: moodEntry.note || '',
        triggers: moodEntry.triggers || [],
    });

    // Track changes
    useEffect(() => {
        setHasChanges(isDirty);
    }, [isDirty]);

    // Update intensity in form data when slider changes
    useEffect(() => {
        setData('intensity', intensity[0]);
    }, [intensity, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/mood-tracker/${moodEntry.id}/edit`, {
            onSuccess: () => {
                // Will redirect to show page automatically
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    const toggleTrigger = (trigger: string) => {
        const currentTriggers = data.triggers;
        const newTriggers = currentTriggers.includes(trigger)
            ? currentTriggers.filter((t) => t !== trigger)
            : [...currentTriggers, trigger];
        setData('triggers', newTriggers);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const selectedMoodConfig = moodOptions.find((m) => m.value === data.mood);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Mood ${formatDate(moodEntry.tracked_at)}`} />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href={`/edit`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Detail
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(moodEntry.tracked_at)}</span>
                        </div>
                    </div>

                    {/* Unsaved Changes Warning */}
                    {hasChanges && (
                        <Card className="border-yellow-200 bg-yellow-50 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-yellow-800">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-medium">Ada perubahan yang belum disimpan</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Heart className="h-5 w-5 text-purple-500" />
                                        Edit Mood Entry
                                    </CardTitle>
                                    <CardDescription>Perbarui mood dan catatan untuk tanggal ini</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Mood Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-slate-700">Mood</Label>
                                            {errors.mood && (
                                                <p className="text-sm text-red-600">{errors.mood}</p>
                                            )}
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {moodOptions.map((mood) => (
                                                    <button
                                                        key={mood.value}
                                                        type="button"
                                                        onClick={() => setData('mood', mood.value)}
                                                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                                                            data.mood === mood.value
                                                                ? mood.color + ' ring-2 ring-purple-400 ring-offset-2'
                                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-2xl">{mood.emoji}</div>
                                                            <div>
                                                                <h3 className="font-medium text-slate-800">{mood.label}</h3>
                                                                <p className="text-xs text-slate-600">{mood.description}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Intensity */}
                                        <div className="space-y-4">
                                            <Label className="text-slate-700">Intensitas</Label>
                                            {errors.intensity && (
                                                <p className="text-sm text-red-600">{errors.intensity}</p>
                                            )}
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm text-slate-600">
                                                    <span>Sedikit</span>
                                                    <span>Sangat</span>
                                                </div>
                                                <Slider
                                                    value={intensity}
                                                    onValueChange={(value) => setIntensity(value)}
                                                    max={5}
                                                    min={1}
                                                    step={1}
                                                    className="w-full"
                                                />
                                                <div className="text-center">
                                                    {selectedMoodConfig && (
                                                        <div className="mb-2 text-4xl">
                                                            {Array.from({ length: intensity[0] }, (_, i) => selectedMoodConfig.emoji).join('')}
                                                        </div>
                                                    )}
                                                    <p className="text-sm font-medium text-slate-700">
                                                        Level {intensity[0]} dari 5
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-2">
                                            <Label htmlFor="notes" className="text-slate-700">
                                                Catatan
                                            </Label>
                                            {errors.note && (
                                                <p className="text-sm text-red-600">{errors.note}</p>
                                            )}
                                            <Textarea
                                                id="notes"
                                                value={data.note}
                                                onChange={(e) => setData('note', e.target.value)}
                                                placeholder="Ceritakan tentang mood dan perasaanmu..."
                                                className="min-h-[120px] resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>

                                        {/* Triggers */}
                                        <div className="space-y-3">
                                            <Label className="text-slate-700">Faktor yang Mempengaruhi</Label>
                                            {errors.triggers && (
                                                <p className="text-sm text-red-600">{errors.triggers}</p>
                                            )}
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

                                        {/* Submit Button */}
                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                disabled={!data.mood || processing || !hasChanges}
                                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.visit(`/edit`)}
                                                className="bg-transparent"
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Current Selection Preview */}
                            {selectedMoodConfig && (
                                <Card className={`border-0 shadow-lg ${selectedMoodConfig.color}`}>
                                    <CardContent className="p-6 text-center">
                                        <div className="mb-2 text-4xl">{selectedMoodConfig.emoji}</div>
                                        <h3 className="mb-1 font-semibold">{selectedMoodConfig.label}</h3>
                                        <p className="text-sm opacity-80">Intensitas: {intensity[0]}/5</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Original vs Current */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Perbandingan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Data Asli</h4>
                                        <div className="rounded-lg bg-slate-50 p-3 text-sm">
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-lg">
                                                    {moodOptions.find((m) => m.value === moodEntry.mood)?.emoji}
                                                </span>
                                                <span>{moodOptions.find((m) => m.value === moodEntry.mood)?.label}</span>
                                                <span className="text-slate-500">({moodEntry.intensity}/5)</span>
                                            </div>
                                            <p className="text-xs text-slate-600">
                                                {moodEntry.triggers?.length || 0} faktor • {moodEntry.note?.length || 0}{' '}
                                                karakter catatan
                                            </p>
                                        </div>
                                    </div>

                                    {hasChanges && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-700">Data Baru</h4>
                                            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="text-lg">{selectedMoodConfig?.emoji}</span>
                                                    <span>{selectedMoodConfig?.label}</span>
                                                    <span className="text-slate-500">({intensity[0]}/5)</span>
                                                </div>
                                                <p className="text-xs text-slate-600">
                                                    {data.triggers.length} faktor • {data.note.length} karakter catatan
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Selected Triggers */}
                            {data.triggers.length > 0 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-800">Faktor Terpilih</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {data.triggers.map((trigger, index) => (
                                                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                                                    {trigger}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Edit Tips */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Sparkles className="h-5 w-5 text-yellow-500" />
                                        Tips Edit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Update mood jika perasaanmu berubah sepanjang hari</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Tambahkan detail yang mungkin terlewat sebelumnya</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Sesuaikan intensitas berdasarkan refleksi lebih lanjut</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                        <p>Identifikasi faktor baru yang mempengaruhi mood</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Version History */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Riwayat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="rounded bg-slate-50 p-2 text-sm">
                                        <div className="font-medium text-slate-800">Entry Asli</div>
                                        <div className="text-xs text-slate-600">
                                            {new Date(moodEntry.created_at).toLocaleDateString('id-ID')} •{' '}
                                            {new Date(moodEntry.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    {moodEntry.updated_at !== moodEntry.created_at && (
                                        <div className="rounded bg-blue-50 p-2 text-sm">
                                            <div className="font-medium text-blue-800">Edit Terakhir</div>
                                            <div className="text-xs text-blue-600">
                                                {new Date(moodEntry.updated_at).toLocaleDateString('id-ID')} •{' '}
                                                {new Date(moodEntry.updated_at).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {hasChanges && (
                                        <div className="rounded border border-purple-200 bg-purple-50 p-2 text-sm">
                                            <div className="font-medium text-purple-800">Draft Saat Ini</div>
                                            <div className="text-xs text-purple-600">Belum disimpan</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}