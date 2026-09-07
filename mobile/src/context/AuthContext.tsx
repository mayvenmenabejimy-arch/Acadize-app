import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, authService } from '../services/auth.service';
import { getStoredToken, clearStoredToken } from '../services/apiClient';
import { initApiConfig } from '../config/api';

const USER_STORAGE_KEY = '@acadize_user_profile';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authentication state on app launch
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initApiConfig();
        const storedToken = await getStoredToken();
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Optionally fetch fresh profile in background
          try {
            const freshUser = await authService.getProfile();
            if (freshUser) {
              setUser(freshUser);
              await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
            }
          } catch {
            // Keep using cached user if offline or network error
          }
        }
      } catch (error) {
        console.warn('Failed to restore auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      setToken(res.token);
      setUser(res.user);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; role?: string }) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // Auto-login after successful registration
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      await clearStoredToken();
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
