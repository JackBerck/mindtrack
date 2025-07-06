import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Brain, Clock, Filter, Heart, Search, Star, Users, Zap } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Courses',
        href: '/courses',
    },
];

// Mock data - in real app, this would come from props
const mockCourses = [
    {
        id: 1,
        title: 'Mengelola Stres Ringan',
        description: 'Pelajari teknik-teknik sederhana untuk mengelola stres dalam kehidupan sehari-hari',
        thumbnail: '/img/placeholder.svg',
        category: 'Mental Health',
        duration: '15 menit',
        modules: 4,
        rating: 4.8,
        students: 1520,
        level: 'Pemula',
        tags: ['Stres', 'Relaksasi', 'Mindfulness'],
        instructor: 'Dr. Sarah Wellness',
        progress: 75,
    },
    {
        id: 2,
        title: 'Teknik Komunikasi Efektif',
        description: 'Tingkatkan kemampuan komunikasi untuk hubungan yang lebih baik',
        thumbnail: '/img/placeholder.svg',
        category: 'Soft Skills',
        duration: '20 menit',
        modules: 5,
        rating: 4.9,
        students: 2100,
        level: 'Menengah',
        tags: ['Komunikasi', 'Leadership', 'Interpersonal'],
        instructor: 'Prof. Ahmad Komunikasi',
        progress: 30,
    },
    {
        id: 3,
        title: 'Mindfulness untuk Pemula',
        description: 'Kenali dan praktikkan mindfulness untuk kehidupan yang lebih tenang',
        thumbnail: '/img/placeholder.svg',
        category: 'Mental Health',
        duration: '12 menit',
        modules: 3,
        rating: 4.8,
        students: 1250,
        level: 'Pemula',
        tags: ['Mindfulness', 'Meditasi', 'Kesadaran'],
        instructor: 'Mindful Maya',
        progress: 0,
    },
    {
        id: 4,
        title: 'Public Speaking Confidence',
        description: 'Bangun kepercayaan diri untuk berbicara di depan umum',
        thumbnail: '/img/placeholder.svg',
        category: 'Soft Skills',
        duration: '18 menit',
        modules: 4,
        rating: 4.9,
        students: 890,
        level: 'Menengah',
        tags: ['Public Speaking', 'Confidence', 'Presentation'],
        instructor: 'Speaker Pro',
        progress: 0,
    },
    {
        id: 5,
        title: 'Manajemen Waktu Produktif',
        description: 'Optimalkan waktu dan tingkatkan produktivitas harian',
        thumbnail: '/img/placeholder.svg',
        category: 'Productivity',
        duration: '25 menit',
        modules: 6,
        rating: 4.7,
        students: 1800,
        level: 'Menengah',
        tags: ['Time Management', 'Productivity', 'Planning'],
        instructor: 'Productive Pete',
        progress: 0,
    },
    {
        id: 6,
        title: 'Emotional Intelligence',
        description: 'Kembangkan kecerdasan emosional untuk hubungan yang lebih baik',
        thumbnail: '/img/placeholder.svg',
        category: 'Mental Health',
        duration: '22 menit',
        modules: 5,
        rating: 4.8,
        students: 1350,
        level: 'Lanjutan',
        tags: ['EQ', 'Emotions', 'Self-Awareness'],
        instructor: 'Dr. Emotional Expert',
        progress: 0,
    },
];

const categories = [
    { name: 'Semua', icon: BookOpen, count: mockCourses.length },
    { name: 'Mental Health', icon: Heart, count: 3 },
    { name: 'Soft Skills', icon: Brain, count: 2 },
    { name: 'Productivity', icon: Zap, count: 1 },
];

export default function CoursesIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [filteredCourses, setFilteredCourses] = useState(mockCourses);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        filterCourses(term, selectedCategory);
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        filterCourses(searchTerm, category);
    };

    const filterCourses = (search: string, category: string) => {
        let filtered = mockCourses;

        if (category !== 'Semua') {
            filtered = filtered.filter((course) => course.category === category);
        }

        if (search) {
            filtered = filtered.filter(
                (course) =>
                    course.title.toLowerCase().includes(search.toLowerCase()) ||
                    course.description.toLowerCase().includes(search.toLowerCase()) ||
                    course.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
            );
        }

        setFilteredCourses(filtered);
    };

    const getCategoryIcon = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category ? category.icon : BookOpen;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="text-center md:text-left">
                        <h1 className="mb-2 text-3xl font-bold text-slate-800 md:text-4xl">Jelajahi Course 📚</h1>
                        <p className="text-slate-600">Temukan course yang tepat untuk mengembangkan diri</p>
                    </div>

                    {/* Search and Filter */}
                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Cari course, topik, atau skill..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="border-slate-200 pl-10 focus:border-blue-400 focus:ring-blue-400"
                                    />
                                </div>
                                <Button variant="outline" className="bg-transparent md:w-auto">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Categories Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Kategori</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {categories.map((category) => {
                                        const IconComponent = category.icon;
                                        return (
                                            <button
                                                key={category.name}
                                                onClick={() => handleCategoryFilter(category.name)}
                                                className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                                                    selectedCategory === category.name
                                                        ? 'border border-blue-200 bg-blue-100 text-blue-700'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <IconComponent className="h-4 w-4" />
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {category.count}
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Courses Grid */}
                        <div className="lg:col-span-3">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-slate-600">
                                    Menampilkan {filteredCourses.length} course
                                    {selectedCategory !== 'Semua' && ` dalam kategori ${selectedCategory}`}
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {filteredCourses.map((course) => {
                                    const IconComponent = getCategoryIcon(course.category);
                                    return (
                                        <Card
                                            key={course.id}
                                            className="group overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={course.thumbnail || '/placeholder.svg'}
                                                    alt={course.title}
                                                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {course.progress > 0 && (
                                                    <div className="absolute top-3 right-3">
                                                        <Badge className="bg-green-500 text-white">{course.progress}% selesai</Badge>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="secondary" className="bg-white/90">
                                                        <IconComponent className="mr-1 h-3 w-3" />
                                                        {course.category}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardContent className="p-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="mb-1 line-clamp-2 font-semibold text-slate-800">{course.title}</h3>
                                                        <p className="line-clamp-2 text-sm text-slate-600">{course.description}</p>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{course.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="h-3 w-3" />
                                                            <span>{course.modules} modul</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-sm font-medium">{course.rating}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                                <Users className="h-3 w-3" />
                                                                <span>{course.students}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {course.level}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1">
                                                        {course.tags.slice(0, 2).map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {course.tags.length > 2 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{course.tags.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <Button
                                                        asChild
                                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                                    >
                                                        <Link href={`/courses/${course.id}`}>{course.progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'}</Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {filteredCourses.length === 0 && (
                                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-12 text-center">
                                        <BookOpen className="mx-auto mb-4 h-16 w-16 text-slate-400" />
                                        <h3 className="mb-2 text-xl font-semibold text-slate-800">Tidak ada course ditemukan</h3>
                                        <p className="mb-4 text-slate-600">Coba ubah kata kunci pencarian atau filter kategori</p>
                                        <Button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCategory('Semua');
                                                setFilteredCourses(mockCourses);
                                            }}
                                            variant="outline"
                                        >
                                            Reset Filter
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
