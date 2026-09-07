import { apiClient } from './apiClient';
import { endpoints } from '../config/api';

export interface TeacherCourse {
  id: string;
  title: string;
  description?: string;
  code?: string;
  isPublished?: boolean;
  studentsCount?: number;
  lessonsCount?: number;
  thumbnail?: string;
  createdAt?: string;
}

export interface TeacherAssignment {
  id: string;
  courseId: string;
  courseTitle?: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxScore?: number;
  submissionsCount?: number;
  pendingGradingCount?: number;
  isPublished?: boolean;
}

export interface TeacherExam {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  duration?: number;
  totalPoints?: number;
  passingScore?: number;
  status?: string;
  stats?: {
    totalAttempts: number;
    completedAttempts: number;
    inProgressAttempts: number;
    flaggedAttempts: number;
    averageScore: number | null;
  };
}

export const teacherService = {
  /**
   * Fetch courses belonging to the authenticated teacher
   */
  async getMyCourses(): Promise<TeacherCourse[]> {
    try {
      const res = await apiClient.get<any>(endpoints.teacherCourses(), true);
      const courses = res?.data || (Array.isArray(res) ? res : []);
      return courses.map((c: any) => ({
        id: String(c.id),
        title: c.title || 'Untitled Course',
        description: c.description || '',
        code: c.code || `COURSE-${c.id}`,
        isPublished: c.isPublished ?? true,
        studentsCount: c.enrollmentCount || c.studentsCount || 0,
        lessonsCount: c.lessonsCount || 0,
        thumbnail: c.thumbnail,
        createdAt: c.createdAt,
      }));
    } catch (error) {
      console.warn('Failed to fetch teacher courses from live backend:', error);
      return [];
    }
  },

  /**
   * Fetch assignments for teacher's courses
   */
  async getMyAssignments(): Promise<TeacherAssignment[]> {
    try {
      const res = await apiClient.get<any>(endpoints.teacherAssignments(), true);
      const items = res?.data || (Array.isArray(res) ? res : []);
      return items.map((a: any) => ({
        id: String(a.id),
        courseId: String(a.courseId),
        courseTitle: a.courseTitle || 'Active Course',
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        maxScore: a.maxScore || 100,
        submissionsCount: a.submissionCount || 0,
        pendingGradingCount: a.pendingCount || 0,
        isPublished: a.isPublished ?? true,
      }));
    } catch (error) {
      console.warn('Failed to fetch teacher assignments:', error);
      return [];
    }
  },

  /**
   * Fetch exams created by the teacher
   */
  async getMyExams(): Promise<TeacherExam[]> {
    try {
      const res = await apiClient.get<any>(endpoints.teacherExams(), true);
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.warn('Failed to fetch teacher exams:', error);
      return [];
    }
  },

  /**
   * Fetch scheduled sessions
   */
  async getSessions(): Promise<any[]> {
    try {
      const res = await apiClient.get<any>(endpoints.teacherSessions(), true);
      return Array.isArray(res) ? res : res?.sessions || [];
    } catch (error) {
      console.warn('Failed to fetch sessions:', error);
      return [];
    }
  },
};
