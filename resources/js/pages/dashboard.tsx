import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Course, User, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Award, BookOpen, Brain, CheckCircle, Clock, Heart, Play, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data - in real app, this would come from props
const mockUser = {
    name: 'Sarah',
    totalCourses: 12,
    completedCourses: 4,
    currentStreak: 7,
    totalPoints: 850,
};

const moodOptions = [
    { emoji: '😊', label: 'Bahagia', value: 'happy', color: 'text-green-500' },
    { emoji: '😐', label: 'Biasa', value: 'neutral', color: 'text-yellow-500' },
    { emoji: '😔', label: 'Sedih', value: 'sad', color: 'text-blue-500' },
    { emoji: '😰', label: 'Stres', value: 'stressed', color: 'text-red-500' },
    { emoji: '😌', label: 'Tenang', value: 'calm', color: 'text-purple-500' },
];

export default function Dashboard({ courses, user }: { courses: Course[]; user: User }) {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [moodNote, setMoodNote] = useState('');
    const [moodSaved, setMoodSaved] = useState(false);
    const [isEditingMood, setIsEditingMood] = useState(false);

    // Get today's mood tracker from user data
    const getTodayMoodTracker = () => {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        return user.mood_trackers?.find((tracker) => tracker.tracked_at === today) || null;
    };

    const todayMoodTracker = getTodayMoodTracker();
    const hasTrackedToday = todayMoodTracker !== null;

    // Initialize form with existing data when editing
    useEffect(() => {
        if (isEditingMood && todayMoodTracker) {
            setSelectedMood(todayMoodTracker.mood);
            setMoodNote(todayMoodTracker.note || '');
        }
    }, [isEditingMood, todayMoodTracker]);

    const handleMoodSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMood) {
            router.post(
                '/mood-tracker',
                {
                    mood: selectedMood,
                    note: moodNote,
                },
                {
                    onSuccess: () => {
                        setMoodSaved(true);
                        setIsEditingMood(false);
                        setSelectedMood(null);
                        setMoodNote('');
                        setTimeout(() => setMoodSaved(false), 3000);
                    },
                    onError: (errors) => {
                        console.error('Error saving mood:', errors);
                    },
                },
            );
        }
    };

    const handleEditMood = () => {
        setIsEditingMood(true);
        if (todayMoodTracker) {
            setSelectedMood(todayMoodTracker.mood);
            setMoodNote(todayMoodTracker.note || '');
        }
    };

    const handleCancelEdit = () => {
        setIsEditingMood(false);
        setSelectedMood(null);
        setMoodNote('');
    };

    /*
    const getTodayMoodDisplay = () => {
        if (!todayMoodTracker) return null;
        const moodOption = moodOptions.find((m) => m.value === todayMoodTracker.mood);
        return moodOption ? `${moodOption.emoji} ${moodOption.label}` : todayMoodTracker.mood;
    };
    */

    console.log('User data:', user);
    console.log('Today mood tracker:', todayMoodTracker);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="text-center md:text-left">
                        <h1 className="mb-2 text-3xl font-bold text-slate-800 md:text-4xl">Selamat datang kembali, {user.name}! 👋</h1>
                        <p className="text-slate-600">Mari lanjutkan perjalanan belajar dan self-care hari ini</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <BookOpen className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                                <p className="text-2xl font-bold text-slate-800">{mockUser.completedCourses}</p>
                                <p className="text-sm text-slate-600">Course Selesai</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                                <p className="text-2xl font-bold text-slate-800">{mockUser.currentStreak}</p>
                                <p className="text-sm text-slate-600">Hari Berturut</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <Award className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                                <p className="text-2xl font-bold text-slate-800">{mockUser.totalPoints}</p>
                                <p className="text-sm text-slate-600">Total Poin</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <Heart className="mx-auto mb-2 h-8 w-8 text-rose-500" />
                                <p className="text-2xl font-bold text-slate-800">
                                    {Math.round((mockUser.completedCourses / mockUser.totalCourses) * 100)}%
                                </p>
                                <p className="text-sm text-slate-600">Progress</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Continue Learning */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Play className="h-5 w-5 text-emerald-500" />
                                        Lanjutkan Belajar
                                    </CardTitle>
                                    <CardDescription>Course yang sedang kamu ikuti</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {!user.user_courses || user.user_courses?.length === 0 ? (
                                        <p className="text-center text-slate-600">Kamu belum mengikuti course apapun. Mulai belajar sekarang!</p>
                                    ) : (
                                        <>
                                            {user.user_courses?.map((course) => (
                                                <div key={course.id} className="flex gap-4 rounded-lg bg-slate-50 p-4">
                                                    <img
                                                        src={course.thumbnail || '/placeholder.svg'}
                                                        alt={course.title}
                                                        className="h-14 w-20 rounded-lg object-cover"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex flex-wrap items-start justify-between">
                                                            <div>
                                                                <h3 className="truncate font-semibold text-slate-800">{course.title}</h3>
                                                                <p className="line-clamp-2 text-sm text-slate-600">
                                                                    {course.description || 'Deskripsi course belum tersedia.'}
                                                                </p>
                                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {course.course_category_id}
                                                                    </Badge>
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {course.time_to_complete}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Button asChild size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                                                                <Link href={`/courses/${course.slug}`}>Lanjut</Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button asChild variant="outline" className="w-full bg-transparent">
                                                <Link href="/courses">Lihat Semua Course</Link>
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        Rekomendasi Untukmu
                                    </CardTitle>
                                    <CardDescription>Course yang mungkin kamu suka</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 space-y-4">
                                        {courses.map((course) => (
                                            <div key={course.id} className="group cursor-pointer">
                                                <Link href={`/courses/${course.slug}`}>
                                                    <div className="rounded-lg bg-slate-50 p-4 transition-colors group-hover:bg-slate-100">
                                                        <img
                                                            src="/img/placeholder.svg"
                                                            alt={course.title}
                                                            className="mb-3 h-24 w-full rounded-lg object-cover"
                                                        />
                                                        <h3 className="mb-2 font-semibold text-slate-800">{course.title}</h3>
                                                        <p className="line-clamp-2 text-sm text-slate-600">{course.description}</p>
                                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {course.course_category_id}
                                                            </Badge>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                <span>4.7</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {course.time_to_complete} menit
                                                            </span>
                                                            <span>100+ siswa</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>

                                    <Button asChild variant="outline" className="w-full bg-transparent">
                                        <Link href="/courses">Lihat Semua Course</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Daily Mood Tracker */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Heart className="h-5 w-5 text-rose-500" />
                                        Mood Hari Ini
                                    </CardTitle>
                                    <CardDescription>Bagaimana perasaanmu hari ini?</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {moodSaved ? (
                                        <div className="py-4 text-center">
                                            <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
                                            <p className="font-medium text-green-600">Mood tersimpan!</p>
                                            <p className="text-sm text-slate-600">Terima kasih sudah berbagi</p>
                                        </div>
                                    ) : hasTrackedToday && !isEditingMood ? (
                                        <div className="py-4 text-center">
                                            <div className="mb-2 text-4xl">{moodOptions.find((m) => m.value === todayMoodTracker.mood)?.emoji}</div>
                                            <p className="font-medium text-slate-800">
                                                Mood hari ini: {moodOptions.find((m) => m.value === todayMoodTracker.mood)?.label}
                                            </p>
                                            {todayMoodTracker.note && <p className="mt-2 text-sm text-slate-600 italic">"{todayMoodTracker.note}"</p>}
                                            <div className="mt-3 flex justify-center gap-2">
                                                <Button onClick={handleEditMood} variant="outline" size="sm">
                                                    Update Mood
                                                </Button>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href="/mood-tracker">Lihat Riwayat</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleMoodSubmit}>
                                            <div className="mb-4 grid grid-cols-5 gap-2">
                                                {moodOptions.map((mood) => (
                                                    <button
                                                        key={mood.value}
                                                        type="button"
                                                        onClick={() => setSelectedMood(mood.value)}
                                                        className={`rounded-lg p-3 text-center transition-all hover:bg-slate-100 ${
                                                            selectedMood === mood.value ? 'bg-slate-100 ring-2 ring-emerald-400' : ''
                                                        }`}
                                                    >
                                                        <div className="mb-1 text-2xl">{mood.emoji}</div>
                                                        <div className={`text-xs ${mood.color}`}>{mood.label}</div>
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedMood && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label htmlFor="mood-note" className="mb-2 block text-sm font-medium text-slate-700">
                                                            Catatan (opsional)
                                                        </label>
                                                        <textarea
                                                            id="mood-note"
                                                            value={moodNote}
                                                            onChange={(e) => setMoodNote(e.target.value)}
                                                            rows={3}
                                                            className="w-full rounded-lg border border-slate-200 p-3 text-sm placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
                                                            placeholder="Ceritakan lebih detail tentang perasaanmu hari ini..."
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                                                            {hasTrackedToday ? 'Update Mood' : 'Simpan Mood'}
                                                        </Button>
                                                        {isEditingMood && (
                                                            <Button type="button" onClick={handleCancelEdit} variant="outline">
                                                                Batal
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Brain className="h-5 w-5 text-purple-500" />
                                        Self-Care Tools
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                                        <Link href="/mood-tracker">
                                            <Heart className="mr-2 h-4 w-4" />
                                            Mood Tracker
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                                        <Link href="/journal">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Tulis Journal
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                                        <Link href="/assessment">
                                            <Brain className="mr-2 h-4 w-4" />
                                            Self Assessment
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Achievement */}
                            <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <Award className="mx-auto mb-2 h-12 w-12 text-yellow-500" />
                                    <h3 className="mb-1 font-semibold text-slate-800">Streak 7 Hari! 🔥</h3>
                                    <p className="text-sm text-slate-600">Kamu konsisten belajar selama seminggu!</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
