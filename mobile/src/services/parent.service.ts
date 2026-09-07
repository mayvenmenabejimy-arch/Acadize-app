import { apiClient } from './apiClient';
import { endpoints } from '../config/api';

export interface ParentChild {
  id: string | number;
  name: string;
  fullName?: string;
  email?: string;
  grade?: string;
  gpa?: string;
  attendanceRate?: string;
  enrolledCourses?: string[];
  homeroomTeacher?: string;
  teacherEmail?: string;
}

export interface ParentOverviewData {
  children: ParentChild[];
  recentGrades?: {
    course: string;
    assessment: string;
    grade: string;
    date: string;
  }[];
  alerts?: {
    title: string;
    desc: string;
    urgent: boolean;
  }[];
}

export const parentService = {
  /**
   * Fetch complete dashboard overview for the parent
   */
  async getOverview(): Promise<ParentOverviewData | null> {
    try {
      const res = await apiClient.get<any>(endpoints.parentOverview(), true);
      const rawChildren = res?.children || [];
      const children: ParentChild[] = rawChildren.map((c: any) => ({
        id: c.id,
        name: c.fullName || c.name || 'Child',
        fullName: c.fullName || c.name,
        email: c.email,
        grade: c.grade || 'Standard Curriculum',
        gpa: c.gpa ? String(c.gpa) : '3.8',
        attendanceRate: c.attendanceRate ? `${c.attendanceRate}%` : '96%',
        enrolledCourses: Array.isArray(c.courses) ? c.courses.map((x: any) => x.title || x) : [],
        homeroomTeacher: c.teacher?.fullName || 'Faculty Lead',
        teacherEmail: c.teacher?.email,
      }));

      return {
        children,
        recentGrades: res?.recentGrades || [],
        alerts: res?.alerts || [],
      };
    } catch (error) {
      console.warn('Failed to fetch parent overview from database:', error);
      return null;
    }
  },

  /**
   * Fetch all children linked to parent
   */
  async getChildren(): Promise<ParentChild[]> {
    try {
      const res = await apiClient.get<any>(endpoints.parentChildren(), true);
      const list = res?.children || (Array.isArray(res) ? res : []);
      return list.map((c: any) => ({
        id: c.id,
        name: c.fullName || c.name || 'Child',
        fullName: c.fullName || c.name,
        email: c.email,
        grade: c.grade || 'Enrolled Student',
        gpa: c.gpa ? String(c.gpa) : '3.8',
        attendanceRate: c.attendanceRate ? `${c.attendanceRate}%` : '95%',
        enrolledCourses: Array.isArray(c.courses) ? c.courses.map((x: any) => x.title || x) : [],
        homeroomTeacher: c.teacher?.fullName,
        teacherEmail: c.teacher?.email,
      }));
    } catch (error) {
      console.warn('Failed to fetch parent children from database:', error);
      return [];
    }
  },

  /**
   * Fetch grades for a specific child
   */
  async getChildGrades(childId: string | number): Promise<any[]> {
    try {
      const res = await apiClient.get<any>(endpoints.parentChildGrades(childId), true);
      return Array.isArray(res) ? res : res?.grades || [];
    } catch (error) {
      console.warn('Failed to fetch child grades:', error);
      return [];
    }
  },

  /**
   * Fetch attendance records for a specific child
   */
  async getChildAttendance(childId: string | number): Promise<any[]> {
    try {
      const res = await apiClient.get<any>(endpoints.parentChildAttendance(childId), true);
      return Array.isArray(res) ? res : res?.attendance || [];
    } catch (error) {
      console.warn('Failed to fetch child attendance:', error);
      return [];
    }
  },
};
