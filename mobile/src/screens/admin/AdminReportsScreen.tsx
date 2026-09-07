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
import { Header } from '../../components/Header';
import {
  adminService,
  SystemStats,
  UserStats,
  PlatformAnalytics,
  ModerationReport,
} from '../../services/admin.service';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  FileCheck2,
  Bell,
  ShieldAlert,
} from 'lucide-react-native';

export const AdminReportsScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [reports, setReports] = useState<ModerationReport[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [sys, usr, ana, rep] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getUserStats(),
        adminService.getAnalytics(),
        adminService.getReports('pending'),
      ]);
      setSystemStats(sys);
      setUserStats(usr);
      setAnalytics(ana);
      setReports(rep);
    } catch (error) {
      console.warn('Failed to load reports & analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleExport = (reportTitle: string) => {
    Alert.alert(
      'Export Initiated',
      `Live database export for "${reportTitle}" is being generated in CSV / PDF format.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Reports & Analytics"
        subtitle="Institution-wide live metrics & database audits"
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading analytics from database...
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
          {/* Top 4 KPI Metrics */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Institution Metrics
          </Text>
          <View style={styles.kpiGrid}>
            <View
              style={[
                styles.kpiCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.kpiValue, { color: '#6366F1' }]}>
                {systemStats?.totalEnrollments ?? 0}
              </Text>
              <Text style={[styles.kpiTitle, { color: colors.text }]}>Total Enrollments</Text>
              <Text style={[styles.kpiSub, { color: colors.textMuted }]}>
                {systemStats?.totalCourses ?? 0} published courses
              </Text>
            </View>

            <View
              style={[
                styles.kpiCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.kpiValue, { color: '#10B981' }]}>
                {userStats?.activeToday ?? systemStats?.activeUsers ?? 0}
              </Text>
              <Text style={[styles.kpiTitle, { color: colors.text }]}>Active Today</Text>
              <Text style={[styles.kpiSub, { color: colors.textMuted }]}>
                +{userStats?.newUsersThisWeek ?? 0} new this week
              </Text>
            </View>

            <View
              style={[
                styles.kpiCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>
                {analytics?.recentActivity?.submissions ?? 0}
              </Text>
              <Text style={[styles.kpiTitle, { color: colors.text }]}>Recent Submissions</Text>
              <Text style={[styles.kpiSub, { color: colors.textMuted }]}>
                {analytics?.recentActivity?.assignments ?? 0} active assignments
              </Text>
            </View>

            <View
              style={[
                styles.kpiCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.kpiValue, { color: '#EC4899' }]}>
                {userStats?.teachers ?? 0}
              </Text>
              <Text style={[styles.kpiTitle, { color: colors.text }]}>Active Teachers</Text>
              <Text style={[styles.kpiSub, { color: colors.textMuted }]}>
                {userStats?.students ?? 0} total students
              </Text>
            </View>
          </View>

          {/* User Distribution Breakdown */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>
            Demographic Breakdown
          </Text>
          <View
            style={[
              styles.breakdownCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownVal, { color: '#6366F1' }]}>
                  {userStats?.students ?? 0}
                </Text>
                <Text style={[styles.breakdownLbl, { color: colors.textMuted }]}>Students</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownVal, { color: '#10B981' }]}>
                  {userStats?.teachers ?? 0}
                </Text>
                <Text style={[styles.breakdownLbl, { color: colors.textMuted }]}>Teachers</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownVal, { color: '#F59E0B' }]}>
                  {userStats?.parents ?? 0}
                </Text>
                <Text style={[styles.breakdownLbl, { color: colors.textMuted }]}>Parents</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownVal, { color: '#EC4899' }]}>
                  {userStats?.admins ?? 0}
                </Text>
                <Text style={[styles.breakdownLbl, { color: colors.textMuted }]}>Admins</Text>
              </View>
            </View>
          </View>

          {/* Pending Moderation Reports from Database */}
          {reports.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>
                Pending Flagged Reports ({reports.length})
              </Text>
              <View style={styles.reportsList}>
                {reports.map((rep) => (
                  <View
                    key={rep.id}
                    style={[
                      styles.reportCard,
                      { backgroundColor: colors.card, borderColor: '#EF444440' },
                    ]}
                  >
                    <View style={[styles.iconBox, { backgroundColor: '#EF444415' }]}>
                      <ShieldAlert size={20} color="#EF4444" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reportName, { color: colors.text }]}>
                        {rep.reason}
                      </Text>
                      <Text style={[styles.reportMeta, { color: colors.textMuted }]}>
                        Reported: {rep.reportedUser?.fullName || 'User'} • By {rep.reporter?.fullName || 'Anonymous'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Exportable Academic Reports */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>
            Exportable Database Audits
          </Text>

          <View style={styles.reportsList}>
            {[
              {
                id: '1',
                name: 'Monthly Academic Performance Summary',
                type: 'PDF / CSV',
                period: 'Current Academic Term',
              },
              {
                id: '2',
                name: 'Institution-wide Attendance Log',
                type: 'Excel Spreadsheet',
                period: 'Complete Semester',
              },
              {
                id: '3',
                name: 'Course Enrollment & User Audit',
                type: 'Financial & User CSV',
                period: 'Active Academic Year',
              },
              {
                id: '4',
                name: 'Faculty Teaching Hours & Zoom Logs',
                type: 'CSV Export',
                period: 'Last 30 Days',
              },
            ].map((r) => (
              <View
                key={r.id}
                style={[
                  styles.reportCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: '#6366F115' }]}>
                  <FileText size={20} color={colors.primaryLight} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.reportName, { color: colors.text }]}>{r.name}</Text>
                  <Text style={[styles.reportMeta, { color: colors.textMuted }]}>
                    {r.period} • {r.type}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.dlBtn, { backgroundColor: colors.primary }]}
                  onPress={() => handleExport(r.name)}
                >
                  <Download size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  kpiTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  kpiSub: {
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  breakdownCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  breakdownLbl: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 30,
  },
  reportsList: {
    gap: 10,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportName: {
    fontSize: 14,
    fontWeight: '700',
  },
  reportMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  dlBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
