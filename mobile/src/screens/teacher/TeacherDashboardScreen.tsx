import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import {
  teacherService,
  TeacherCourse,
  TeacherAssignment,
} from '../../services/teacher.service';
import {
  BookOpen,
  Users,
  FileCheck2,
  Video,
  Clock,
  Plus,
  TrendingUp,
  AlertCircle,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';

export const TeacherDashboardScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      const [crs, asg, ses] = await Promise.all([
        teacherService.getMyCourses(),
        teacherService.getMyAssignments(),
        teacherService.getSessions(),
      ]);
      setCourses(crs);
      setAssignments(asg);
      setSessions(ses);
    } catch (error) {
      console.warn('Failed to load teacher dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  const pendingGradingCount = assignments.reduce(
    (acc, a) => acc + (a.pendingGradingCount || 0),
    0
  );

  const stats = [
    {
      label: 'Active Classes',
      value: String(courses.length),
      icon: BookOpen,
      color: '#6366F1',
    },
    {
      label: 'Total Students',
      value: String(totalStudents),
      icon: Users,
      color: '#10B981',
    },
    {
      label: 'Pending Grading',
      value: String(pendingGradingCount),
      icon: FileCheck2,
      color: '#F59E0B',
    },
    {
      label: 'Live Sessions',
      value: `${sessions.length} Scheduled`,
      icon: Video,
      color: '#EC4899',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Teacher Dashboard" subtitle="Overview of classes, grading & sessions" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading instructor overview...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom + 24, 32) },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Welcome Card */}
          <View
            style={[
              styles.welcomeCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.greeting, { color: colors.textMuted }]}>
              INSTRUCTOR PORTAL
            </Text>
            <Text style={[styles.instructorName, { color: colors.text }]}>
              Welcome, {user?.fullName || user?.name || 'Professor'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              You have {courses.length} active courses and {pendingGradingCount} student
              submissions awaiting review in your live portal.
            </Text>
          </View>

          {/* 4 Stat KPI Widgets */}
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <View
                  key={i}
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  ]}
                >
                  <View style={[styles.statIconBox, { backgroundColor: stat.color + '20' }]}>
                    <Icon size={20} color={stat.color} />
                  </View>
                  <Text style={[styles.statVal, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLbl, { color: colors.textMuted }]}>
                    {stat.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 10 }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[
                styles.actionBox,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
              onPress={() => navigation.navigate('TeacherCourses')}
            >
              <BookOpen size={22} color={colors.primaryLight} />
              <Text style={[styles.actionBoxTitle, { color: colors.text }]}>
                Manage Classes ({courses.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBox,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
              onPress={() => navigation.navigate('TeacherAssignments')}
            >
              <FileCheck2 size={22} color="#F59E0B" />
              <Text style={[styles.actionBoxTitle, { color: colors.text }]}>
                Grade Tasks ({assignments.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBox,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
              onPress={() => navigation.navigate('TeacherSessions')}
            >
              <Video size={22} color="#EC4899" />
              <Text style={[styles.actionBoxTitle, { color: colors.text }]}>
                Live Sessions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBox,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
              onPress={() => navigation.navigate('TeacherAnalytics')}
            >
              <TrendingUp size={22} color="#10B981" />
              <Text style={[styles.actionBoxTitle, { color: colors.text }]}>
                Class Analytics
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Teaching Classes */}
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Active Classes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TeacherCourses')}>
              <Text style={[styles.seeAllText, { color: colors.primaryLight }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {courses.length === 0 ? (
            <View
              style={[
                styles.emptyBox,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.emptyBoxText, { color: colors.textMuted }]}>
                No courses currently assigned in database.
              </Text>
            </View>
          ) : (
            courses.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.courseCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                onPress={() => navigation.navigate('TeacherCourses')}
              >
                <View style={[styles.courseBar, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.courseName, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.courseSub, { color: colors.textMuted }]}>
                    {item.code || 'COURSE'} • {item.lessonsCount || 0} Lessons
                  </Text>
                </View>
                <View style={[styles.studentsPill, { backgroundColor: colors.background }]}>
                  <Users size={12} color={colors.primaryLight} />
                  <Text style={[styles.studentsPillText, { color: colors.text }]}>
                    {item.studentsCount || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  welcomeCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  instructorName: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBox: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  courseBar: {
    width: 4,
    height: '100%',
    borderRadius: 2,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
  },
  courseSub: {
    fontSize: 12,
    marginTop: 3,
  },
  studentsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  studentsPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBoxText: {
    fontSize: 13,
  },
});
