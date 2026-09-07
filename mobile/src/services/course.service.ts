import { apiClient } from './apiClient';
import { endpoints } from '../config/api';

export interface Lesson {
  id: string | number;
  title: string;
  description?: string;
  content?: string;
  durationMinutes?: number;
  orderIndex?: number;
  videoUrl?: string;
  pdfUrl?: string;
  isCompleted?: boolean;
}

export interface Course {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  price?: number;
  instructorName?: string;
  teacherName?: string;
  totalLessons?: number;
  lessons?: Lesson[];
  isEnrolled?: boolean;
  progressPercent?: number;
}

export const courseService = {
  async getPublishedCourses(): Promise<Course[]> {
    try {
      const res = await apiClient.get<any>(endpoints.courses(), false);
      // Backend returns either { data: [...] } or array directly
      return Array.isArray(res) ? res : res.data || [];
    } catch (error) {
      console.warn('Failed to fetch courses from server, returning fallback sample data:', error);
      // Fallback demo courses if offline or backend requires specific tenant
      return [
        {
          id: 'course-1',
          title: 'Advanced Mathematics & Calculus',
          description: 'Master differential calculus, limits, and integral theory with real-world problem sets.',
          category: 'Mathematics',
          level: 'High School',
          price: 250,
          instructorName: 'Dr. Sarah Connor',
          totalLessons: 12,
          progressPercent: 45,
          thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
        },
        {
          id: 'course-2',
          title: 'Introduction to Computer Science & Python',
          description: 'Learn programming fundamentals, data structures, algorithms, and build your first apps.',
          category: 'Computer Science',
          level: 'Beginner',
          price: 350,
          instructorName: 'Eng. Omar Farooq',
          totalLessons: 16,
          progressPercent: 10,
          thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
        },
        {
          id: 'course-3',
          title: 'Physics: Mechanics & Wave Dynamics',
          description: 'Explore classical mechanics, Newton’s laws, kinetic energy, and oscillation theories.',
          category: 'Science',
          level: 'Intermediate',
          price: 300,
          instructorName: 'Prof. Youssef Mahmoud',
          totalLessons: 10,
          progressPercent: 0,
          thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
        }
      ];
    }
  },

  async getUserCourses(): Promise<Course[]> {
    try {
      const res = await apiClient.get<any>(endpoints.userCourses(), true);
      return Array.isArray(res) ? res : res.data || [];
    } catch {
      return [];
    }
  },

  async getCourseById(id: string | number): Promise<Course> {
    try {
      return await apiClient.get<Course>(endpoints.courseDetails(id), false);
    } catch {
      const all = await this.getPublishedCourses();
      return all.find(c => c.id.toString() === id.toString()) || all[0];
    }
  },

  async getCourseLessons(courseId: string | number): Promise<Lesson[]> {
    try {
      const res = await apiClient.get<any>(endpoints.courseLessons(courseId), true);
      return Array.isArray(res) ? res : res.data || [];
    } catch {
      return [
        {
          id: 'lesson-1',
          title: 'Module 1: Foundations & Core Concepts',
          description: 'Introduction to core principles, prerequisites, and syllabus breakdown.',
          durationMinutes: 45,
          orderIndex: 1,
          isCompleted: true,
        },
        {
          id: 'lesson-2',
          title: 'Module 2: Practical Problem Solving & Lab',
          description: 'Step-by-step worked exercises and practical applications.',
          durationMinutes: 60,
          orderIndex: 2,
          isCompleted: false,
        },
        {
          id: 'lesson-3',
          title: 'Module 3: Review & Summary Quiz',
          description: 'Self-assessment quiz and key takeaways for the examination.',
          durationMinutes: 30,
          orderIndex: 3,
          isCompleted: false,
        }
      ];
    }
  }
};
