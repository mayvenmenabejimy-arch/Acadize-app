import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { TeacherDashboardScreen } from '../screens/teacher/TeacherDashboardScreen';
import { TeacherCoursesScreen } from '../screens/teacher/TeacherCoursesScreen';
import { TeacherAssignmentsScreen } from '../screens/teacher/TeacherAssignmentsScreen';
import { TeacherSessionsScreen } from '../screens/teacher/TeacherSessionsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { LayoutDashboard, BookOpen, FileCheck2, Video, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const TeacherTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="TeacherHome"
        component={TeacherDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="TeacherClasses"
        component={TeacherCoursesScreen}
        options={{
          tabBarLabel: 'Classes',
          tabBarIcon: ({ color, size }) => <BookOpen size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="TeacherGrading"
        component={TeacherAssignmentsScreen}
        options={{
          tabBarLabel: 'Grading',
          tabBarIcon: ({ color, size }) => <FileCheck2 size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="TeacherLive"
        component={TeacherSessionsScreen}
        options={{
          tabBarLabel: 'Live Sessions',
          tabBarIcon: ({ color, size }) => <Video size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="TeacherProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
