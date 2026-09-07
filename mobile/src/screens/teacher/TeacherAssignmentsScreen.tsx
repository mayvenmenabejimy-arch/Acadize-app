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
import { teacherService, TeacherAssignment } from '../../services/teacher.service';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';

export const TeacherAssignmentsScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAssignments = useCallback(async () => {
    try {
      const items = await teacherService.getMyAssignments();
      setAssignments(items);
    } catch (error) {
      console.warn('Failed to load teacher assignments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAssignments();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Assignments & Grading"
        subtitle="Review homework & enter student grades"
        rightAction={{
          icon: Plus,
          onPress: () => Alert.alert('New Assignment', 'Create Assignment modal open.'),
        }}
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading assignments from database...
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
          <View style={styles.topRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Course Tasks ({assignments.length})
            </Text>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('New Assignment', 'Create Assignment modal open.')}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={styles.createBtnText}>Create</Text>
            </TouchableOpacity>
          </View>

          {assignments.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <FileCheck2 size={40} color={colors.primaryLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No assignments found
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                There are currently no assignments created for your courses in the database.
              </Text>
            </View>
          ) : (
            assignments.map((item) => {
              const pendingCount = item.pendingGradingCount ?? 0;
              const isAllGraded = pendingCount === 0 && (item.submissionsCount ?? 0) > 0;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.assignCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.coursePill, { backgroundColor: colors.background }]}>
                      <BookOpen size={12} color={colors.primaryLight} />
                      <Text style={[styles.courseText, { color: colors.textMuted }]}>
                        {item.courseTitle || 'Course'}
                      </Text>
                    </View>

                    {isAllGraded ? (
                      <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                        <CheckCircle2 size={12} color="#10B981" />
                        <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>
                          All Graded
                        </Text>
                      </View>
                    ) : pendingCount > 0 ? (
                      <View style={[styles.statusBadge, { backgroundColor: '#F59E0B20' }]}>
                        <Clock size={12} color="#F59E0B" />
                        <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: '700' }}>
                          {pendingCount} Pending
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.statusBadge, { backgroundColor: '#6366F120' }]}>
                        <Text style={{ color: colors.primaryLight, fontSize: 11, fontWeight: '700' }}>
                          Published
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                  {item.description ? (
                    <Text style={[styles.desc, { color: colors.textMuted }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}

                  <View style={[styles.metaBar, { borderTopColor: colors.divider }]}>
                    <View style={styles.metaCol}>
                      <Text style={[styles.metaLbl, { color: colors.textSubtle }]}>Submissions</Text>
                      <Text style={[styles.metaVal, { color: colors.text }]}>
                        {item.submissionsCount ?? 0} submitted
                      </Text>
                    </View>

                    <View style={styles.metaCol}>
                      <Text style={[styles.metaLbl, { color: colors.textSubtle }]}>Due Date</Text>
                      <Text style={[styles.metaVal, { color: colors.text }]}>
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No deadline'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.gradeBtn, { backgroundColor: colors.primary }]}
                      onPress={() =>
                        Alert.alert(
                          'Grading Submissions',
                          `Entering grading portal for "${item.title}".`
                        )
                      }
                    >
                      <Text style={styles.gradeBtnText}>Review</Text>
                      <ChevronRight size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  assignCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  metaCol: {
    marginRight: 20,
    gap: 2,
  },
  metaLbl: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  gradeBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gradeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
