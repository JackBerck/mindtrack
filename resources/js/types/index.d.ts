import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    mood_trackers: MoodTracker[];
    user_courses?: Course[];
    userBadgesWithProgress?: UserBadgeWithProgress[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Course {
    id: number;
    title: string;
    description: string;
    slug: string;
    thumbnail: string;
    tags: string[]; // Store tags as an array
    what_you_will_learn: string[]; // Store learning outcomes as an array
    time_to_complete: number; // Time in minutes
    course_category_id: number; // Foreign key to the course category
    level: string; // e.g., beginner, intermediate, advanced
    created_at: string;
    updated_at: string;
    modules: Module[];
}

export interface Module {
    id: number;
    title: string;
    slug: string;
    content_type: string;
    content_url: string;
    course_id: number;
    created_at: string;
    updated_at: string;
    quizzes: Quiz[];
    // lessons?: Lesson[];
}

export interface Quiz {
    id: number;
    question: string;
    option_a: string; // Option A
    option_b: string; // Option B
    option_c: string; // Option C
    option_d: string; // Option D
    correct_answer: string; // Store the correct answer
    module_id: number; // Foreign key to the module
}

export interface MoodTracker {
    id: number;
    mood: string; // e.g., happy, sad, neutral
    note: string; // Optional note
    tracked_at: string; // Date and time of the mood tracking
    created_at: string;
    updated_at: string;
    user_id: number; // Foreign key to the user
}

export interface Journal {
    id: number;
    title: string;
    slug: string;
    content: string;
    mood: string;
    word_count: number;
    created_at: string;
    updated_at: string;
}

export interface Assessment {
    id: number;
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    tags: string[];
    category: SelfAssessmentCategory;
    icon: string;
    color: string;
    gradient: string;
    duration: string;
    questions: number;
    completions: number;
    rating: number;

}

export interface SelfAssessmentCategory {
    id: number;
    name: string;
    slug: string;
    self_assessments_count?: number;
}

interface RecentResult {
    id: number;
    result: string;
    score: number;
    taken_at: string;
    user_id: number;
    assessment_id: number;
    created_at: string;
    updated_at: string;
    assessment: Assessment;
}
