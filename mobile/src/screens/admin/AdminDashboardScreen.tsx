import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { adminService, SystemStats, UserStats, ModerationReport } from '../../services/admin.service';
import {
  Users,
  Shield,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  Activity,
  Award,
  ChevronRight,
  Server,
  UserCheck,
  Clock,
  AlertCircle,
} from 'lucide-react-native';

export const AdminDashboardScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveAdminData = useCallback(async () => {
    try {
      const [sys, usr, rep] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getUserStats(),
        adminService.getReports('pending'),
      ]);
      setSystemStats(sys);
      setUserStats(usr);
      setReports(rep);
    } catch (err) {
      console.warn('Failed to load admin dashboard data from server:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAdminData();
  }, [fetchLiveAdminData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveAdminData();
  };

  const metrics = [
    {
      label: 'Total Users',
      value: systemStats?.totalUsers !== undefined ? systemStats.totalUsers.toLocaleString() : '...',
      icon: Users,
      color: '#6366F1',
    },
    {
      label: 'Active Users',
      value: systemStats?.activeUsers !== undefined ? systemStats.activeUsers.toLocaleString() : '...',
      icon: UserCheck,
      color: '#10B981',
    },
    {
      label: 'Total Courses',
      value: systemStats?.totalCourses !== undefined ? systemStats.totalCourses.toLocaleString() : '...',
      icon: BookOpen,
      color: '#F59E0B',
    },
    {
      label: 'Enrollments',
      value: systemStats?.totalEnrollments !== undefined ? systemStats.totalEnrollments.toLocaleString() : '...',
      icon: TrendingUp,
      color: '#EC4899',
    },
  ];

  const userRoleStats = [
    { label: 'Students', count: userStats?.students ?? 0, color: '#6366F1' },
    { label: 'Teachers', count: userStats?.teachers ?? 0, color: '#F59E0B' },
    { label: 'Parents', count: userStats?.parents ?? 0, color: '#8B5CF6' },
    { label: 'Admins', count: userStats?.admins ?? 0, color: '#EC4899' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Admin Console" subtitle="Live database analytics & system control" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading database metrics...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* System Health Status Bar */}
          <View style={[styles.healthCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.healthLeft}>
              <View style={styles.healthDot} />
              <Text style={[styles.healthTitle, { color: colors.text }]}>Database Connected & Healthy</Text>
            </View>
            <Text style={[styles.uptimeText, { color: colors.textMuted }]}>
              {systemStats?.recentSignups ? `+${systemStats.recentSignups} this week` : 'Live'}
            </Text>
          </View>

          {/* 4 Primary Database Metric Cards */}
          <View style={styles.metricsGrid}>
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <View
                  key={idx}
                  style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <View style={[styles.iconWrap, { backgroundColor: m.color + '20' }]}>
                    <Icon size={18} color={m.color} />
                  </View>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{m.value}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{m.label}</Text>
                </View>
              );
            })}
          </View>

          {/* User Distribution by Role */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 4 }]}>
            User Breakdown by Role
          </Text>
          <View style={[styles.rolesCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.rolesRow}>
              {userRoleStats.map((r, i) => (
                <View key={i} style={styles.roleStatCol}>
                  <Text style={[styles.roleStatCount, { color: r.color }]}>
                    {r.count.toLocaleString()}
                  </Text>
                  <Text style={[styles.roleStatLbl, { color: colors.textMuted }]}>{r.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Management Shortcuts */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 4 }]}>
            Administration Modules
          </Text>
          <View style={styles.modulesGrid}>
            <TouchableOpacity
              style={[styles.moduleCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => navigation.navigate('AdminUsers')}
            >
              <Users size={22} color={colors.primaryLight} />
              <Text style={[styles.moduleTitle, { color: colors.text }]}>Users Directory</Text>
              <Text style={[styles.moduleSub, { color: colors.textMuted }]}>
                {systemStats?.totalUsers ?? 0} total accounts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.moduleCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => navigation.navigate('AdminAttendance')}
            >
              <CalendarCheck size={22} color="#10B981" />
              <Text style={[styles.moduleTitle, { color: colors.text }]}>Attendance Control</Text>
              <Text style={[styles.moduleSub, { color: colors.textMuted }]}>Campus check-ins</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.moduleCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => navigation.navigate('AdminReports')}
            >
              <Activity size={22} color="#F59E0B" />
              <Text style={[styles.moduleTitle, { color: colors.text }]}>Reports & Analytics</Text>
              <Text style={[styles.moduleSub, { color: colors.textMuted }]}>Institution metrics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.moduleCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => navigation.navigate('AdminGamification')}
            >
              <Award size={22} color="#EC4899" />
              <Text style={[styles.moduleTitle, { color: colors.text }]}>Gamification Rules</Text>
              <Text style={[styles.moduleSub, { color: colors.textMuted }]}>XP & Badges</Text>
            </TouchableOpacity>
          </View>

          {/* Pending Reports / Audit Section */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 6 }]}>
            Moderation & System Notice ({reports.length} pending)
          </Text>

          {reports.length > 0 ? (
            <View style={[styles.auditCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              {reports.map((rep, idx) => (
                <View
                  key={rep.id}
                  style={[
                    styles.auditRow,
                    idx < reports.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                  ]}
                >
                  <AlertCircle size={18} color="#EF4444" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.auditAction, { color: colors.text }]}>{rep.reason}</Text>
                    <Text style={[styles.auditBy, { color: colors.textMuted }]}>
                      Reported: {rep.reportedUser?.fullName || 'User'} • {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.noReportsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.noReportsText, { color: colors.textMuted }]}>
                No pending moderation reports in the database. All user activity is clean!
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  healthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  healthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  healthTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  uptimeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rolesCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roleStatCol: {
    alignItems: 'center',
  },
  roleStatCount: {
    fontSize: 20,
    fontWeight: '800',
  },
  roleStatLbl: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  moduleSub: {
    fontSize: 12,
  },
  auditCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  auditAction: {
    fontSize: 14,
    fontWeight: '700',
  },
  auditBy: {
    fontSize: 11,
    marginTop: 2,
  },
  noReportsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noReportsText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
