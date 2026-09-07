import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard,
  BookOpen,
  KeyRound,
  FileCheck2,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Award,
  Calendar,
  Clock,
  Bot,
  MessagesSquare,
  Megaphone,
  X,
  Settings,
  LogOut,
  Moon,
  Sun,
  Users,
  Video,
  BarChart3,
  Brain,
  HeartHandshake,
  UserCheck,
  Shield,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.84, 320);

interface NavLinkItem {
  id: string;
  label: string;
  screen: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

export const SidebarDrawer = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, opacityAnim]);

  const handleNavigate = (screenName: string, params?: any) => {
    closeSidebar();
    setTimeout(() => {
      navigation.navigate(screenName, params);
    }, 120);
  };

  const handleLogout = async () => {
    closeSidebar();
    await logout();
  };

  const userRole = user?.role || 'student';

  // 1. ONLY Student Pages
  const studentNavItems: NavLinkItem[] = [
    { id: 's-dash', label: 'Dashboard', screen: 'StudentDashboard', icon: LayoutDashboard },
    { id: 's-courses', label: 'My Courses', screen: 'StudentCourses', icon: BookOpen },
    { id: 's-join', label: 'Join with Code', screen: 'JoinCourse', icon: KeyRound },
    { id: 's-assign', label: 'Assignments', screen: 'StudentAssignments', icon: FileCheck2 },
    { id: 's-attend', label: 'Attendance & QR', screen: 'StudentAttendance', icon: CalendarCheck },
    { id: 's-exams', label: 'Exams & Quizzes', screen: 'StudentExams', icon: GraduationCap },
    { id: 's-mistakes', label: 'Mistakes Notebook', screen: 'StudentMistakes', icon: Brain },
    { id: 's-grades', label: 'Grades & Reports', screen: 'StudentGrades', icon: BarChart3 },
    { id: 's-schedule', label: 'Class Schedule', screen: 'StudentSchedule', icon: Clock },
    { id: 's-cal', label: 'Academic Calendar', screen: 'StudentCalendar', icon: Calendar },
    { id: 's-ai', label: 'AI Study Buddy', screen: 'AIStudyBuddy', icon: Bot },
    { id: 's-groups', label: 'Study Groups', screen: 'StudyGroups', icon: MessagesSquare },
    { id: 's-gam', label: 'Achievements & XP', screen: 'StudentGamification', icon: Award },
    { id: 's-ann', label: 'Announcements', screen: 'StudentAnnouncements', icon: Megaphone },
  ];

  // 2. ONLY Teacher Pages
  const teacherNavItems: NavLinkItem[] = [
    { id: 't-dash', label: 'Teacher Dashboard', screen: 'TeacherDashboard', icon: LayoutDashboard },
    { id: 't-courses', label: 'My Classes', screen: 'TeacherCourses', icon: BookOpen },
    { id: 't-assign', label: 'Assignments & Grading', screen: 'TeacherAssignments', icon: FileCheck2 },
    { id: 't-exams', label: 'Exams & Assessments', screen: 'TeacherExams', icon: GraduationCap },
    { id: 't-sess', label: 'Live Zoom Sessions', screen: 'TeacherSessions', icon: Video },
    { id: 't-stud', label: 'Students Roster', screen: 'TeacherStudents', icon: Users },
    { id: 't-cal', label: 'Teacher Calendar', screen: 'TeacherCalendar', icon: Calendar },
    { id: 't-reports', label: 'Report Cards', screen: 'TeacherReportCards', icon: BarChart3 },
    { id: 't-msg', label: 'Messages', screen: 'TeacherMessages', icon: MessagesSquare },
    { id: 't-analytics', label: 'Class Analytics', screen: 'TeacherAnalytics', icon: BarChart3 },
  ];

  // 3. ONLY Admin Pages
  const adminNavItems: NavLinkItem[] = [
    { id: 'a-dash', label: 'Admin Dashboard', screen: 'AdminDashboard', icon: LayoutDashboard },
    { id: 'a-users', label: 'Users Directory', screen: 'AdminUsers', icon: Users },
    { id: 'a-attend', label: 'Attendance Control', screen: 'AdminAttendance', icon: CalendarCheck },
    { id: 'a-links', label: 'Student-Parent Links', screen: 'AdminStudentParentLinks', icon: UserCheck },
    { id: 'a-reports', label: 'Reports & Audits', screen: 'AdminReports', icon: BarChart3 },
    { id: 'a-cal', label: 'Master Calendar', screen: 'AdminCalendar', icon: Calendar },
    { id: 'a-gam', label: 'Gamification Rules', screen: 'AdminGamification', icon: Award },
    { id: 'a-ann', label: 'Announcements', screen: 'AdminAnnouncements', icon: Megaphone },
  ];

  // 4. ONLY Parent Pages
  const parentNavItems: NavLinkItem[] = [
    { id: 'p-dash', label: 'Parent Dashboard', screen: 'ParentDashboard', icon: LayoutDashboard },
    { id: 'p-child', label: 'My Children', screen: 'ParentChildren', icon: HeartHandshake },
    { id: 'p-attend', label: 'Attendance Tracking', screen: 'ParentAttendance', icon: CalendarCheck },
    { id: 'p-courses', label: 'Enrolled Courses', screen: 'ParentCourses', icon: BookOpen },
    { id: 'p-reports', label: 'Grades & Report Cards', screen: 'ParentReports', icon: BarChart3 },
    { id: 'p-messages', label: 'Teacher Messages', screen: 'ParentMessages', icon: MessagesSquare },
  ];

  const getNavItemsForRole = () => {
    switch (userRole) {
      case 'teacher':
        return teacherNavItems;
      case 'admin':
        return adminNavItems;
      case 'parent':
        return parentNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItemsForRole();
  const displayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';

  const getRoleLabel = () => {
    switch (userRole) {
      case 'teacher':
        return 'INSTRUCTOR';
      case 'admin':
        return 'ADMINISTRATOR';
      case 'parent':
        return 'PARENT';
      default:
        return 'STUDENT';
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: opacityAnim,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: colors.card,
            borderRightColor: colors.cardBorder,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 12,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Drawer Header */}
        <View style={[styles.drawerHeader, { borderBottomColor: colors.divider }]}>
          <View style={styles.brandRow}>
            <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
              <GraduationCap size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: colors.text }]}>Acadize</Text>
              <Text style={[styles.brandSub, { color: colors.textMuted }]}>
                {getRoleLabel()} PORTAL
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.background }]}
            onPress={closeSidebar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarLetter}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textMuted }]} numberOfLines={1}>
              {user?.email || 'user@acadize.com'}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.roleText, { color: colors.primaryLight }]}>
                {getRoleLabel()}
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation List strictly for the logged-in role */}
        <ScrollView
          style={styles.navScrollView}
          contentContainerStyle={styles.navScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionHeading, { color: colors.textSubtle }]}>
            NAVIGATION
          </Text>

          {navItems.map((item) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  {
                    borderBottomColor: colors.divider + '30',
                  },
                ]}
                onPress={() => handleNavigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBox, { backgroundColor: colors.background }]}>
                  <IconComp size={18} color={colors.primaryLight} />
                </View>
                <Text style={[styles.navItemText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.drawerFooter, { borderTopColor: colors.divider, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={styles.footerBtn}
            onPress={() => handleNavigate('Settings')}
          >
            <Settings size={18} color={colors.textMuted} />
            <Text style={[styles.footerBtnText, { color: colors.text }]}>Server Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerBtn} onPress={toggleTheme}>
            {isDark ? (
              <Sun size={18} color="#FBBF24" />
            ) : (
              <Moon size={18} color={colors.textMuted} />
            )}
            <Text style={[styles.footerBtnText, { color: colors.text }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerBtn, { marginTop: 2 }]} onPress={handleLogout}>
            <LogOut size={18} color={colors.error} />
            <Text style={[styles.footerBtnText, { color: colors.error, fontWeight: '700' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 999,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    borderRightWidth: 1,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 4,
  },
  roleText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  navScrollView: {
    flex: 1,
    marginTop: 8,
  },
  navScrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginVertical: 8,
    paddingHorizontal: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  drawerFooter: {
    padding: 12,
    borderTopWidth: 1,
    gap: 6,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
