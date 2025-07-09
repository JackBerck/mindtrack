'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Brain, CalendarIcon, ChevronLeft, Download, Eye, Filter, Minus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

// Mock data untuk assessment history
const assessmentHistory = [
    {
        id: 1,
        assessmentId: 1,
        title: 'Tes Kecemasan',
        score: 15,
        maxScore: 25,
        category: 'Ringan',
        categoryColor: 'text-yellow-600',
        categoryBg: 'bg-yellow-100',
        takenAt: new Date('2024-01-15'),
        duration: 420, // seconds
        notes: 'Merasa sedikit cemas karena deadline kerja yang mendekat',
        trend: 'down', // compared to previous
    },
    {
        id: 2,
        assessmentId: 2,
        title: 'Tes Tingkat Stress',
        score: 22,
        maxScore: 30,
        category: 'Sedang',
        categoryColor: 'text-orange-600',
        categoryBg: 'bg-orange-100',
        takenAt: new Date('2024-01-08'),
        duration: 380,
        notes: 'Beban kerja yang cukup berat minggu ini',
        trend: 'up',
    },
    {
        id: 3,
        assessmentId: 3,
        title: 'Tes Kualitas Tidur',
        score: 8,
        maxScore: 20,
        category: 'Baik',
        categoryColor: 'text-green-600',
        categoryBg: 'bg-green-100',
        takenAt: new Date('2024-01-01'),
        duration: 300,
        notes: 'Tidur sudah mulai membaik setelah mengatur jadwal',
        trend: 'up',
    },
    {
        id: 4,
        assessmentId: 4,
        title: 'Tes Kesehatan Emosional',
        score: 18,
        maxScore: 24,
        category: 'Sedang',
        categoryColor: 'text-orange-600',
        categoryBg: 'bg-orange-100',
        takenAt: new Date('2023-12-25'),
        duration: 450,
        notes: 'Emosi masih naik turun, perlu lebih banyak self-care',
        trend: 'stable',
    },
    {
        id: 5,
        assessmentId: 1,
        title: 'Tes Kecemasan',
        score: 18,
        maxScore: 25,
        category: 'Sedang',
        categoryColor: 'text-orange-600',
        categoryBg: 'bg-orange-100',
        takenAt: new Date('2023-12-20'),
        duration: 390,
        notes: 'Periode ujian membuat tingkat kecemasan meningkat',
        trend: 'up',
    },
    {
        id: 6,
        assessmentId: 5,
        title: 'Tes Kepercayaan Diri',
        score: 14,
        maxScore: 20,
        category: 'Sedang',
        categoryColor: 'text-orange-600',
        categoryBg: 'bg-orange-100',
        takenAt: new Date('2023-12-15'),
        duration: 360,
        notes: 'Kepercayaan diri mulai membaik setelah presentasi berhasil',
        trend: 'up',
    },
];

const assessmentTypes = [
    { value: 'all', label: 'Semua Assessment' },
    { value: '1', label: 'Tes Kecemasan' },
    { value: '2', label: 'Tes Tingkat Stress' },
    { value: '3', label: 'Tes Kualitas Tidur' },
    { value: '4', label: 'Tes Kesehatan Emosional' },
    { value: '5', label: 'Tes Kepercayaan Diri' },
    { value: '6', label: 'Tes Hubungan Sosial' },
];

const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Minimal', label: 'Minimal' },
    { value: 'Ringan', label: 'Ringan' },
    { value: 'Sedang', label: 'Sedang' },
    { value: 'Tinggi', label: 'Tinggi' },
];

export default function AssessmentHistoryPage() {
    const router = { push: (url: string) => window.location.href = url };
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [sortBy, setSortBy] = useState('date-desc');

    const filteredHistory = assessmentHistory
        .filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.notes.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'all' || item.assessmentId.toString() === selectedType;
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesDateRange = !dateRange.from || !dateRange.to || (item.takenAt >= dateRange.from && item.takenAt <= dateRange.to);

            return matchesSearch && matchesType && matchesCategory && matchesDateRange;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return b.takenAt.getTime() - a.takenAt.getTime();
                case 'date-asc':
                    return a.takenAt.getTime() - b.takenAt.getTime();
                case 'score-desc':
                    return b.score - a.score;
                case 'score-asc':
                    return a.score - b.score;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-red-500" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-green-500" />;
            case 'stable':
                return <Minus className="h-4 w-4 text-gray-500" />;
            default:
                return null;
        }
    };

    const getTrendText = (trend: string) => {
        switch (trend) {
            case 'up':
                return 'Meningkat';
            case 'down':
                return 'Menurun';
            case 'stable':
                return 'Stabil';
            default:
                return '';
        }
    };

    const getScorePercentage = (score: number, maxScore: number) => {
        return Math.round((score / maxScore) * 100);
    };

    // Calculate statistics
    const totalAssessments = filteredHistory.length;
    const averageScore =
        filteredHistory.length > 0
            ? Math.round(filteredHistory.reduce((sum, item) => sum + getScorePercentage(item.score, item.maxScore), 0) / filteredHistory.length)
            : 0;
    const improvementTrend = filteredHistory.filter((item) => item.trend === 'down').length;
    const lastAssessment = filteredHistory[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Button variant="ghost" onClick={() => router.push('/self-assessments')} className="mb-4">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Kembali ke Assessment
                        </Button>

                        <div className="text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                                <Brain className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Riwayat Assessment</h1>
                            <p className="text-lg text-gray-600">Pantau perkembangan kesehatan mental Anda dari waktu ke waktu</p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100">Total Assessment</p>
                                        <p className="text-3xl font-bold">{totalAssessments}</p>
                                    </div>
                                    <Brain className="h-8 w-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100">Rata-rata Skor</p>
                                        <p className="text-3xl font-bold">{averageScore}%</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100">Perbaikan</p>
                                        <p className="text-3xl font-bold">{improvementTrend}</p>
                                    </div>
                                    <TrendingDown className="h-8 w-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100">Terakhir</p>
                                        <p className="text-lg font-bold">
                                            {lastAssessment ? format(lastAssessment.takenAt, 'dd MMM', { locale: id }) : '-'}
                                        </p>
                                    </div>
                                    <CalendarIcon className="h-8 w-8 text-orange-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filter & Pencarian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Cari assessment..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Jenis Assessment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assessmentTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategori Hasil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start bg-transparent">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange.from
                                                ? dateRange.to
                                                    ? `${format(dateRange.from, 'dd MMM', { locale: id })} - ${format(dateRange.to, 'dd MMM', { locale: id })}`
                                                    : format(dateRange.from, 'dd MMM yyyy', { locale: id })
                                                : 'Pilih tanggal'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={dateRange.from}
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Terbaru</SelectItem>
                                        <SelectItem value="date-asc">Terlama</SelectItem>
                                        <SelectItem value="score-desc">Skor Tertinggi</SelectItem>
                                        <SelectItem value="score-asc">Skor Terendah</SelectItem>
                                        <SelectItem value="title">Nama A-Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History List */}
                    <div className="space-y-4">
                        {filteredHistory.map((item) => (
                            <Card key={item.id} className="transition-shadow hover:shadow-lg">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                                                <Brain className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                                <p className="text-sm text-gray-600">{format(item.takenAt, 'dd MMMM yyyy, HH:mm', { locale: id })}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="text-2xl font-bold">{item.score}</span>
                                                    <span className="text-gray-500">/ {item.maxScore}</span>
                                                    {getTrendIcon(item.trend)}
                                                </div>
                                                <Badge className={`${item.categoryColor} ${item.categoryBg} border-0`}>{item.category}</Badge>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link href={`/self-assessments/history/${item.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Detail
                                                    </Button>
                                                </Link>
                                                <Button size="sm" variant="outline">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            <span>Skor: {getScorePercentage(item.score, item.maxScore)}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span>Waktu: {formatTime(item.duration)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                            <span>Trend: {getTrendText(item.trend)}</span>
                                        </div>
                                    </div>

                                    {item.notes && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-sm text-gray-700 italic">"{item.notes}"</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredHistory.length === 0 && (
                        <div className="py-12 text-center">
                            <Brain className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                            <h3 className="mb-2 text-xl font-semibold text-gray-600">Tidak ada riwayat ditemukan</h3>
                            <p className="mb-4 text-gray-500">Coba ubah filter atau mulai assessment pertama Anda</p>
                            <Link href="/self-assessments">
                                <Button>Mulai Assessment</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
