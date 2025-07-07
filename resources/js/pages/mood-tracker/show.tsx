import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Cloud,
    CloudRain,
    Edit,
    Frown,
    Heart,
    Meh,
    MoreHorizontal,
    Smile,
    Sun,
    Trash2,
    TrendingUp,
    Zap,
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

interface NavigationEntry {
    id: number;
    mood: string;
    tracked_at: string;
}

interface Props {
    moodEntry: MoodEntry;
    previousEntry?: NavigationEntry;
    nextEntry?: NavigationEntry;
    insights: string[];
}

const moodConfig = {
    happy: {
        emoji: '😊',
        label: 'Bahagia',
        color: 'text-green-500 bg-green-50 border-green-200',
        bgGradient: 'from-green-50 to-emerald-50',
        icon: Smile,
        weather: Sun,
        description: 'Hari yang menyenangkan dan positif',
        chartColor: 'bg-green-400',
    },
    neutral: {
        emoji: '😐',
        label: 'Biasa',
        color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
        bgGradient: 'from-yellow-50 to-amber-50',
        icon: Meh,
        weather: Cloud,
        description: 'Hari yang stabil dan tenang',
        chartColor: 'bg-yellow-400',
    },
    sad: {
        emoji: '😢',
        label: 'Sedih',
        color: 'text-blue-500 bg-blue-50 border-blue-200',
        bgGradient: 'from-blue-50 to-sky-50',
        icon: Frown,
        weather: CloudRain,
        description: 'Hari yang kurang menyenangkan',
        chartColor: 'bg-blue-400',
    },
    stressed: {
        emoji: '😰',
        label: 'Stres',
        color: 'text-red-500 bg-red-50 border-red-200',
        bgGradient: 'from-red-50 to-rose-50',
        icon: Frown,
        weather: CloudRain,
        description: 'Hari yang penuh tekanan',
        chartColor: 'bg-red-400',
    },
    calm: {
        emoji: '😌',
        label: 'Tenang',
        color: 'text-purple-500 bg-purple-50 border-purple-200',
        bgGradient: 'from-purple-50 to-violet-50',
        icon: Smile,
        weather: Sun,
        description: 'Hari yang damai dan rileks',
        chartColor: 'bg-purple-400',
    },
};

export default function MoodDetailPage({ moodEntry, previousEntry, nextEntry, insights }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mood Tracker', href: '/mood-tracker' },
        { title: 'Detail Mood', href: '#' },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
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

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/mood-tracker/${moodEntry.id}`, {
            onSuccess: () => {
                // Will be redirected to index by controller
            },
            onError: (errors) => {
                console.error('Error deleting mood entry:', errors);
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const moodInfo = moodConfig[moodEntry.mood as keyof typeof moodConfig];
    const MoodIcon = moodInfo?.icon || Meh;
    const WeatherIcon = moodInfo?.weather || Cloud;

    const getIntensityDescription = (intensity: number) => {
        const descriptions = {
            1: 'Sangat ringan',
            2: 'Ringan',
            3: 'Sedang',
            4: 'Kuat',
            5: 'Sangat kuat',
        };
        return descriptions[intensity as keyof typeof descriptions] || 'Sedang';
    };

    const getIntensityColor = (intensity: number) => {
        if (intensity <= 2) return 'text-slate-500';
        if (intensity === 3) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Mood ${formatDate(moodEntry.tracked_at)}`} />
            <div className={`min-h-screen bg-gradient-to-br ${moodInfo?.bgGradient || 'from-slate-50 to-slate-100'} p-4 md:p-6`}>
                <div className="mx-auto space-y-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href="/mood-tracker">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Tracker
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-white/80">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href={`/mood-tracker/${moodEntry.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Mood
                                    </Link>
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus Entry
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Mood Entry?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tindakan ini tidak dapat dibatalkan. Data mood untuk tanggal ini akan dihapus secara
                                                permanen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-red-500 hover:bg-red-600"
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Mood Header */}
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <div className={`bg-gradient-to-r ${moodInfo?.bgGradient || 'from-slate-50 to-slate-100'} p-6`}>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-6xl">{moodInfo?.emoji || '😐'}</div>
                                            <div>
                                                <h1 className="text-3xl font-bold text-slate-800">
                                                    {moodInfo?.label || 'Tidak diketahui'}
                                                </h1>
                                                <p className="text-slate-600">
                                                    {moodInfo?.description || 'Mood tidak diketahui'}
                                                </p>
                                            </div>
                                        </div>
                                        <WeatherIcon className="h-12 w-12 text-slate-400" />
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(moodEntry.tracked_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatTime(moodEntry.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap className="h-4 w-4" />
                                            <span className={getIntensityColor(moodEntry.intensity)}>
                                                {getIntensityDescription(moodEntry.intensity)} ({moodEntry.intensity}/5)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Mood Details */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Detail Mood</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Intensity Visualization */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-700">Intensitas</span>
                                            <span className={`font-medium ${getIntensityColor(moodEntry.intensity)}`}>
                                                {moodEntry.intensity}/5
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-3 flex-1 rounded ${
                                                        i < moodEntry.intensity
                                                            ? moodInfo?.chartColor || 'bg-slate-400'
                                                            : 'bg-slate-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-2 text-4xl">
                                                {Array.from({ length: moodEntry.intensity }, (_, i) => moodInfo?.emoji || '😐').join('')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {moodEntry.note && (
                                        <div className="space-y-2">
                                            <h3 className="font-medium text-slate-700">Catatan</h3>
                                            <div className="rounded-lg bg-slate-50 p-4">
                                                <p className="leading-relaxed text-slate-700">{moodEntry.note}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Triggers */}
                                    {moodEntry.triggers && moodEntry.triggers.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="font-medium text-slate-700">Faktor yang Mempengaruhi</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {moodEntry.triggers.map((trigger, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-slate-100">
                                                        {trigger}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <div className="border-t border-slate-100 pt-4 text-sm text-slate-500">
                                        <div className="flex justify-between">
                                            <span>
                                                Dicatat pada: {formatDate(moodEntry.created_at)} pukul{' '}
                                                {formatTime(moodEntry.created_at)}
                                            </span>
                                            {moodEntry.updated_at !== moodEntry.created_at && (
                                                <span>Diedit: {formatTime(moodEntry.updated_at)}</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Aksi Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                                        <Link href={`/mood-tracker/${moodEntry.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Mood
                                        </Link>
                                    </Button>

                                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                                        <Link href="/mood-tracker/create">
                                            <Heart className="mr-2 h-4 w-4" />
                                            Catat Mood Hari Ini
                                        </Link>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus Entry
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus Mood Entry?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. Data mood untuk tanggal ini akan dihapus
                                                    secara permanen.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="bg-red-500 hover:bg-red-600"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>

                            {/* Mood Stats */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Statistik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Mood</span>
                                        <Badge className={`border text-xs ${moodInfo?.color || 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                                            <MoodIcon className="mr-1 h-3 w-3" />
                                            {moodInfo?.label || 'Tidak diketahui'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Intensitas</span>
                                        <span className={`font-medium ${getIntensityColor(moodEntry.intensity)}`}>
                                            {moodEntry.intensity}/5
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Faktor</span>
                                        <span className="font-medium text-slate-800">
                                            {moodEntry.triggers?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Catatan</span>
                                        <span className="font-medium text-slate-800">
                                            {moodEntry.note ? `${moodEntry.note.length} karakter` : 'Tidak ada'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Mood Insights */}
                            <Card className={`border-0 bg-gradient-to-r shadow-lg ${moodInfo?.bgGradient || 'from-slate-50 to-slate-100'}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-2">
                                        <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                                        <div>
                                            <h3 className="mb-1 font-medium text-slate-800">Insight</h3>
                                            <div className="space-y-2">
                                                {insights.map((insight, index) => (
                                                    <p key={index} className="text-sm text-slate-700">
                                                        {insight}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Navigation */}
                            {(previousEntry || nextEntry) && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-800">Navigasi</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {previousEntry && (
                                            <Link
                                                href={`/mood-tracker/${previousEntry.id}`}
                                                className="block rounded p-2 transition-colors hover:bg-slate-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-700">← Hari Sebelumnya</span>
                                                    <span className="text-lg">
                                                        {moodConfig[previousEntry.mood as keyof typeof moodConfig]?.emoji || '😐'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {formatDate(previousEntry.tracked_at)}
                                                </span>
                                            </Link>
                                        )}
                                        {nextEntry && (
                                            <Link
                                                href={`/mood-tracker/${nextEntry.id}`}
                                                className="block rounded p-2 transition-colors hover:bg-slate-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-700">Hari Selanjutnya →</span>
                                                    <span className="text-lg">
                                                        {moodConfig[nextEntry.mood as keyof typeof moodConfig]?.emoji || '😐'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {formatDate(nextEntry.tracked_at)}
                                                </span>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}