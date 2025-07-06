const mockUser = {
    name: 'Sarah',
    totalCourses: 12,
    completedCourses: 4,
    currentStreak: 7,
    totalPoints: 850,
};

const mockRecentCourses = [
    {
        id: 1,
        title: 'Mengelola Stres Ringan',
        progress: 75,
        thumbnail: '/img/placeholder.svg',
        category: 'Mental Health',
        duration: '15 menit',
        modules: 4,
        completedModules: 3,
    },
    {
        id: 2,
        title: 'Teknik Komunikasi Efektif',
        progress: 30,
        thumbnail: '/img/placeholder.svg',
        category: 'Soft Skills',
        duration: '20 menit',
        modules: 5,
        completedModules: 1,
    },
];

const mockRecommendations = [
    {
        id: 3,
        title: 'Mindfulness untuk Pemula',
        thumbnail: '/img/placeholder.svg',
        category: 'Mental Health',
        duration: '12 menit',
        rating: 4.8,
        students: 1250,
    },
    {
        id: 4,
        title: 'Public Speaking Confidence',
        thumbnail: '/img/placeholder.svg',
        category: 'Soft Skills',
        duration: '18 menit',
        rating: 4.9,
        students: 890,
    },
];

const moodOptions = [
    { emoji: '😊', label: 'Bahagia', value: 'happy', color: 'text-green-500' },
    { emoji: '😐', label: 'Biasa', value: 'neutral', color: 'text-yellow-500' },
    { emoji: '😔', label: 'Sedih', value: 'sad', color: 'text-blue-500' },
    { emoji: '😰', label: 'Stres', value: 'stressed', color: 'text-red-500' },
    { emoji: '😌', label: 'Tenang', value: 'calm', color: 'text-purple-500' },
];

export const mockDashboardData = {
    user: mockUser,
    recentCourses: mockRecentCourses,
    recommendations: mockRecommendations,
    moodOptions: moodOptions,
};
