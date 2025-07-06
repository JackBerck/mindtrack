const mockCourse = {
    id: 1,
    title: 'Mengelola Stres Ringan',
    description:
        'Pelajari teknik-teknik sederhana untuk mengelola stres dalam kehidupan sehari-hari. Course ini dirancang khusus untuk remaja yang ingin belajar cara mengatasi tekanan dan menciptakan keseimbangan hidup yang lebih baik.',
    thumbnail: '/img/placeholder.svg',
    category: 'Mental Health',
    duration: '15 menit',
    totalModules: 4,
    rating: 4.8,
    students: 1520,
    level: 'Pemula',
    tags: ['Stres', 'Relaksasi', 'Mindfulness'],
    instructor: {
        name: 'Dr. Sarah Wellness',
        avatar: '/img/placeholder.svg',
        bio: 'Psikolog klinis dengan 10+ tahun pengalaman dalam terapi kesehatan mental remaja',
    },
    progress: 75,
    completedModules: 3,
    whatYouWillLearn: [
        'Memahami penyebab dan gejala stres',
        'Teknik pernapasan untuk menenangkan diri',
        'Strategi manajemen waktu yang efektif',
        'Cara membangun mindset positif',
    ],
};

const mockModules = [
    {
        id: 1,
        title: 'Apa Itu Stres?',
        description: 'Pengenalan dasar tentang stres dan dampaknya pada kehidupan sehari-hari',
        contentType: 'video',
        duration: '4 menit',
        isCompleted: true,
        isLocked: false,
        hasQuiz: false,
    },
    {
        id: 2,
        title: 'Teknik Pernapasan 4-7-8',
        description: 'Pelajari teknik pernapasan yang terbukti efektif untuk mengurangi stres',
        contentType: 'video',
        duration: '5 menit',
        isCompleted: true,
        isLocked: false,
        hasQuiz: true,
    },
    {
        id: 3,
        title: 'Mindfulness dalam Keseharian',
        description: 'Cara menerapkan mindfulness dalam aktivitas sehari-hari',
        contentType: 'text',
        duration: '3 menit',
        isCompleted: true,
        isLocked: false,
        hasQuiz: false,
    },
    {
        id: 4,
        title: 'Membangun Rutinitas Sehat',
        description: 'Strategi membangun rutinitas yang mendukung kesehatan mental',
        contentType: 'video',
        duration: '3 menit',
        isCompleted: false,
        isLocked: false,
        hasQuiz: true,
    },
];

export const mockCourseData = {
    course: mockCourse,
    modules: mockModules,
};
