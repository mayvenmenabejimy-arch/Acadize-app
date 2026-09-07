import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTenantSubdomain } from '../config/api';

const TOKEN_KEY = '@acadize_auth_token';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers: customHeaders, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-tenant-subdomain': getTenantSubdomain(),
  };

  if (requiresAuth) {
    const token = await getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Merge any custom headers
  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    let json: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    } else {
      const text = await response.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = { text };
      }
    }

    if (!response.ok) {
      const errorMessage = json?.message || json?.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, json);
    }

    return json as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or offline
    throw new ApiError(
      error.message || 'Unable to connect to Acadize server. Please check your internet connection.',
      0
    );
  }
}

export const apiClient = {
  get: <T = any>(url: string, requiresAuth = false) =>
    request<T>(url, { method: 'GET', requiresAuth }),

  post: <T = any>(url: string, body?: any, requiresAuth = false) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    }),

  put: <T = any>(url: string, body?: any, requiresAuth = false) =>
    request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    }),

  patch: <T = any>(url: string, body?: any, requiresAuth = false) =>
    request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    }),

  delete: <T = any>(url: string, requiresAuth = false) =>
    request<T>(url, { method: 'DELETE', requiresAuth }),
};
