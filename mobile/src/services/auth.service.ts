import { apiClient, setStoredToken, clearStoredToken } from './apiClient';
import { endpoints } from '../config/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  username?: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  organizationId?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  message?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(endpoints.login(), {
      email,
      username: email,
      password,
    });

    if (response.token) {
      await setStoredToken(response.token);
    }

    return response;
  },

  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    username?: string;
  }): Promise<{ message: string; user: User }> {
    return await apiClient.post(endpoints.register(), {
      ...data,
      role: data.role || 'student',
    });
  },

  async getProfile(): Promise<User> {
    return await apiClient.get<User>(endpoints.me(), true);
  },

  async logout(): Promise<void> {
    await clearStoredToken();
  },
};
