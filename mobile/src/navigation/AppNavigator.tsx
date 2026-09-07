import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SidebarProvider } from '../context/SidebarContext';
import { SidebarDrawer } from '../components/SidebarDrawer';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Role Tab Navigators
import { MainTabNavigator } from './MainTabNavigator'; // Student tabs
import { TeacherTabNavigator } from './TeacherTabNavigator'; // Teacher tabs
import { AdminTabNavigator } from './AdminTabNavigator'; // Admin tabs
import { ParentTabNavigator } from './ParentTabNavigator'; // Parent tabs

// Common / Learning Screens
import { CourseListScreen } from '../screens/courses/CourseListScreen';
import { CourseDetailScreen } from '../screens/courses/CourseDetailScreen';
import { LessonViewerScreen } from '../screens/courses/LessonViewerScreen';
import { JoinCourseScreen } from '../screens/courses/JoinCourseScreen';
import { AIStudyBuddyScreen } from '../screens/ai/AIStudyBuddyScreen';

// Student Portal Screens
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { StudentAssignmentsScreen } from '../screens/student/StudentAssignmentsScreen';
import { StudentAttendanceScreen } from '../screens/student/StudentAttendanceScreen';
import { StudentExamsScreen } from '../screens/student/StudentExamsScreen';
import { StudentMistakesScreen } from '../screens/student/StudentMistakesScreen';
import { StudentGradesScreen } from '../screens/student/StudentGradesScreen';
import { StudentScheduleScreen } from '../screens/student/StudentScheduleScreen';
import { StudentCalendarScreen } from '../screens/student/StudentCalendarScreen';
import { StudentGamificationScreen } from '../screens/student/StudentGamificationScreen';
import { StudentAnnouncementsScreen } from '../screens/student/StudentAnnouncementsScreen';
import { StudyGroupsScreen } from '../screens/student/StudyGroupsScreen';

// Teacher Portal Screens
import { TeacherDashboardScreen } from '../screens/teacher/TeacherDashboardScreen';
import { TeacherCoursesScreen } from '../screens/teacher/TeacherCoursesScreen';
import { TeacherAssignmentsScreen } from '../screens/teacher/TeacherAssignmentsScreen';
import { TeacherSessionsScreen } from '../screens/teacher/TeacherSessionsScreen';
import { TeacherStudentsScreen } from '../screens/teacher/TeacherStudentsScreen';
import { TeacherAnalyticsScreen } from '../screens/teacher/TeacherAnalyticsScreen';

// Admin Portal Screens
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminReportsScreen } from '../screens/admin/AdminReportsScreen';
import { AdminGamificationScreen } from '../screens/admin/AdminGamificationScreen';

// Parent Portal Screens
import { ParentDashboardScreen } from '../screens/parent/ParentDashboardScreen';
import { ParentChildrenScreen } from '../screens/parent/ParentChildrenScreen';
import { ParentReportsScreen } from '../screens/parent/ParentReportsScreen';

// Shared Utilities & Settings
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const role = user?.role || 'student';

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // Unauthenticated Stack
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      ) : (
        // Authenticated Stack Strictly Gated by User Role
        <SidebarProvider>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
              }}
            >
              {/* 1. Root Tab Navigator based on Logged-in User Role */}
              {role === 'teacher' && (
                <Stack.Screen name="TeacherTabs" component={TeacherTabNavigator} />
              )}
              {role === 'admin' && (
                <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
              )}
              {role === 'parent' && (
                <Stack.Screen name="ParentTabs" component={ParentTabNavigator} />
              )}
              {role === 'student' && (
                <Stack.Screen name="StudentTabs" component={MainTabNavigator} />
              )}
              {/* Fallback if role is unfamiliar */}
              {role !== 'teacher' && role !== 'admin' && role !== 'parent' && role !== 'student' && (
                <Stack.Screen name="DefaultTabs" component={MainTabNavigator} />
              )}

              {/* 2. Role-Specific Sub-Screens */}
              {role === 'student' && (
                <>
                  <Stack.Screen name="StudentDashboard" component={DashboardScreen} />
                  <Stack.Screen name="StudentCourses" component={CourseListScreen} />
                  <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
                  <Stack.Screen name="LessonViewer" component={LessonViewerScreen} />
                  <Stack.Screen name="JoinCourse" component={JoinCourseScreen} />
                  <Stack.Screen name="StudentAssignments" component={StudentAssignmentsScreen} />
                  <Stack.Screen name="StudentAttendance" component={StudentAttendanceScreen} />
                  <Stack.Screen name="StudentExams" component={StudentExamsScreen} />
                  <Stack.Screen name="StudentMistakes" component={StudentMistakesScreen} />
                  <Stack.Screen name="StudentGrades" component={StudentGradesScreen} />
                  <Stack.Screen name="StudentSchedule" component={StudentScheduleScreen} />
                  <Stack.Screen name="StudentCalendar" component={StudentCalendarScreen} />
                  <Stack.Screen name="StudentGamification" component={StudentGamificationScreen} />
                  <Stack.Screen name="StudentAnnouncements" component={StudentAnnouncementsScreen} />
                  <Stack.Screen name="StudyGroups" component={StudyGroupsScreen} />
                  <Stack.Screen name="AIStudyBuddy" component={AIStudyBuddyScreen} />
                </>
              )}

              {role === 'teacher' && (
                <>
                  <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
                  <Stack.Screen name="TeacherCourses" component={TeacherCoursesScreen} />
                  <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
                  <Stack.Screen name="LessonViewer" component={LessonViewerScreen} />
                  <Stack.Screen name="TeacherAssignments" component={TeacherAssignmentsScreen} />
                  <Stack.Screen name="TeacherExams" component={StudentExamsScreen} />
                  <Stack.Screen name="TeacherSessions" component={TeacherSessionsScreen} />
                  <Stack.Screen name="TeacherStudents" component={TeacherStudentsScreen} />
                  <Stack.Screen name="TeacherCalendar" component={StudentCalendarScreen} />
                  <Stack.Screen name="TeacherReportCards" component={StudentGradesScreen} />
                  <Stack.Screen name="TeacherMessages" component={StudyGroupsScreen} />
                  <Stack.Screen name="TeacherAnalytics" component={TeacherAnalyticsScreen} />
                </>
              )}

              {role === 'admin' && (
                <>
                  <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                  <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
                  <Stack.Screen name="AdminAttendance" component={StudentAttendanceScreen} />
                  <Stack.Screen name="AdminStudentParentLinks" component={ParentChildrenScreen} />
                  <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
                  <Stack.Screen name="AdminCalendar" component={StudentCalendarScreen} />
                  <Stack.Screen name="AdminGamification" component={AdminGamificationScreen} />
                  <Stack.Screen name="AdminAnnouncements" component={StudentAnnouncementsScreen} />
                </>
              )}

              {role === 'parent' && (
                <>
                  <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
                  <Stack.Screen name="ParentChildren" component={ParentChildrenScreen} />
                  <Stack.Screen name="ParentAttendance" component={StudentAttendanceScreen} />
                  <Stack.Screen name="ParentCourses" component={CourseListScreen} />
                  <Stack.Screen name="ParentReports" component={ParentReportsScreen} />
                  <Stack.Screen name="ParentMessages" component={StudyGroupsScreen} />
                </>
              )}

              {/* Shared Screens for All Logged-in Users */}
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>

            {/* Global Slide-out Drawer strictly presenting logged-in user's role */}
            <SidebarDrawer />
          </View>
        </SidebarProvider>
      )}
    </NavigationContainer>
  );
};
