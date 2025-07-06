import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, FileText, Frown, Heart, Lightbulb, Meh, Save, Smile } from 'lucide-react';
import { useState } from 'react';

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

const journalPrompts = [
    'Apa yang membuatmu bersyukur hari ini?',
    'Tantangan apa yang kamu hadapi dan bagaimana mengatasinya?',
    'Momen apa yang paling berkesan hari ini?',
    'Apa yang ingin kamu perbaiki dari diri sendiri?',
    'Bagaimana perasaanmu saat ini dan mengapa?',
    'Apa yang kamu pelajari hari ini?',
    'Siapa yang paling berpengaruh dalam hidupmu hari ini?',
    'Apa harapanmu untuk besok?',
];

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Journal', href: '/journal' },
    { title: 'Tulis Baru', href: '/journal/create' },
];

export default function CreateJournalPage() {
    const [data, setData] = useState({
        title: '',
        content: '',
        mood: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPrompts, setShowPrompts] = useState(false);

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

        router.post(
            '/journal',
            {
                title: data.title || 'Untitled',
                content: data.content,
                mood: data.mood,
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

    const insertPrompt = (prompt: string) => {
        setData((prev) => ({
            ...prev,
            content: prev.content + (prev.content ? '\n\n' : '') + prompt + '\n\n',
        }));
        setShowPrompts(false);
    };

    const wordCount = data.content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tulis Jurnal Baru" />
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href="/journal">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Journal
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date().toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <BookOpen className="h-5 w-5 text-rose-500" />
                                        Tulis Jurnal Baru
                                    </CardTitle>
                                    <CardDescription>Ekspresikan perasaan dan pikiranmu dalam ruang yang aman dan personal</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-slate-700">
                                                Judul *
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
                                            <Label className="text-slate-700">Bagaimana perasaanmu hari ini?</Label>
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
                                                    <span>{wordCount} kata</span>
                                                </div>
                                            </div>
                                            <Textarea
                                                id="content"
                                                value={data.content}
                                                onChange={(e) => handleInputChange('content', e.target.value)}
                                                placeholder="Mulai menulis di sini... Ceritakan tentang harimu, perasaanmu, atau hal-hal yang ingin kamu refleksikan."
                                                className="min-h-[300px] resize-none border-slate-200 focus:border-rose-400 focus:ring-rose-400"
                                                required
                                            />
                                            {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                disabled={!data.content.trim() || !data.mood || isLoading}
                                                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {isLoading ? 'Menyimpan...' : 'Simpan Jurnal'}
                                            </Button>

                                            <Button asChild type="button" variant="outline" className="bg-transparent">
                                                <Link href="/journal">Batal</Link>
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Writing Tips */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                                        Tips Menulis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Tulis dengan jujur dan terbuka, ini adalah ruang amanmu</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Tidak perlu sempurna, yang penting adalah mengekspresikan perasaan</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Fokus pada detail kecil yang membuatmu merasa grateful</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
                                        <p>Gunakan jurnal untuk memproses emosi dan pengalaman</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Journal Prompts */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Heart className="h-5 w-5 text-rose-500" />
                                        Inspirasi Menulis
                                    </CardTitle>
                                    <CardDescription>Butuh ide? Klik pertanyaan di bawah untuk memulai</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowPrompts(!showPrompts)}
                                        className="mb-3 w-full bg-transparent"
                                    >
                                        {showPrompts ? 'Sembunyikan' : 'Tampilkan'} Pertanyaan
                                    </Button>

                                    {showPrompts && (
                                        <div className="space-y-2">
                                            {journalPrompts.map((prompt, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => insertPrompt(prompt)}
                                                    className="w-full rounded-lg p-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                                                >
                                                    {prompt}
                                                </button>
                                            ))}
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
                                                Jurnal ini bersifat pribadi dan hanya bisa diakses oleh kamu. Tidak ada orang lain yang dapat membaca
                                                tulisanmu.
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
