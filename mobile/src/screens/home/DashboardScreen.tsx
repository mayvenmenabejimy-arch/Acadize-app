import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';
import { courseService, Course } from '../../services/course.service';
import { notificationService } from '../../services/notification.service';
import {
  Flame,
  BookOpen,
  Sparkles,
  KeyRound,
  Bot,
  Video,
  Megaphone,
  Bell,
  Menu,
  FileCheck2,
  CalendarCheck,
  GraduationCap,
  Brain,
  Award,
  ChevronRight,
  Clock,
  Play,
  GraduationCap as LogoIcon,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { openSidebar } = useSidebar();

  const [courses, setCourses] = useState<Course[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [courseList, count] = await Promise.all([
        courseService.getPublishedCourses(),
        notificationService.getUnreadCount(),
      ]);
      setCourses(courseList);
      setUnreadCount(count);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const displayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Student';

  // Quick Action Items for Mobile
  const quickActions = [
    {
      id: 'qa-code',
      title: 'Join Code',
      icon: KeyRound,
      color: '#6366F1',
      action: () => navigation.navigate('JoinCourse'),
    },
    {
      id: 'qa-ai',
      title: 'AI Buddy',
      icon: Bot,
      color: '#F59E0B',
      action: () => navigation.navigate('MainTabs', { screen: 'AIBuddy' }),
    },
    {
      id: 'qa-assign',
      title: 'Assignments',
      icon: FileCheck2,
      color: '#10B981',
      action: () => navigation.navigate('StudentAssignments'),
    },
    {
      id: 'qa-attend',
      title: 'Attendance',
      icon: CalendarCheck,
      color: '#EC4899',
      action: () => navigation.navigate('StudentAttendance'),
    },
    {
      id: 'qa-exams',
      title: 'Exams',
      icon: GraduationCap,
      color: '#EF4444',
      action: () => navigation.navigate('StudentExams'),
    },
    {
      id: 'qa-mistakes',
      title: 'Mistakes',
      icon: Brain,
      color: '#8B5CF6',
      action: () => navigation.navigate('StudentMistakes'),
    },
    {
      id: 'qa-sched',
      title: 'Schedule',
      icon: Clock,
      color: '#06B6D4',
      action: () => navigation.navigate('StudentSchedule'),
    },
    {
      id: 'qa-xp',
      title: 'Badges & XP',
      icon: Award,
      color: '#D97706',
      action: () => navigation.navigate('StudentGamification'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 1. Mobile-Optimized Fixed Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
            onPress={openSidebar}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Menu size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.brandGroup}>
            <View style={[styles.miniLogo, { backgroundColor: colors.primary }]}>
              <LogoIcon size={16} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>Acadize</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.text} />
            {unreadCount > 0 && (
              <View style={[styles.badgeCircle, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeCount}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.avatarButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarLetter}>{displayName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Scrollable Body Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeBox}>
          <Text style={[styles.welcomeGreeting, { color: colors.textMuted }]}>
            Welcome back 👋
          </Text>
          <Text style={[styles.welcomeName, { color: colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.textSubtle }]}>
            Here is your daily study overview and schedule
          </Text>
        </View>

        {/* Gamification & Streak Banner */}
        <View style={[styles.gamCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.gamItem}>
            <View style={[styles.gamIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Flame size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gamNum, { color: colors.text }]}>5 Days</Text>
              <Text style={[styles.gamLabel, { color: colors.textMuted }]}>Study Streak</Text>
            </View>
          </View>

          <View style={[styles.gamDivider, { backgroundColor: colors.divider }]} />

          <View style={styles.gamItem}>
            <View style={[styles.gamIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Sparkles size={20} color="#4F46E5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gamNum, { color: colors.text }]}>340 XP</Text>
              <Text style={[styles.gamLabel, { color: colors.textMuted }]}>Level 3 Scholar</Text>
            </View>
          </View>
        </View>

        {/* Next Live Session Card */}
        <View style={[styles.liveCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.liveCardTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE SESSION TODAY</Text>
            </View>
            <Text style={[styles.liveTime, { color: colors.textMuted }]}>4:00 PM</Text>
          </View>

          <Text style={[styles.liveTitle, { color: colors.text }]}>
            Advanced Calculus: Derivatives & Q&A
          </Text>

          <View style={styles.liveFooter}>
            <Text style={[styles.liveInstructor, { color: colors.textMuted }]}>
              With Dr. Sarah Connor • Zoom
            </Text>
            <TouchableOpacity
              style={[styles.joinLiveBtn, { backgroundColor: colors.primary }]}
              onPress={() => alert('Launching Zoom session room...')}
            >
              <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.joinLiveBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Grid - Mobile 4-Column Layout */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((qa) => {
            const IconComponent = qa.icon;
            return (
              <TouchableOpacity
                key={qa.id}
                style={[
                  styles.actionTile,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}
                onPress={qa.action}
                activeOpacity={0.7}
              >
                <View style={[styles.tileIconBox, { backgroundColor: qa.color + '18' }]}>
                  <IconComponent size={20} color={qa.color} />
                </View>
                <Text style={[styles.tileText, { color: colors.text }]} numberOfLines={1}>
                  {qa.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Enrolled Courses & Progress Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Courses' })}>
            <Text style={[styles.seeAllText, { color: colors.primaryLight }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coursesList}>
          {courses.length > 0 ? (
            courses.slice(0, 3).map((course, idx) => {
              const progressPct = idx === 0 ? 65 : idx === 1 ? 40 : 15;
              return (
                <TouchableOpacity
                  key={course.id}
                  style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                  onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.courseTop}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>
                        {course.title}
                      </Text>
                      <Text style={[styles.courseInstructor, { color: colors.textMuted }]}>
                        {course.instructorName || course.teacherName || 'Acadize Faculty'}
                      </Text>
                    </View>

                    <View style={[styles.progressPill, { backgroundColor: colors.primary + '18' }]}>
                      <Text style={[styles.progressPillText, { color: colors.primaryLight }]}>
                        {progressPct}%
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.background }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${progressPct}%`, backgroundColor: colors.primary },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={[styles.emptyCourseBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <BookOpen size={24} color={colors.textMuted} />
              <Text style={[styles.emptyCourseText, { color: colors.textMuted }]}>
                No courses enrolled yet. Tap "Join Code" above to join your teacher's course.
              </Text>
            </View>
          )}
        </View>

        {/* Announcements Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('StudentAnnouncements')}>
            <Text style={[styles.seeAllText, { color: colors.primaryLight }]}>More</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.annCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => navigation.navigate('StudentAnnouncements')}
          activeOpacity={0.8}
        >
          <View style={styles.annHeader}>
            <Megaphone size={16} color={colors.primaryLight} />
            <Text style={[styles.annBadge, { color: colors.primaryLight }]}>Notice</Text>
            <Text style={[styles.annTime, { color: colors.textSubtle }]}>• Today</Text>
          </View>
          <Text style={[styles.annTitle, { color: colors.text }]}>
            Midterm Examination Timetable Released
          </Text>
          <Text style={[styles.annDesc, { color: colors.textMuted }]} numberOfLines={2}>
            The proctored midterm timetable is now live. Check your schedule and exam instructions.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniLogo: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircle: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCount: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  welcomeBox: {
    gap: 2,
  },
  welcomeGreeting: {
    fontSize: 13,
    fontWeight: '600',
  },
  welcomeName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  welcomeSub: {
    fontSize: 12,
    marginTop: 2,
  },
  gamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  gamItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gamIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamNum: {
    fontSize: 15,
    fontWeight: '800',
  },
  gamLabel: {
    fontSize: 11,
    marginTop: 1,
  },
  gamDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 12,
  },
  liveCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  liveCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EC489918',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EC4899',
  },
  liveBadgeText: {
    color: '#EC4899',
    fontSize: 10,
    fontWeight: '800',
  },
  liveTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  liveTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  liveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  liveInstructor: {
    fontSize: 12,
  },
  joinLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinLiveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionTile: {
    width: (SCREEN_WIDTH - 32 - 30) / 4,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tileIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  coursesList: {
    gap: 10,
  },
  courseCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  courseTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  courseInstructor: {
    fontSize: 12,
    marginTop: 2,
  },
  progressPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  progressPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarWrapper: {
    width: '100%',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyCourseBox: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyCourseText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  annCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  annHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  annBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  annTime: {
    fontSize: 11,
  },
  annTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  annDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
});
