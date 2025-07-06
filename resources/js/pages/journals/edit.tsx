import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Journal } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BookOpen, Calendar, FileText, Frown, Heart, Lightbulb, Meh, Save, Smile } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    journal: Journal;
}

const moodOptions = [
    {
        value: 'happy',
        label: 'Bahagia',
        icon: Smile,
        color: 'text-green-500 bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
        value: 'neutral',
        label: 'Biasa',
        icon: Meh,
        color: 'text-yellow-500 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    },
    {
        value: 'sad',
        label: 'Sedih',
        icon: Frown,
        color: 'text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
        value: 'stressed',
        label: 'Stres',
        icon: Frown,
        color: 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100',
    },
    {
        value: 'calm',
        label: 'Tenang',
        icon: Smile,
        color: 'text-purple-500 bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
];

export default function EditJournalPage({ journal }: Props) {
    const [data, setData] = useState({
        title: journal.title,
        content: journal.content,
        mood: journal.mood,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Journal', href: '/journal' },
        { title: journal.title, href: `/journal/${journal.slug}` },
        { title: 'Edit', href: `/journal/${journal.slug}/edit` },
    ];

    // Track changes
    useEffect(() => {
        const changed = data.title !== journal.title || data.content !== journal.content || data.mood !== journal.mood;
        setHasChanges(changed);
    }, [data, journal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.content.trim()) {
            setErrors({ content: 'Isi jurnal harus diisi.' });
            return;
        }

        if (!data.mood) {
            setErrors({ mood: 'Pilih mood terlebih dahulu.' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        router.put(
            `/journal/${journal.slug}/edit`,
            {
                title: data.title || 'Untitled',
                content: data.content,
                mood: data.mood,
            },
            {
                onSuccess: () => {
                    // Will be redirected by controller to show page
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

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const wordCount = data.content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    const originalWordCount = journal.word_count;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${journal.title}`} />
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href={`/journal/${journal.slug}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Jurnal
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Diedit:{' '}
                                {new Date().toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
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
                                        <BookOpen className="h-5 w-5 text-rose-500" />
                                        Edit Jurnal
                                    </CardTitle>
                                    <CardDescription>Perbarui jurnal dengan pemikiran atau perasaan terbaru</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-slate-700">
                                                Judul (Opsional)
                                            </Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="Berikan judul untuk jurnalmu..."
                                                className="border-slate-200 focus:border-rose-400 focus:ring-rose-400"
                                            />
                                            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                                        </div>

                                        {/* Mood Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-slate-700">Bagaimana perasaanmu sekarang?</Label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {moodOptions.map((mood) => {
                                                    const IconComponent = mood.icon;
                                                    return (
                                                        <button
                                                            key={mood.value}
                                                            type="button"
                                                            onClick={() => handleInputChange('mood', mood.value)}
                                                            className={`rounded-lg border-2 p-3 text-center transition-all ${
                                                                data.mood === mood.value
                                                                    ? mood.color + ' ring-2 ring-rose-400 ring-offset-2'
                                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <IconComponent className="mx-auto mb-1 h-6 w-6" />
                                                            <span className="text-xs font-medium">{mood.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {errors.mood && <p className="text-sm text-red-600">{errors.mood}</p>}
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="content" className="text-slate-700">
                                                    Isi Jurnal *
                                                </Label>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <FileText className="h-4 w-4" />
                                                    <span>
                                                        {wordCount} kata
                                                        {wordCount !== originalWordCount && (
                                                            <span className={wordCount > originalWordCount ? 'text-green-600' : 'text-red-600'}>
                                                                {' '}
                                                                ({wordCount > originalWordCount ? '+' : ''}
                                                                {wordCount - originalWordCount})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <Textarea
                                                id="content"
                                                value={data.content}
                                                onChange={(e) => handleInputChange('content', e.target.value)}
                                                placeholder="Mulai menulis di sini... Ceritakan tentang harimu, perasaanmu, atau hal-hal yang ingin kamu refleksikan."
                                                className="min-h-[400px] resize-none border-slate-200 focus:border-rose-400 focus:ring-rose-400"
                                                required
                                            />
                                            {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                disabled={!data.content.trim() || isLoading || !hasChanges}
                                                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </Button>

                                            <Button asChild type="button" variant="outline" className="bg-transparent">
                                                <Link href={`/journal/${journal.slug}`}>Batal</Link>
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Edit Tips */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                                        Tips Edit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Tambahkan refleksi baru atau update perasaanmu</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Perbaiki typo atau kalimat yang kurang jelas</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Update mood jika perasaanmu berubah</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Jangan ragu untuk menambah detail yang terlewat</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Original Info */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Info Jurnal</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Dibuat</span>
                                        <span className="text-slate-800">{formatDate(journal.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Kata asli</span>
                                        <span className="text-slate-800">{originalWordCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Kata sekarang</span>
                                        <span
                                            className={`font-medium ${
                                                wordCount > originalWordCount
                                                    ? 'text-green-600'
                                                    : wordCount < originalWordCount
                                                      ? 'text-red-600'
                                                      : 'text-slate-800'
                                            }`}
                                        >
                                            {wordCount}
                                            {wordCount !== originalWordCount && (
                                                <span className="ml-1 text-xs">
                                                    ({wordCount > originalWordCount ? '+' : ''}
                                                    {wordCount - originalWordCount})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Version History */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Riwayat Edit</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="rounded bg-slate-50 p-2 text-sm">
                                        <div className="font-medium text-slate-800">Versi Asli</div>
                                        <div className="text-xs text-slate-600">
                                            {formatDate(journal.created_at)} • {originalWordCount} kata
                                        </div>
                                    </div>
                                    {journal.updated_at !== journal.created_at && (
                                        <div className="rounded border border-blue-200 bg-blue-50 p-2 text-sm">
                                            <div className="font-medium text-blue-800">Edit Terakhir</div>
                                            <div className="text-xs text-blue-600">
                                                {formatDate(journal.updated_at)} • {originalWordCount} kata
                                            </div>
                                        </div>
                                    )}
                                    {hasChanges && (
                                        <div className="rounded border border-rose-200 bg-rose-50 p-2 text-sm">
                                            <div className="font-medium text-rose-800">Draft Saat Ini</div>
                                            <div className="text-xs text-rose-600">Belum disimpan • {wordCount} kata</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Privacy Notice */}
                            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-2">
                                        <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                                        <div>
                                            <h3 className="mb-1 font-medium text-blue-800">Privasi Terjamin</h3>
                                            <p className="text-sm text-blue-700">
                                                Semua perubahan tetap bersifat pribadi. Hanya kamu yang dapat melihat dan mengedit jurnal ini.
                                            </p>
                                        </div>
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
