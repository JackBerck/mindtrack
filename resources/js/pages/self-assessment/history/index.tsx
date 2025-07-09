import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Brain, CalendarIcon, Eye, Filter, Minus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface AssessmentResult {
    id: number;
    assessment: {
        id: number;
        title: string;
        max_score?: number; // opsional, jika ingin menampilkan persentase
    };
    score: number;
    result: string;
    created_at: string;
    duration?: number;
    notes?: string;
    // Tambahkan field lain jika perlu
}

interface Props {
    results: {
        data: AssessmentResult[];
        // ...pagination jika ada
    };
}

export default function AssessmentHistoryPage({ results }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Self Assessments', href: '/self-assessments' },
        { title: 'Riwayat Assessment', href: '/self-assessments/history' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [sortBy, setSortBy] = useState('date-desc');

    // Dapatkan semua assessment type dari data
    const assessmentTypes = [
        { value: 'all', label: 'Semua Assessment' },
        ...Array.from(new Set(results.data.map((item) => item.assessment.id + '|' + item.assessment.title))).map((str) => {
            const [id, title] = str.split('|');
            return { value: id, label: title };
        }),
    ];

    // Filter data
    const filteredHistory = results.data
        .filter((item) => {
            const matchesSearch =
                item.assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.notes ?? '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'all' || item.assessment.id.toString() === selectedType;
            const matchesDateRange =
                !dateRange.from || !dateRange.to || (new Date(item.created_at) >= dateRange.from && new Date(item.created_at) <= dateRange.to);

            return matchesSearch && matchesType && matchesDateRange;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'date-asc':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'score-desc':
                    return b.score - a.score;
                case 'score-asc':
                    return a.score - b.score;
                case 'title':
                    return a.assessment.title.localeCompare(b.assessment.title);
                default:
                    return 0;
            }
        });

    // Statistik
    const totalAssessments = filteredHistory.length;
    const averageScore =
        filteredHistory.length > 0 ? Math.round(filteredHistory.reduce((sum, item) => sum + item.score, 0) / filteredHistory.length) : 0;
    const lastAssessment = filteredHistory[0];

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

    const getScorePercentage = (score: number, maxScore: number) => {
        return Math.round((score / maxScore) * 100);
    };

    console.log('Filtered History:', filteredHistory);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Assessment" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mx-auto">
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
                                            <p className="text-3xl font-bold">{averageScore}</p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-200" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100">Terakhir</p>
                                            <p className="text-lg font-bold">
                                                {lastAssessment ? format(new Date(lastAssessment.created_at), 'dd MMM', { locale: id }) : '-'}
                                            </p>
                                        </div>
                                        <CalendarIcon className="h-8 w-8 text-purple-200" />
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
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 sm:h-12 sm:w-12">
                                                    <Brain className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold sm:text-lg">{item.assessment.title}</h3>
                                                    <p className="text-xs text-gray-600 sm:text-sm">
                                                        {format(parseISO(item.created_at), 'd MMMM yyyy, HH:mm', { locale: id })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                                                <div className="text-right">
                                                    <div className="mb-1 flex items-center justify-end gap-1 sm:gap-2">
                                                        <span className="text-xl font-bold sm:text-2xl">{item.score.toFixed(2)}</span>
                                                        <span className="text-xs text-gray-500 sm:text-base">/ 10</span>
                                                        {getTrendIcon(item.score < 4 ? 'down' : item.score <= 6 ? 'stable' : 'up')}
                                                    </div>
                                                    <p
                                                        className={`text-xs font-semibold ${
                                                            item.score < 4
                                                                ? 'text-green-600'
                                                                : item.score < 6
                                                                  ? 'text-yellow-600'
                                                                  : item.score < 8
                                                                    ? 'text-orange-600'
                                                                    : 'text-red-600'
                                                        }`}
                                                    >
                                                        <span>
                                                            {item.score < 4
                                                                ? 'Baik'
                                                                : item.score < 6
                                                                  ? 'Cukup Baik'
                                                                  : item.score < 8
                                                                    ? 'Perlu Perhatian'
                                                                    : 'Perlu Konsultasi'}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="hidden justify-end gap-2 lg:flex">
                                                    <Link href={`/self-assessments/history/${item.id}`}>
                                                        <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                <span>Skor: {getScorePercentage(item.score, 10)}%</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span>Waktu: {Math.floor(Math.random() * 9) + 1} menit</span>
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
                                            <p className="text-xs text-gray-700 italic sm:text-sm">"{item.result}"</p>
                                        </div>

                                        <Link href={`/self-assessments/history/${item.id}`} className="mt-4 flex lg:hidden">
                                            <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                                <Eye className="mr-2 h-4 w-4" />
                                                Detail
                                            </Button>
                                        </Link>
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
        </AppLayout>
    );
}
