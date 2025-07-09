import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

import { Assessment, SelfAssessmentCategory } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Award, Brain, ChevronRight, Clock, Heart, Moon, Search, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface RecentResult {
    id: number;
    title: string;
    score: number;
    category: string;
    date: string;
    color: string;
}

interface Stats {
    total: number;
    completed: number;
    averageScore: number;
    streak: string;
}

interface Props {
    assessments: Assessment[];
    categories: SelfAssessmentCategory[];
    recentResults: RecentResult[];
    stats: Stats;
}

const iconMap: Record<string, any> = {
    brain: Brain,
    heart: Heart,
    zap: Zap,
    moon: Moon,
    users: Users,
    award: Award,
};

export default function SelfAssessmentsPage({ assessments, categories, recentResults, stats }: Props) {
    console.log(recentResults);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mood Tracker', href: '/mood-tracker' },
    ];

    const icons = [
        { icon: 'brain', gradient: 'from-blue-500 to-purple-600' },
        { icon: 'heart', gradient: 'from-red-500 to-pink-600' },
        { icon: 'zap', gradient: 'from-yellow-500 to-orange-600' },
        { icon: 'moon', gradient: 'from-gray-500 to-blue-600' },
        { icon: 'users', gradient: 'from-green-500 to-teal-600' },
        { icon: 'award', gradient: 'from-orange-500 to-yellow-600' },
    ];

    const allCategories = [
        { id: 'all', label: 'Semua Tes', count: assessments.length },
        ...categories.map((cat) => ({
            id: cat.slug,
            label: cat.name,
            count: cat.self_assessments_count,
        })),
    ];

    const filteredAssessments = assessments.filter((assessment) => {
        const matchesSearch =
            assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assessment.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || assessment.category?.slug === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'mudah':
                return 'bg-green-100 text-green-800';
            case 'sedang':
                return 'bg-yellow-100 text-yellow-800';
            case 'sulit':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mood Tracker" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100">Total Tes</p>
                                        <p className="text-3xl font-bold">{stats.total}</p>
                                    </div>
                                    <Brain className="h-8 w-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100">Tes Selesai</p>
                                        <p className="text-3xl font-bold">{stats.completed}</p>
                                    </div>
                                    <Award className="h-8 w-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100">Rata-rata Skor</p>
                                        <p className="text-3xl font-bold">{stats.averageScore}</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100">Streak</p>
                                        <p className="text-3xl font-bold">{stats.streak}</p>
                                    </div>
                                    <Zap className="h-8 w-8 text-orange-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Search and Filter */}
                            <div className="mb-6">
                                <div className="relative mb-4">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Cari tes assessment..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                                        {allCategories.map((category) => (
                                            <TabsTrigger key={category.id} value={category.id} className="text-xs">
                                                {category.label}
                                                <Badge variant="secondary" className="ml-1 text-xs">
                                                    {category.count}
                                                </Badge>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Assessment Cards */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {filteredAssessments.map((assessment) => {
                                    const randomIconIndex = Math.floor(Math.random() * icons.length);
                                    const { icon: randomIconKey, gradient } = icons[randomIconIndex];
                                    const IconComponent = iconMap[randomIconKey] || Brain;

                                    console.log(assessment.category?.name);

                                    return (
                                        <Card key={assessment.id} className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
                                            <CardHeader className="pb-4">
                                                <div
                                                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${gradient}`}
                                                >
                                                    <IconComponent className="h-6 w-6 text-white" />
                                                </div>
                                                <CardTitle className="text-xl transition-colors group-hover:text-blue-600">
                                                    {assessment.title}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600">{assessment.description}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {assessment.tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{Math.floor(Math.random() * 11 + 5)} menit</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Brain className="h-4 w-4" />
                                                        <span>{assessment.questions} soal</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        {Math.floor(Math.random() * (300 - 50 + 1) + 50).toLocaleString()} orang
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                        <span>{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <Badge className={`${getDifficultyColor(assessment.difficulty)} capitalize`}>
                                                        {assessment.difficulty}
                                                    </Badge>
                                                    <Link href={`/self-assessments/${assessment.slug}`}>
                                                        <Button className="transition-colors group-hover:bg-blue-600">
                                                            Mulai Tes
                                                            <ChevronRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {filteredAssessments.length === 0 && (
                                <div className="py-12 text-center">
                                    <Brain className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                    <h3 className="mb-2 text-xl font-semibold text-gray-600">Tidak ada tes ditemukan</h3>
                                    <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <TrendingUp className="h-5 w-5" />
                                        Hasil Terbaru
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentResults.map((result) => (
                                        <div key={result.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                            <div>
                                                <p className="text-sm font-medium">{result.assessment.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(parseISO(result.created_at), { addSuffix: true, locale: id })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p>{result.score.toFixed(2)}</p>
                                                <p
                                                    className={`text-xs font-semibold ${
                                                        result.score < 4
                                                            ? 'text-green-600'
                                                            : result.score < 6
                                                              ? 'text-yellow-600'
                                                              : result.score < 8
                                                                ? 'text-orange-600'
                                                                : 'text-red-600'
                                                    }`}
                                                >
                                                    <span>
                                                        {result.score < 4
                                                            ? 'Baik'
                                                            : result.score < 6
                                                              ? 'Cukup Baik'
                                                              : result.score < 8
                                                                ? 'Perlu Perhatian'
                                                                : 'Perlu Konsultasi'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Link href="/self-assessments/history">
                                        <Button variant="outline" className="w-full bg-transparent">
                                            Lihat Semua Riwayat
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Heart className="h-5 w-5 text-red-500" />
                                        Tips Assessment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                        <p className="text-sm text-gray-700">Jawab dengan jujur sesuai kondisi Anda saat ini</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                        <p className="text-sm text-gray-700">Pilih waktu yang tenang untuk mengerjakan</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                        <p className="text-sm text-gray-700">Hasil tes bukan diagnosis medis</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                        <p className="text-sm text-gray-700">Konsultasi profesional jika diperlukan</p>
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
