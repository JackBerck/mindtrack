import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Award, BarChart3, Calendar, ChevronDown, Heart, PieChart, Sun, Target, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

interface WeeklyTrend {
    week: string;
    happy: number;
    neutral: number;
    calm: number;
    stressed: number;
    sad: number;
}

interface TopTrigger {
    trigger: string;
    count: number;
    impact: 'positive' | 'negative' | 'mixed';
}

interface MoodPatterns {
    bestDay: string;
    worstDay: string;
    bestTime: string;
    commonMood: string;
}

interface Analytics {
    totalEntries: number;
    currentStreak: number;
    longestStreak: number;
    averageIntensity: number;
    moodDistribution: Record<string, number>;
    weeklyTrends: WeeklyTrend[];
    topTriggers: TopTrigger[];
    moodPatterns: MoodPatterns;
    moodScore: number;
    insights: string[];
}

interface Props {
    analytics: Analytics;
    selectedPeriod: string;
    totalEntries: number;
}

const moodConfig = {
    happy: {
        emoji: '😊',
        label: 'Bahagia',
        color: 'bg-green-100 text-green-800',
        chartColor: 'bg-green-400',
    },
    neutral: {
        emoji: '😐',
        label: 'Biasa',
        color: 'bg-yellow-100 text-yellow-800',
        chartColor: 'bg-yellow-400',
    },
    sad: {
        emoji: '😢',
        label: 'Sedih',
        color: 'bg-blue-100 text-blue-800',
        chartColor: 'bg-blue-400',
    },
    stressed: {
        emoji: '😰',
        label: 'Stres',
        color: 'bg-red-100 text-red-800',
        chartColor: 'bg-red-400',
    },
    calm: {
        emoji: '😌',
        label: 'Tenang',
        color: 'bg-purple-100 text-purple-800',
        chartColor: 'bg-purple-400',
    },
};

export default function MoodAnalyticsPage({ analytics, selectedPeriod, totalEntries }: Props) {
    const [selectedPeriodState, setSelectedPeriodState] = useState(selectedPeriod);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mood Tracker', href: '/mood-tracker' },
        { title: 'Analytics', href: '/mood-tracker/analytics' },
    ];

    const handlePeriodChange = (period: string) => {
        setSelectedPeriodState(period);
        router.get(
            '/mood-tracker/analytics',
            { period },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const calculatePercentage = (count: number, total: number) => {
        return total > 0 ? Math.round((count / total) * 100) : 0;
    };

    const getPeriodLabel = (period: string) => {
        switch (period) {
            case '7':
                return '7 hari';
            case '30':
                return '30 hari';
            case '90':
                return '90 hari';
            default:
                return '30 hari';
        }
    };

    const getMoodScoreDescription = (score: number) => {
        if (score >= 80) return 'Excellent! Mood sangat stabil';
        if (score >= 60) return 'Good! Mood cukup positif';
        if (score >= 40) return 'Fair. Ada ruang untuk improvement';
        return 'Perlu perhatian lebih pada kesehatan mental';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mood Analytics" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Button asChild variant="ghost" className="mb-4">
                                <Link href="/mood-tracker">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Tracker
                                </Link>
                            </Button>
                            <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-slate-800 md:text-4xl">
                                <BarChart3 className="h-8 w-8 text-purple-500" />
                                Mood Analytics 📊
                            </h1>
                            <p className="text-slate-600">Analisis mendalam tentang pola mood dan tren emosionalmu</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white/80">
                                    {getPeriodLabel(selectedPeriodState)}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handlePeriodChange('7')}>7 hari</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePeriodChange('30')}>30 hari</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePeriodChange('90')}>90 hari</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {analytics.totalEntries === 0 ? (
                        /* Empty State */
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="py-12 text-center">
                                <BarChart3 className="mx-auto mb-4 h-16 w-16 text-slate-400" />
                                <h3 className="mb-2 text-xl font-semibold text-slate-800">Belum ada data untuk dianalisis</h3>
                                <p className="mb-4 text-slate-600">Mulai tracking mood secara konsisten untuk melihat analytics yang meaningful</p>
                                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                    <Link href="/mood-tracker/create">
                                        <Heart className="mr-2 h-4 w-4" />
                                        Mulai Track Mood
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-4 text-center">
                                        <Calendar className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                                        <p className="text-2xl font-bold text-slate-800">{analytics.totalEntries}</p>
                                        <p className="text-sm text-slate-600">Total Entry</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-4 text-center">
                                        <Target className="mx-auto mb-2 h-6 w-6 text-green-500" />
                                        <p className="text-2xl font-bold text-slate-800">{analytics.currentStreak}</p>
                                        <p className="text-sm text-slate-600">Streak Saat Ini</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-4 text-center">
                                        <TrendingUp className="mx-auto mb-2 h-6 w-6 text-purple-500" />
                                        <p className="text-2xl font-bold text-slate-800">{analytics.averageIntensity}</p>
                                        <p className="text-sm text-slate-600">Rata-rata Intensitas</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-4 text-center">
                                        <Heart className="mx-auto mb-2 h-6 w-6 text-rose-500" />
                                        <p className="text-2xl font-bold text-slate-800">{analytics.moodScore}%</p>
                                        <p className="text-sm text-slate-600">Mood Score</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-3">
                                {/* Main Analytics */}
                                <div className="space-y-6 lg:col-span-2">
                                    {/* Mood Distribution */}
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                                <PieChart className="h-5 w-5 text-purple-500" />
                                                Distribusi Mood
                                            </CardTitle>
                                            <CardDescription>
                                                Persentase setiap mood dalam {getPeriodLabel(selectedPeriodState)} terakhir
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {Object.entries(analytics.moodDistribution).map(([mood, count]) => {
                                                    const config = moodConfig[mood as keyof typeof moodConfig];
                                                    const percentage = calculatePercentage(count, analytics.totalEntries);

                                                    return (
                                                        <div key={mood} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl">{config?.emoji || '😐'}</span>
                                                                    <div>
                                                                        <span className="font-medium text-slate-800">{config?.label || mood}</span>
                                                                        <p className="text-sm text-slate-600">{count} hari</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-lg font-bold text-slate-800">{percentage}%</span>
                                                                </div>
                                                            </div>
                                                            <div className="h-3 w-full rounded-full bg-slate-200">
                                                                <div
                                                                    className={`h-3 rounded-full transition-all duration-500 ${
                                                                        config?.chartColor || 'bg-slate-400'
                                                                    }`}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Weekly Trends */}
                                    {analytics.weeklyTrends.length > 0 && (
                                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                                    Tren Mingguan
                                                </CardTitle>
                                                <CardDescription>Perkembangan mood dari minggu ke minggu</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {analytics.weeklyTrends.map((week, index) => {
                                                        const weekTotal = Object.values(week)
                                                            .slice(1)
                                                            .reduce((a, b) => a + b, 0);
                                                        const dominantMood = Object.entries(week)
                                                            .slice(1)
                                                            .reduce((a, b) =>
                                                                week[a[0] as keyof typeof week] > week[b[0] as keyof typeof week] ? a : b,
                                                            )[0];

                                                        return (
                                                            <div key={index} className="space-y-2">
                                                                <h4 className="font-medium text-slate-800">{week.week}</h4>
                                                                <div className="flex h-8 gap-1">
                                                                    {Object.entries(week)
                                                                        .slice(1)
                                                                        .map(([mood, count]) => {
                                                                            const config = moodConfig[mood as keyof typeof moodConfig];
                                                                            const width = weekTotal > 0 ? (count / 7) * 100 : 0;

                                                                            return (
                                                                                <div
                                                                                    key={mood}
                                                                                    className={`flex items-center justify-center rounded text-xs font-medium text-white ${
                                                                                        config?.chartColor || 'bg-slate-400'
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${width}%`,
                                                                                        minWidth: count > 0 ? '20px' : '0',
                                                                                    }}
                                                                                    title={`${config?.label || mood}: ${count} hari`}
                                                                                >
                                                                                    {count > 0 && count}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                                <div className="flex justify-between text-xs text-slate-500">
                                                                    <span>Total: {weekTotal} hari</span>
                                                                    <span>
                                                                        Mood dominan:{' '}
                                                                        {moodConfig[dominantMood as keyof typeof moodConfig]?.label || dominantMood}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Top Triggers */}
                                    {analytics.topTriggers.length > 0 && (
                                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                                    <Zap className="h-5 w-5 text-yellow-500" />
                                                    Faktor Paling Berpengaruh
                                                </CardTitle>
                                                <CardDescription>Trigger yang paling sering mempengaruhi mood</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {analytics.topTriggers.map((trigger, index) => (
                                                        <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-800">{trigger.trigger}</p>
                                                                    <p className="text-sm text-slate-600">{trigger.count} kali disebutkan</p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="secondary"
                                                                className={
                                                                    trigger.impact === 'positive'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : trigger.impact === 'negative'
                                                                          ? 'bg-red-100 text-red-700'
                                                                          : 'bg-yellow-100 text-yellow-700'
                                                                }
                                                            >
                                                                {trigger.impact === 'positive'
                                                                    ? 'Positif'
                                                                    : trigger.impact === 'negative'
                                                                      ? 'Negatif'
                                                                      : 'Campuran'}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Mood Score */}
                                    <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
                                        <CardHeader className="text-center">
                                            <CardTitle className="text-slate-800">Mood Score</CardTitle>
                                            <CardDescription>Skor kesehatan mental keseluruhan</CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <div className="relative mx-auto mb-4 h-32 w-32">
                                                <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 36 36">
                                                    <path
                                                        className="text-slate-200"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        fill="none"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    />
                                                    <path
                                                        className="text-purple-500"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${analytics.moodScore}, 100`}
                                                        strokeLinecap="round"
                                                        fill="none"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-slate-800">{analytics.moodScore}%</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">{getMoodScoreDescription(analytics.moodScore)}</p>
                                        </CardContent>
                                    </Card>

                                    {/* Mood Patterns */}
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-slate-800">Pola Mood</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Hari terbaik</span>
                                                <Badge className="bg-green-100 text-green-700">{analytics.moodPatterns.bestDay}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Hari tersulit</span>
                                                <Badge className="bg-red-100 text-red-700">{analytics.moodPatterns.worstDay}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Waktu terbaik</span>
                                                <Badge className="bg-blue-100 text-blue-700">{analytics.moodPatterns.bestTime}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Mood umum</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-lg">
                                                        {moodConfig[analytics.moodPatterns.commonMood as keyof typeof moodConfig]?.emoji || '😐'}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {moodConfig[analytics.moodPatterns.commonMood as keyof typeof moodConfig]?.label || 'Biasa'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Achievements */}
                                    <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
                                        <CardContent className="p-4 text-center">
                                            <Award className="mx-auto mb-2 h-12 w-12 text-yellow-500" />
                                            <h3 className="mb-1 font-semibold text-slate-800">
                                                {analytics.longestStreak > 0 ? 'Streak Champion! 🏆' : 'Mood Tracker 📊'}
                                            </h3>
                                            <p className="mb-2 text-sm text-slate-600">Streak terpanjang: {analytics.longestStreak} hari</p>
                                            <p className="text-xs text-slate-500">
                                                {analytics.longestStreak > 7
                                                    ? 'Konsistensi tracking mood yang luar biasa!'
                                                    : 'Terus tingkatkan konsistensi tracking!'}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Insights */}
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                                <Sun className="h-5 w-5 text-yellow-500" />
                                                Insights
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {analytics.insights.map((insight, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                                                    <p className="text-sm text-slate-600">{insight}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Quick Actions */}
                                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                        <CardContent className="space-y-3 p-4">
                                            <Button
                                                asChild
                                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                            >
                                                <Link href="/mood-tracker/create">
                                                    <Heart className="mr-2 h-4 w-4" />
                                                    Catat Mood Hari Ini
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="w-full bg-transparent">
                                                <Link href="/journal/create">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Tulis Journal
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
