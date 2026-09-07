import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  inputBackground: string;
  inputBorder: string;
  divider: string;
}

const darkColors: ThemeColors = {
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#06B6D4', // Cyan
  accent: '#EC4899', // Pink
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  background: '#0B1120', // Dark Navy matching Acadize
  card: '#1E293B', // Slate 800
  cardBorder: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSubtle: '#64748B',
  inputBackground: '#0F172A',
  inputBorder: '#334155',
  divider: '#1E293B',
};

const lightColors: ThemeColors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#6366F1',
  secondary: '#0891B2',
  accent: '#DB2777',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#475569',
  textSubtle: '#94A3B8',
  inputBackground: '#F1F5F9',
  inputBorder: '#CBD5E1',
  divider: '#E2E8F0',
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: darkColors,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(prev => !prev);
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
