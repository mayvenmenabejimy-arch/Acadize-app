import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { CourseListScreen } from '../screens/courses/CourseListScreen';
import { AIStudyBuddyScreen } from '../screens/ai/AIStudyBuddyScreen';
import { StudentAssignmentsScreen } from '../screens/student/StudentAssignmentsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Home, BookOpen, Bot, FileCheck2, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
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
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="Courses"
        component={CourseListScreen}
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color, size }) => <BookOpen size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="AIBuddy"
        component={AIStudyBuddyScreen}
        options={{
          tabBarLabel: 'AI Buddy',
          tabBarIcon: ({ color, size }) => <Bot size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="AssignmentsTab"
        component={StudentAssignmentsScreen}
        options={{
          tabBarLabel: 'Assignments',
          tabBarIcon: ({ color, size }) => <FileCheck2 size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
