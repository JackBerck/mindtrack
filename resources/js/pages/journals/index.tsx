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
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Journal } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    FileText,
    Filter,
    Frown,
    Heart,
    Meh,
    MoreHorizontal,
    Plus,
    Search,
    Smile,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaginatedJournals {
    data: Journal[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total_journals: number;
    writing_streak: number;
    happy_percentage: number;
    total_words: number;
}

interface Filters {
    search: string;
    mood: string;
}

interface Props {
    journals: PaginatedJournals;
    stats: Stats;
    filters: Filters;
}

const moodConfig = {
    happy: { icon: Smile, label: 'Bahagia', color: 'text-green-500 bg-green-50 border-green-200' },
    neutral: { icon: Meh, label: 'Biasa', color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
    sad: { icon: Frown, label: 'Sedih', color: 'text-blue-500 bg-blue-50 border-blue-200' },
    stressed: { icon: Frown, label: 'Stres', color: 'text-red-500 bg-red-50 border-red-200' },
    calm: { icon: Smile, label: 'Tenang', color: 'text-purple-500 bg-purple-50 border-purple-200' },
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Journal', href: '/journal' },
];

export default function JournalIndex({ journals, stats, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [selectedMood, setSelectedMood] = useState(filters.mood);
    const [deletingJournalSlug, setDeletingJournalSlug] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter(searchTerm, selectedMood);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilter = (search: string, mood: string) => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (mood) params.mood = mood;

        router.get('/journal', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleMoodFilter = (mood: string | null) => {
        setSelectedMood(mood || '');
        handleFilter(searchTerm, mood || '');
    };

    const handleDelete = (journalSlug: string) => {
        setIsDeleting(true);
        router.delete(`/journal/${journalSlug}`, {
            onSuccess: () => {
                setDeletingJournalSlug(null);
                // Notification handled by flash message
            },
            onError: (errors) => {
                console.error('Error deleting journal:', errors);
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

    const getExcerpt = (content: string, maxLength = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getReadingTime = (wordCount: number) => {
        return Math.max(1, Math.ceil(wordCount / 200));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Journal" />
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center md:text-left">
                        <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-slate-800 md:text-4xl">
                            <BookOpen className="h-8 w-8 text-rose-500" />
                            My Journal 📝
                        </h1>
                        <p className="text-slate-600">Ruang personal untuk refleksi diri dan catatan harian</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <FileText className="mx-auto mb-2 h-6 w-6 text-rose-500" />
                                <p className="text-2xl font-bold text-slate-800">{stats.total_journals}</p>
                                <p className="text-sm text-slate-600">Total Jurnal</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <Calendar className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                                <p className="text-2xl font-bold text-slate-800">{stats.writing_streak}</p>
                                <p className="text-sm text-slate-600">Hari Berturut</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <Heart className="mx-auto mb-2 h-6 w-6 text-green-500" />
                                <p className="text-2xl font-bold text-slate-800">{stats.happy_percentage}%</p>
                                <p className="text-sm text-slate-600">Hari Bahagia</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <Edit className="mx-auto mb-2 h-6 w-6 text-purple-500" />
                                <p className="text-2xl font-bold text-slate-800">{stats.total_words}</p>
                                <p className="text-sm text-slate-600">Total Kata</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Cari jurnal berdasarkan judul atau isi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-slate-200 pl-10 focus:border-rose-400 focus:ring-rose-400"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="bg-transparent">
                                                <Filter className="mr-2 h-4 w-4" />
                                                {selectedMood ? moodConfig[selectedMood as keyof typeof moodConfig].label : 'Semua Mood'}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleMoodFilter(null)}>Semua Mood</DropdownMenuItem>
                                            {Object.entries(moodConfig).map(([mood, config]) => {
                                                const IconComponent = config.icon;
                                                return (
                                                    <DropdownMenuItem key={mood} onClick={() => handleMoodFilter(mood)}>
                                                        <IconComponent className="mr-2 h-4 w-4" />
                                                        {config.label}
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                                        <Link href="/journal/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tulis Jurnal
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Journal List */}
                    <div className="space-y-4">
                        {journals.data.length === 0 ? (
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <BookOpen className="mx-auto mb-4 h-16 w-16 text-slate-400" />
                                    <h3 className="mb-2 text-xl font-semibold text-slate-800">
                                        {searchTerm || selectedMood ? 'Tidak ada jurnal ditemukan' : 'Belum ada jurnal'}
                                    </h3>
                                    <p className="mb-4 text-slate-600">
                                        {searchTerm || selectedMood
                                            ? 'Coba ubah kata kunci pencarian atau filter mood'
                                            : 'Mulai menulis jurnal pertamamu untuk merekam perjalanan hidupmu'}
                                    </p>
                                    {!searchTerm && !selectedMood && (
                                        <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                                            <Link href="/journal/create">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tulis Jurnal Pertama
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            journals.data.map((journal) => {
                                const moodInfo = moodConfig[journal.mood as keyof typeof moodConfig];
                                const MoodIcon = moodInfo?.icon || Meh;

                                return (
                                    <Card
                                        key={journal.id}
                                        className="group border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                                    >
                                        <CardContent className="p-6">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <Link href={`/journals/${journal.slug}`}>
                                                        <h3 className="mb-2 cursor-pointer text-xl font-semibold text-slate-800 transition-colors group-hover:text-rose-600">
                                                            {journal.title}
                                                        </h3>
                                                    </Link>
                                                    <div className="mb-3 flex items-center gap-4 text-sm text-slate-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(journal.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{getReadingTime(journal.word_count)} menit baca</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="h-4 w-4" />
                                                            <span>{journal.word_count} kata</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex items-center gap-2">
                                                    {moodInfo && (
                                                        <Badge className={`border ${moodInfo.color}`}>
                                                            <MoodIcon className="mr-1 h-3 w-3" />
                                                            {moodInfo.label}
                                                        </Badge>
                                                    )}

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/journals/${journal.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        onSelect={(e) => e.preventDefault()}
                                                                        className="text-red-600 focus:text-red-600"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Hapus
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Hapus Jurnal?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Apakah kamu yakin ingin menghapus jurnal "{journal.title}"? Tindakan ini
                                                                            tidak dapat dibatalkan dan jurnal akan dihapus secara permanen.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(journal.slug)}
                                                                            className="bg-red-500 hover:bg-red-600"
                                                                            disabled={isDeleting}
                                                                        >
                                                                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            <Link href={`/journals/${journal.slug}`}>
                                                <p className="cursor-pointer leading-relaxed text-slate-700 transition-colors group-hover:text-slate-800">
                                                    {getExcerpt(journal.content)}
                                                </p>
                                            </Link>

                                            <div className="mt-4 border-t border-slate-100 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-slate-500">
                                                        {journal.updated_at !== journal.created_at && 'Diedit • '}
                                                        {formatDate(journal.updated_at)}
                                                    </div>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                    >
                                                        <Link href={`/journals/${journal.slug}`}>Baca Selengkapnya →</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {journals.data.length > 0 && journals.last_page > 1 && (
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-600">
                                        Menampilkan {journals.from} sampai {journals.to} dari {journals.total} jurnal
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {journals.links.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <Button key={index} variant="ghost" size="sm" disabled className="cursor-not-allowed opacity-50">
                                                        {link.label === '&laquo; Previous' ? (
                                                            <ChevronLeft className="h-4 w-4" />
                                                        ) : link.label === 'Next &raquo;' ? (
                                                            <ChevronRight className="h-4 w-4" />
                                                        ) : (
                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                        )}
                                                    </Button>
                                                );
                                            }

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'ghost'}
                                                    size="sm"
                                                    asChild
                                                    className={link.active ? 'bg-rose-500 hover:bg-rose-600' : ''}
                                                >
                                                    <Link href={link.url} preserveState preserveScroll>
                                                        {link.label === '&laquo; Previous' ? (
                                                            <ChevronLeft className="h-4 w-4" />
                                                        ) : link.label === 'Next &raquo;' ? (
                                                            <ChevronRight className="h-4 w-4" />
                                                        ) : (
                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                        )}
                                                    </Link>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
