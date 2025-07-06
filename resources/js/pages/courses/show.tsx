import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Course, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award, BookOpen, CheckCircle, Clock, FileText, Heart, HelpCircle, Lock, Play, Star, Users, Video } from 'lucide-react';
import { useState } from 'react';

export default function CourseDetail({ course }: { course: Course }) {
    const [activeTab, setActiveTab] = useState('overview');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: 'Course Detail',
            href: `/courses/${course.slug}`,
        },
    ];

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'video':
                return Video;
            case 'text':
                return FileText;
            default:
                return BookOpen;
        }
    };

    // Mock data untuk informasi tambahan yang tidak ada di API
    const courseStats = {
        category: 'Soft Skills',
        level: 'Pemula',
        duration: `${course.modules.length * 15} menit`, // estimasi 15 menit per modul
        rating: 4.8,
        students: 890,
        progress: 0, // bisa diambil dari relasi user progress nanti
        completedModules: 0,
        instructor: {
            name: 'Speaker Pro',
            avatar: '/img/placeholder.svg',
            bio: 'Public speaking coach dengan 8+ tahun pengalaman melatih ratusan pembicara',
        },
        whatYouWillLearn: [
            'Mengatasi rasa gugup saat berbicara di depan umum',
            'Teknik dasar public speaking yang efektif',
            'Cara membangun kepercayaan diri',
            'Strategi menyampaikan pesan dengan jelas',
        ],
        tags: ['Public Speaking', 'Confidence', 'Communication', 'Presentation'],
    };

    console.log('Course Detail:', course);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${course.title} - Course Detail`} />
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Back Button */}
                    <Button asChild variant="ghost" className="mb-4">
                        <Link href="/courses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Course
                        </Link>
                    </Button>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Course Header */}
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <div className="relative">
                                    <img
                                        // src={course.thumbnail || '/img/placeholder.svg'}
                                        src="/img/placeholder.svg"
                                        alt={course.title}
                                        className="h-64 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <Button size="lg" className="bg-white/90 text-slate-800 hover:bg-white">
                                            <Play className="mr-2 h-5 w-5" />
                                            Preview Course
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <Badge className="bg-emerald-100 text-emerald-700">
                                                    <Heart className="mr-1 h-3 w-3" />
                                                    {courseStats.category}
                                                </Badge>
                                                <Badge variant="outline">{courseStats.level}</Badge>
                                            </div>
                                            <h1 className="mb-2 text-3xl font-bold text-slate-800">{course.title}</h1>
                                            <p className="leading-relaxed text-slate-600">{course.description}</p>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{courseStats.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{course.modules.length} modul</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{courseStats.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{courseStats.students} siswa</span>
                                            </div>
                                        </div>

                                        {courseStats.progress > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Progress Belajar</span>
                                                    <span className="font-medium text-slate-800">
                                                        {courseStats.completedModules}/{course.modules.length} modul ({courseStats.progress}%)
                                                    </span>
                                                </div>
                                                <Progress value={courseStats.progress} className="h-3" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tabs */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex space-x-1 rounded-lg bg-slate-100 p-1">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                                activeTab === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                                            }`}
                                        >
                                            Overview
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('modules')}
                                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                                activeTab === 'modules' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                                            }`}
                                        >
                                            Modul ({course.modules.length})
                                        </button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="mb-3 text-lg font-semibold text-slate-800">Yang Akan Kamu Pelajari</h3>
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {courseStats.whatYouWillLearn.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                                                            <span className="text-slate-700">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="mb-3 text-lg font-semibold text-slate-800">Tags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {courseStats.tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'modules' && (
                                        <div className="space-y-4">
                                            {course.modules.map((module, index) => {
                                                const ContentIcon = getContentIcon(module.content_type);
                                                const isCompleted = false; // nanti bisa diambil dari user progress
                                                const isLocked = false; // nanti bisa dikonfigurasi berdasarkan logic course
                                                const hasQuiz = false; // nanti bisa ditambahkan di model module
                                                const estimatedDuration = '15 menit'; // estimasi durasi per modul

                                                return (
                                                    <div
                                                        key={module.id}
                                                        className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                                                            isLocked
                                                                ? 'border-slate-200 bg-slate-50'
                                                                : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
                                                        }`}
                                                    >
                                                        <div className="flex-shrink-0">
                                                            {isCompleted ? (
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                                </div>
                                                            ) : isLocked ? (
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300">
                                                                    <Lock className="h-4 w-4 text-slate-500" />
                                                                </div>
                                                            ) : (
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600">
                                                                    {index + 1}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <ContentIcon className="h-4 w-4 text-slate-500" />
                                                                <h4 className="font-medium text-slate-800">{module.title}</h4>
                                                                {hasQuiz && <HelpCircle className="h-4 w-4 text-blue-500" />}
                                                            </div>
                                                            <p className="mb-1 text-sm text-slate-600">
                                                                {module.content_type === 'video' ? 'Video pembelajaran' : 'Artikel pembelajaran'}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{estimatedDuration}</span>
                                                                {hasQuiz && <span>• Quiz tersedia</span>}
                                                            </div>
                                                        </div>

                                                        <div className="flex-shrink-0">
                                                            {!isLocked && (
                                                                <Button
                                                                    asChild
                                                                    size="sm"
                                                                    variant={isCompleted ? 'outline' : 'default'}
                                                                    className={isCompleted ? '' : 'bg-emerald-500 hover:bg-emerald-600'}
                                                                >
                                                                    <Link href={`/courses/${course.slug}/modules/${module.slug}`}>
                                                                        {isCompleted ? 'Review' : 'Mulai'}
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Instructor */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Instruktur</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-3 flex items-center gap-3">
                                        <img
                                            // src={courseStats.instructor.avatar || '/img/placeholder.svg'}
                                            src="/img/placeholder.svg"
                                            alt={courseStats.instructor.name}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-medium text-slate-800">{courseStats.instructor.name}</h4>
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span>4.9 • Expert</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600">{courseStats.instructor.bio}</p>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardContent className="space-y-3 p-4">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                                    >
                                        <Link href={`/courses/${course.id}/modules/${course.modules[0]?.id || 1}`}>
                                            {courseStats.progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full bg-transparent">
                                        <Heart className="mr-2 h-4 w-4" />
                                        Simpan Course
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Achievement Preview */}
                            {courseStats.progress > 50 && (
                                <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
                                    <CardContent className="p-4 text-center">
                                        <Award className="mx-auto mb-2 h-12 w-12 text-yellow-500" />
                                        <h3 className="mb-1 font-semibold text-slate-800">Hampir Selesai! 🎉</h3>
                                        <p className="text-sm text-slate-600">
                                            Selesaikan {course.modules.length - courseStats.completedModules} modul lagi untuk mendapat sertifikat
                                        </p>
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
