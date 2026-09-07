import { apiClient } from './apiClient';
import { endpoints } from '../config/api';

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  recentSignups: number;
  pendingReports: number;
}

export interface UserStats {
  students: number;
  teachers: number;
  parents: number;
  admins: number;
  newUsersThisWeek: number;
  activeToday: number;
}

export interface AdminUserRecord {
  id: string | number;
  username: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin' | 'parent';
  isActive: boolean;
  status?: string;
  createdAt: string;
  lastLogin?: string;
  profilePicture?: string;
}

export interface PointRule {
  id: string;
  eventType: string;
  points: number;
  isActive?: boolean;
  isEnabled?: boolean;
  description?: string;
  updatedAt?: string;
}

export interface PlatformAnalytics {
  userGrowth?: {
    month: string;
    students: number;
    teachers: number;
    parents: number;
    total: number;
  }[];
  recentActivity?: {
    assignments: number;
    submissions: number;
    announcements: number;
  };
  courseStats?: {
    published: number;
    totalEnrollments: number;
  };
}

export interface ModerationReport {
  id: string;
  reason: string;
  context?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  reporter?: {
    fullName: string;
    email: string;
  };
  reportedUser?: {
    fullName: string;
    email: string;
  };
}

export const adminService = {
  /**
   * Fetch live system overview statistics from the database
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      return await apiClient.get<SystemStats>(endpoints.adminStats(), true);
    } catch (error) {
      console.warn('Failed to fetch admin stats from live server, fallback:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        recentSignups: 0,
        pendingReports: 0,
      };
    }
  },

  /**
   * Fetch user statistics grouped by role from the database
   */
  async getUserStats(): Promise<UserStats> {
    try {
      return await apiClient.get<UserStats>(endpoints.adminUserStats(), true);
    } catch (error) {
      console.warn('Failed to fetch admin user stats from live server, fallback:', error);
      return {
        students: 0,
        teachers: 0,
        parents: 0,
        admins: 0,
        newUsersThisWeek: 0,
        activeToday: 0,
      };
    }
  },

  /**
   * Fetch all users from the database with optional filtering
   */
  async getAllUsers(params?: {
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: AdminUserRecord[]; total: number }> {
    try {
      const queryParts: string[] = [];
      if (params?.role && params.role !== 'all') queryParts.push(`role=${encodeURIComponent(params.role)}`);
      if (params?.status && params.status !== 'all') queryParts.push(`status=${encodeURIComponent(params.status)}`);
      if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.limit) queryParts.push(`limit=${params.limit}`);
      if (params?.offset) queryParts.push(`offset=${params.offset}`);

      const queryString = queryParts.join('&');
      const response = await apiClient.get<any>(endpoints.adminUsers(queryString), true);
      const rawUsers = response?.users || (Array.isArray(response) ? response : []);
      
      const users: AdminUserRecord[] = rawUsers.map((u: any) => ({
        id: u.id,
        username: u.username || u.email?.split('@')[0] || 'user',
        email: u.email,
        fullName: u.fullName || u.name || u.username || 'Unnamed User',
        role: u.role || 'student',
        isActive: u.isActive !== undefined ? u.isActive : true,
        status: u.status || (u.isActive ? 'Active' : 'Inactive'),
        createdAt: u.createdAt || new Date().toISOString(),
        lastLogin: u.lastLogin,
        profilePicture: u.profilePicture,
      }));

      return { users, total: response?.total || users.length };
    } catch (error) {
      console.warn('Failed to fetch users from database:', error);
      return { users: [], total: 0 };
    }
  },

  /**
   * Create a new user in the database
   */
  async createUser(data: {
    username?: string;
    email: string;
    fullName: string;
    role: 'student' | 'teacher' | 'admin' | 'parent';
    password?: string;
  }): Promise<any> {
    return await apiClient.post(
      endpoints.adminUsers(),
      {
        ...data,
        username: data.username || data.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
        password: data.password || 'TemporaryPass123!',
      },
      true
    );
  },

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: string | number, isActive: boolean): Promise<any> {
    return await apiClient.patch(endpoints.adminUserStatus(id), { isActive }, true);
  },

  /**
   * Fetch gamification rules from the database
   */
  async getGamificationRules(): Promise<PointRule[]> {
    try {
      const res = await apiClient.get<any>(endpoints.adminGamificationRules(), true);
      return Array.isArray(res) ? res : res?.rules || [];
    } catch (error) {
      console.warn('Failed to fetch gamification rules:', error);
      return [];
    }
  },

  /**
   * Update gamification point rules
   */
  async updateGamificationRules(rules: { eventType: string; points: number; isActive?: boolean }[]): Promise<any> {
    return await apiClient.put(
      endpoints.adminGamificationRules(),
      {
        rules: rules.map(r => ({
          eventType: r.eventType,
          points: Number(r.points),
          isActive: r.isActive !== undefined ? r.isActive : true,
        })),
      },
      true
    );
  },

  /**
   * Fetch moderation reports
   */
  async getReports(status = 'pending'): Promise<ModerationReport[]> {
    try {
      const res = await apiClient.get<any>(endpoints.adminReports(status), true);
      return Array.isArray(res) ? res : res?.reports || [];
    } catch (error) {
      console.warn('Failed to fetch moderation reports:', error);
      return [];
    }
  },

  /**
   * Fetch platform analytics
   */
  async getAnalytics(): Promise<PlatformAnalytics | null> {
    try {
      return await apiClient.get<PlatformAnalytics>(endpoints.adminAnalytics(), true);
    } catch (error) {
      console.warn('Failed to fetch platform analytics:', error);
      return null;
    }
  },
};
