import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Cloud,
    CloudRain,
    Edit,
    Eye,
    Flame,
    Frown,
    Heart,
    Lightbulb,
    Meh,
    Plus,
    Smile,
    Sun,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

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

interface Stats {
    totalEntries: number;
    streakDays: number;
    mostCommonMood: string;
    averageIntensity: number;
    topTriggers: Record<string, number>;
    moodDistribution: Record<string, number>;
}

interface Props {
    moodEntries: MoodEntry[];
    stats: Stats;
    todayEntry?: MoodEntry;
    hasTrackedToday: boolean;
}

const moodConfig = {
    happy: {
        label: 'Bahagia',
        emoji: '😊',
        icon: Smile,
        color: 'text-green-500 bg-green-50 border-green-200',
        weather: Sun,
        bgColor: 'from-green-400 to-emerald-500',
    },
    neutral: {
        label: 'Biasa',
        emoji: '😐',
        icon: Meh,
        color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
        weather: Cloud,
        bgColor: 'from-yellow-400 to-orange-500',
    },
    sad: {
        label: 'Sedih',
        emoji: '😢',
        icon: Frown,
        color: 'text-blue-500 bg-blue-50 border-blue-200',
        weather: CloudRain,
        bgColor: 'from-blue-400 to-indigo-500',
    },
    stressed: {
        label: 'Stres',
        emoji: '😰',
        icon: Frown,
        color: 'text-red-500 bg-red-50 border-red-200',
        weather: CloudRain,
        bgColor: 'from-red-400 to-pink-500',
    },
    calm: {
        label: 'Tenang',
        emoji: '😌',
        icon: Smile,
        color: 'text-purple-500 bg-purple-50 border-purple-200',
        weather: Sun,
        bgColor: 'from-purple-400 to-indigo-500',
    },
};

export default function MoodTrackerIndex({ moodEntries, stats, todayEntry, hasTrackedToday }: Props) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    console.log('Mood Entries:', moodEntries);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mood Tracker', href: '/mood-tracker' },
    ];

    const handleDelete = (entryId: number) => {
        setIsDeleting(true);
        router.delete(`/mood-tracker/${entryId}`, {
            onSuccess: () => {
                setDeletingEntryId(null);
            },
            onError: (errors) => {
                console.error('Error deleting mood entry:', errors);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMoodColor = (mood: string) => {
        return moodConfig[mood as keyof typeof moodConfig]?.color || 'text-slate-500 bg-slate-50 border-slate-200';
    };

    const generateCalendarDays = () => {
        const firstDay = new Date(selectedYear, selectedMonth, 1);
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const moodEntry = moodEntries.find((entry) => entry.tracked_at === dateStr);
            const isCurrentMonth = currentDate.getMonth() === selectedMonth;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            days.push({
                date: new Date(currentDate),
                dateStr,
                moodEntry,
                isCurrentMonth,
                isToday,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const navigateMonth = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
            } else {
                setSelectedMonth(selectedMonth - 1);
            }
        } else {
            if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
            } else {
                setSelectedMonth(selectedMonth + 1);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mood Tracker" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Mood Tracker</h1>
                            <p className="text-slate-600">Pantau dan analisis pola emosionalmu setiap hari</p>
                        </div>

                        <div className="flex gap-3">
                            <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
                                <Link href="/mood-tracker/analytics">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Analytics
                                </Link>
                            </Button>

                            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                <Link href="/mood-tracker/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {hasTrackedToday ? 'Update Mood' : 'Track Mood'}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Today's Status */}
                    {hasTrackedToday && todayEntry ? (
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{moodConfig[todayEntry.mood as keyof typeof moodConfig]?.emoji}</div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">
                                                Mood Hari Ini: {moodConfig[todayEntry.mood as keyof typeof moodConfig]?.label}
                                            </h3>
                                            <p className="text-slate-600">
                                                Intensitas: {todayEntry.intensity}/5 • Dicatat pada {formatTime(todayEntry.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                                        <Link href={`/mood-tracker/${todayEntry.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 border-dashed border-purple-300 bg-purple-50/50 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <Heart className="mx-auto mb-3 h-12 w-12 text-purple-400" />
                                <h3 className="mb-2 text-lg font-semibold text-slate-800">Belum tracking mood hari ini</h3>
                                <p className="mb-4 text-slate-600">Luangkan waktu sebentar untuk mencatat bagaimana perasaanmu hari ini</p>
                                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                    <Link href="/mood-tracker/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Track Mood Sekarang
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Statistics Cards */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Streak Card */}
                            <Card className="border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100">Streak Tracking</p>
                                            <p className="text-3xl font-bold">{stats.streakDays} hari</p>
                                        </div>
                                        <Flame className="h-12 w-12 text-orange-200" />
                                    </div>
                                    <p className="mt-2 text-sm text-orange-100">
                                        {stats.streakDays > 0 ? 'Luar biasa! Terus pertahankan!' : 'Mulai tracking mood sekarang!'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Entries */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-600">Total Entries</p>
                                            <p className="text-2xl font-bold text-slate-800">{stats.totalEntries}</p>
                                        </div>
                                        <Calendar className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Most Common Mood */}
                            {stats.mostCommonMood && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <h3 className="mb-3 text-sm font-medium text-slate-600">Mood Tersering</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{moodConfig[stats.mostCommonMood as keyof typeof moodConfig]?.emoji}</div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {moodConfig[stats.mostCommonMood as keyof typeof moodConfig]?.label}
                                                </p>
                                                <p className="text-sm text-slate-600">{stats.moodDistribution[stats.mostCommonMood]} kali</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Average Intensity */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-600">Rata-rata Intensitas</p>
                                            <p className="text-2xl font-bold text-slate-800">{stats.averageIntensity}/5</p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <Progress value={(stats.averageIntensity / 5) * 100} className="mt-3" />
                                </CardContent>
                            </Card>

                            {/* Tips Card */}
                            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-2">
                                        <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                                        <div>
                                            <h3 className="mb-1 font-medium text-blue-800">Tips Hari Ini</h3>
                                            <p className="text-sm text-blue-700">
                                                Tracking mood secara konsisten membantu mengenali pola emosional dan trigger yang berulang.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Calendar and Recent Entries */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Mood Calendar */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-slate-800">
                                            <CalendarDays className="h-5 w-5 text-purple-500" />
                                            Kalender Mood
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="bg-transparent">
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <span className="min-w-[120px] text-center font-medium">
                                                {monthNames[selectedMonth]} {selectedYear}
                                            </span>
                                            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="bg-transparent">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-7 gap-2 place-items-center">
                                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                                            <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                                                {day}
                                            </div>
                                        ))}
                                        {calendarDays.map(({ date, dateStr, moodEntry, isCurrentMonth, isToday }, index) => (
                                            <div
                                                key={index}
                                                className={`relative h-12 w-12 rounded-lg border transition-colors ${
                                                    !isCurrentMonth
                                                        ? 'border-slate-100 text-slate-300'
                                                        : isToday
                                                          ? 'border-purple-300 bg-purple-50'
                                                          : moodEntry
                                                            ? 'border-slate-200 hover:border-slate-300'
                                                            : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex h-full items-center justify-center">
                                                    <span className="text-sm font-medium">{date.getDate()}</span>
                                                </div>
                                                {moodEntry && (
                                                    <div className="absolute -right-1 -bottom-1 text-lg">
                                                        {moodConfig[moodEntry.mood as keyof typeof moodConfig]?.emoji}
                                                    </div>
                                                )}
                                                {isToday && !moodEntry && (
                                                    <div className="absolute -right-1 -bottom-1">
                                                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Entries */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Mood Terbaru</CardTitle>
                                    <CardDescription>Tracking mood dalam 30 hari terakhir</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {moodEntries.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <Heart className="mx-auto mb-4 h-16 w-16 text-slate-400" />
                                            <h3 className="mb-2 text-xl font-semibold text-slate-800">Belum ada data mood</h3>
                                            <p className="mb-4 text-slate-600">Mulai tracking mood untuk melihat pola emosionalmu</p>
                                            <Button
                                                asChild
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                            >
                                                <Link href="/mood-tracker/create">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Track Mood Pertama
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {moodEntries.slice(0, 10).map((entry) => {
                                                const moodInfo = moodConfig[entry.mood as keyof typeof moodConfig];
                                                const WeatherIcon = moodInfo?.weather || Cloud;

                                                return (
                                                    <div
                                                        key={entry.id}
                                                        className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
                                                    >
                                                        <div className="flex-shrink-0 text-3xl">{moodInfo?.emoji}</div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <Badge className={`${moodInfo?.color} border text-xs`}>{moodInfo?.label}</Badge>
                                                                <span className="text-xs text-slate-500">Intensitas: {entry.intensity}/5</span>
                                                            </div>
                                                            <p className="text-sm font-medium text-slate-800">{formatDate(entry.tracked_at)}</p>
                                                            {entry.note && <p className="truncate text-sm text-slate-600">{entry.note}</p>}
                                                            {entry.triggers?.length > 0 && (
                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                    {entry.triggers.slice(0, 3).map((trigger, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
                                                                        >
                                                                            {trigger}
                                                                        </span>
                                                                    ))}
                                                                    {entry.triggers.length > 3 && (
                                                                        <span className="text-xs text-slate-500">
                                                                            +{entry.triggers.length - 3} lainnya
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <Button asChild variant="ghost" size="sm">
                                                                <Link href={`/mood-tracker/${entry.id}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button asChild variant="ghost" size="sm">
                                                                <Link href={`/mood-tracker/${entry.id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Hapus Mood Entry?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Apakah kamu yakin ingin menghapus mood entry pada tanggal{' '}
                                                                            {formatDate(entry.tracked_at)}? Tindakan ini tidak dapat dibatalkan.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(entry.id)}
                                                                            className="bg-red-500 hover:bg-red-600"
                                                                            disabled={isDeleting}
                                                                        >
                                                                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {moodEntries.length > 10 && (
                                                <div className="text-center">
                                                    <Button asChild variant="outline" className="bg-transparent">
                                                        <Link href="/mood-tracker?view=all">Lihat Semua ({moodEntries.length} entries)</Link>
                                                    </Button>
                                                </div>
                                            )}
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
