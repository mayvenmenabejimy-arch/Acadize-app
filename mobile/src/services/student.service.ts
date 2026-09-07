import { apiClient } from './apiClient';
import { endpoints } from '../config/api';

export interface AttendanceRecordItem {
  id: string;
  sessionId: string;
  sessionTitle?: string;
  sessionType?: string;
  courseId?: string;
  courseTitle?: string;
  sessionStart?: string;
  sessionEnd?: string;
  joinTime?: string;
  status: 'present' | 'late' | 'absent';
  attendancePercent?: number;
}

export interface StudentAssignmentItem {
  id: string;
  courseId: string;
  courseTitle?: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxScore?: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number | null;
  feedback?: string | null;
  submittedAt?: string | null;
}

export interface StudentAnnouncementItem {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
  createdAt: string;
  author?: string;
  courseName?: string;
}

export const studentService = {
  /**
   * Fetch authenticated student's attendance history
   */
  async getAttendanceHistory(): Promise<{
    records: AttendanceRecordItem[];
    stats: {
      overallRate: string;
      presentCount: number;
      lateCount: number;
      absentCount: number;
      total: number;
    };
  }> {
    try {
      const records = await apiClient.get<AttendanceRecordItem[]>(
        endpoints.studentAttendance(),
        true
      );
      const list = Array.isArray(records) ? records : [];

      const presentCount = list.filter((r) => r.status === 'present').length;
      const lateCount = list.filter((r) => r.status === 'late').length;
      const absentCount = list.filter((r) => r.status === 'absent').length;
      const total = list.length;
      const rate = total > 0 ? Math.round(((presentCount + lateCount * 0.5) / total) * 100) : 100;

      return {
        records: list,
        stats: {
          overallRate: `${rate}%`,
          presentCount,
          lateCount,
          absentCount,
          total,
        },
      };
    } catch (error) {
      console.warn('Failed to fetch student attendance:', error);
      return {
        records: [],
        stats: {
          overallRate: '100%',
          presentCount: 0,
          lateCount: 0,
          absentCount: 0,
          total: 0,
        },
      };
    }
  },

  /**
   * Check in with classroom QR Code token
   */
  async scanQr(qrToken: string): Promise<{ success: boolean; message: string; sessionTitle?: string }> {
    try {
      const res = await apiClient.post<any>(
        endpoints.scanAttendance(),
        {
          qrToken,
          clientTimestamp: new Date().toISOString(),
        },
        true
      );
      return {
        success: true,
        message: 'Successfully checked into class session!',
        sessionTitle: res?.session?.title || 'Class Session',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Failed to check in. Token may be expired or invalid.',
      };
    }
  },

  /**
   * Fetch student's assignments across enrolled courses
   */
  async getAssignments(): Promise<StudentAssignmentItem[]> {
    try {
      const res = await apiClient.get<any>(endpoints.studentAssignments(), true);
      const items = res?.data || (Array.isArray(res) ? res : []);
      return items.map((a: any) => ({
        id: String(a.id),
        courseId: String(a.courseId),
        courseTitle: a.courseTitle || 'Course',
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        maxScore: a.maxScore || 100,
        status: a.status || 'pending',
        grade: a.grade,
        feedback: a.feedback,
        submittedAt: a.submittedAt,
      }));
    } catch (error) {
      console.warn('Failed to fetch student assignments:', error);
      return [];
    }
  },

  /**
   * Fetch platform and course announcements
   */
  async getAnnouncements(): Promise<StudentAnnouncementItem[]> {
    try {
      const res = await apiClient.get<any>(endpoints.announcements(), true);
      const items = res?.announcements || (Array.isArray(res) ? res : []);
      return items.map((ann: any) => ({
        id: String(ann.id),
        title: ann.title,
        content: ann.content,
        isPinned: Boolean(ann.isPinned),
        createdAt: ann.createdAt || new Date().toISOString(),
        author: ann.author || 'Instructor',
        courseName: ann.courseName,
      }));
    } catch (error) {
      console.warn('Failed to fetch announcements:', error);
      return [];
    }
  },
};
