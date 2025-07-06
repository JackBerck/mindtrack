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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Journal } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Edit, FileText, Frown, Heart, Meh, MoreHorizontal, Smile, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface RelatedJournal {
    id: number;
    title: string;
    slug: string;
    created_at: string;
}

interface Props {
    journal: Journal;
    relatedJournals?: RelatedJournal[];
}

const moodConfig = {
    happy: { icon: Smile, label: 'Bahagia', color: 'text-green-500 bg-green-50 border-green-200' },
    neutral: { icon: Meh, label: 'Biasa', color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
    sad: { icon: Frown, label: 'Sedih', color: 'text-blue-500 bg-blue-50 border-blue-200' },
    stressed: { icon: Frown, label: 'Stres', color: 'text-red-500 bg-red-50 border-red-200' },
    calm: { icon: Smile, label: 'Tenang', color: 'text-purple-500 bg-purple-50 border-purple-200' },
};

export default function JournalShow({ journal, relatedJournals = [] }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Journal', href: '/journal' },
        { title: journal.title, href: `/journal/${journal.slug}` },
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
        router.delete(`/journal/${journal.slug}`, {
            onSuccess: () => {
                // Will redirect to journals index
            },
            onError: (errors) => {
                console.error('Error deleting journal:', errors);
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const readingTime = Math.max(1, Math.ceil(journal.word_count / 200));
    const moodInfo = moodConfig[journal.mood as keyof typeof moodConfig];
    const MoodIcon = moodInfo?.icon || Meh;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={journal.title} />
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto space-y-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href="/journal">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Journal
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href={`/journal/${journal.slug}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Jurnal
                                    </Link>
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus Jurnal
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Jurnal?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tindakan ini tidak dapat dibatalkan. Jurnal akan dihapus secara permanen dari akun kamu.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
                                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="mb-3 text-2xl text-slate-800 md:text-3xl">{journal.title}</CardTitle>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(journal.created_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatTime(journal.created_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FileText className="h-4 w-4" />
                                                    <span>
                                                        {journal.word_count} kata • {readingTime} menit baca
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {moodInfo && (
                                            <Badge className={`ml-4 border ${moodInfo.color}`}>
                                                <MoodIcon className="mr-1 h-3 w-3" />
                                                {moodInfo.label}
                                            </Badge>
                                        )}
                                    </div>

                                    {journal.updated_at !== journal.created_at && (
                                        <CardDescription className="text-sm text-slate-500">
                                            Terakhir diedit: {formatDate(journal.updated_at)} pukul {formatTime(journal.updated_at)}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent>
                                    <div className="prose prose-slate max-w-none">
                                        <div className="text-base leading-relaxed whitespace-pre-line text-slate-700 md:text-lg">
                                            {journal.content}
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-slate-100 pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-slate-500">Jurnal pribadi • Hanya kamu yang bisa melihat ini</div>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm" className="bg-transparent">
                                                    <Link href={`/journal/${journal.slug}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
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
                                        <Link href={`/journal/${journal.slug}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Jurnal
                                        </Link>
                                    </Button>

                                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                                        <Link href="/journal/create">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Tulis Jurnal Baru
                                        </Link>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus Jurnal
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus Jurnal?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. Jurnal akan dihapus secara permanen dari akun kamu.
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

                            {/* Journal Stats */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Statistik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Jumlah kata</span>
                                        <span className="font-medium text-slate-800">{journal.word_count}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Waktu baca</span>
                                        <span className="font-medium text-slate-800">{readingTime} menit</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Mood</span>
                                        {moodInfo && (
                                            <Badge className={`border text-xs ${moodInfo.color}`}>
                                                <MoodIcon className="mr-1 h-3 w-3" />
                                                {moodInfo.label}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Privacy Notice */}
                            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-2">
                                        <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                                        <div>
                                            <h3 className="mb-1 font-medium text-blue-800">Ruang Aman</h3>
                                            <p className="text-sm text-blue-700">
                                                Jurnal ini bersifat pribadi dan hanya bisa diakses oleh kamu. Ekspresikan dirimu dengan bebas dan
                                                jujur.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Journals */}
                            {relatedJournals.length > 0 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-800">Jurnal Lainnya</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {relatedJournals.slice(0, 3).map((relatedJournal) => (
                                            <Link
                                                key={relatedJournal.id}
                                                href={`/journal/${relatedJournal.slug}`}
                                                className="block rounded-lg p-3 transition-colors hover:bg-slate-50"
                                            >
                                                <h4 className="mb-1 text-sm font-medium text-slate-800">{relatedJournal.title}</h4>
                                                <p className="text-xs text-slate-600">{formatDate(relatedJournal.created_at)}</p>
                                            </Link>
                                        ))}
                                        <Button asChild variant="ghost" size="sm" className="w-full">
                                            <Link href="/journal">Lihat Semua</Link>
                                        </Button>
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
