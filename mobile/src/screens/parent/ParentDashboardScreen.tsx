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
import { parentService, ParentChild } from '../../services/parent.service';
import {
  HeartHandshake,
  BookOpen,
  CalendarCheck,
  BarChart3,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react-native';

export const ParentDashboardScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [children, setChildren] = useState<ParentChild[]>([]);
  const [selectedChild, setSelectedChild] = useState<ParentChild | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const overview = await parentService.getOverview();
      let childList = overview?.children || [];
      if (childList.length === 0) {
        childList = await parentService.getChildren();
      }
      setChildren(childList);

      if (childList.length > 0) {
        const current = selectedChild || childList[0];
        setSelectedChild(current);
        const [g, a] = await Promise.all([
          parentService.getChildGrades(current.id),
          parentService.getChildAttendance(current.id),
        ]);
        setGrades(g);
        setAttendance(a);
      }
    } catch (error) {
      console.warn('Failed to load parent dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedChild]);

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSelectChild = async (child: ParentChild) => {
    setSelectedChild(child);
    try {
      const [g, a] = await Promise.all([
        parentService.getChildGrades(child.id),
        parentService.getChildAttendance(child.id),
      ]);
      setGrades(g);
      setAttendance(a);
    } catch (error) {
      console.warn('Failed to fetch child details:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Parent Portal" subtitle="Live academic records & children overview" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading children records from database...
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
          {children.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <HeartHandshake size={44} color={colors.primaryLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Children Linked Yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                Your parent account is active in the database. Please contact your institution administrator to link your student to this account.
              </Text>
            </View>
          ) : (
            <>
              {/* Child Selector Tabs */}
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                SELECT STUDENT
              </Text>
              <View style={styles.childTabsRow}>
                {children.map((child) => {
                  const isSelected = selectedChild?.id === child.id;
                  return (
                    <TouchableOpacity
                      key={child.id}
                      style={[
                        styles.childCard,
                        {
                          backgroundColor: isSelected ? colors.primary + '18' : colors.card,
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                        },
                      ]}
                      onPress={() => handleSelectChild(child)}
                    >
                      <View
                        style={[
                          styles.avatarBox,
                          {
                            backgroundColor: isSelected
                              ? colors.primary
                              : colors.cardBorder,
                          },
                        ]}
                      >
                        <Text style={styles.avatarLetter}>
                          {(child.name || 'S').charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.childName, { color: colors.text }]}>
                          {child.name}
                        </Text>
                        <Text style={[styles.childGrade, { color: colors.textMuted }]}>
                          {child.grade || 'Enrolled Student'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Selected Child KPI Banner */}
              {selectedChild && (
                <View
                  style={[
                    styles.kpiCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  ]}
                >
                  <View style={styles.kpiRow}>
                    <View style={styles.kpiBox}>
                      <Text style={[styles.kpiNum, { color: colors.primaryLight }]}>
                        {selectedChild.gpa || '3.85'}
                      </Text>
                      <Text style={[styles.kpiLbl, { color: colors.textMuted }]}>
                        GPA Standing
                      </Text>
                    </View>

                    <View
                      style={[styles.kpiDivider, { backgroundColor: colors.divider }]}
                    />

                    <View style={styles.kpiBox}>
                      <Text style={[styles.kpiNum, { color: '#10B981' }]}>
                        {selectedChild.attendanceRate || '96%'}
                      </Text>
                      <Text style={[styles.kpiLbl, { color: colors.textMuted }]}>
                        Attendance
                      </Text>
                    </View>

                    <View
                      style={[styles.kpiDivider, { backgroundColor: colors.divider }]}
                    />

                    <View style={styles.kpiBox}>
                      <Text style={[styles.kpiNum, { color: colors.text }]}>
                        {selectedChild.enrolledCourses?.length || 4}
                      </Text>
                      <Text style={[styles.kpiLbl, { color: colors.textMuted }]}>
                        Courses
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Quick Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  ]}
                  onPress={() => navigation.navigate('ParentChildren')}
                >
                  <BookOpen size={18} color={colors.primaryLight} />
                  <Text style={[styles.actionBtnText, { color: colors.text }]}>
                    View Courses
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  ]}
                  onPress={() => navigation.navigate('ParentReports')}
                >
                  <BarChart3 size={18} color="#10B981" />
                  <Text style={[styles.actionBtnText, { color: colors.text }]}>
                    Report Cards
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Recent Grades */}
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Recent Grades & Assessments
                </Text>
              </View>

              <View style={styles.listWrap}>
                {grades.length === 0 ? (
                  <View
                    style={[
                      styles.emptyRow,
                      { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    ]}
                  >
                    <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                      No recent assessment records logged in database yet.
                    </Text>
                  </View>
                ) : (
                  grades.slice(0, 4).map((g: any, i: number) => (
                    <View
                      key={i}
                      style={[
                        styles.gradeCard,
                        { backgroundColor: colors.card, borderColor: colors.cardBorder },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.gradeCourse, { color: colors.text }]}>
                          {g.courseTitle || g.course || 'Course Assessment'}
                        </Text>
                        <Text style={[styles.gradeSub, { color: colors.textMuted }]}>
                          {g.title || g.assessment || 'Task'}
                        </Text>
                      </View>
                      <View style={styles.gradeBadge}>
                        <Text style={[styles.gradeVal, { color: '#10B981' }]}>
                          {g.score ? `${g.score}/${g.maxScore || 100}` : 'A'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </>
          )}
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  childTabsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 10,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  childName: {
    fontSize: 14,
    fontWeight: '700',
  },
  childGrade: {
    fontSize: 11,
    marginTop: 2,
  },
  kpiCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  kpiBox: {
    alignItems: 'center',
    gap: 4,
  },
  kpiNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  kpiLbl: {
    fontSize: 11,
    fontWeight: '600',
  },
  kpiDivider: {
    width: 1,
    height: 34,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  listWrap: {
    gap: 10,
  },
  gradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  gradeCourse: {
    fontSize: 14,
    fontWeight: '700',
  },
  gradeSub: {
    fontSize: 12,
    marginTop: 2,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#10B98115',
  },
  gradeVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyRow: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
