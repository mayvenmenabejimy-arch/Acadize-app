import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  studentService,
  StudentAssignmentItem,
} from '../../services/student.service';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Upload,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';

export const StudentAssignmentsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [assignments, setAssignments] = useState<StudentAssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted'>('all');
  const [search, setSearch] = useState('');

  const loadAssignments = useCallback(async () => {
    try {
      const items = await studentService.getAssignments();
      setAssignments(items);
    } catch (error) {
      console.warn('Failed to load assignments:', error);
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

  const filtered = assignments.filter((a) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && (a.status === 'pending' || a.status === 'overdue')) ||
      (activeTab === 'submitted' && (a.status === 'submitted' || a.status === 'graded'));
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.courseTitle && a.courseTitle.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string, grade?: number | null) => {
    switch (status) {
      case 'graded':
        return {
          text: grade !== undefined && grade !== null ? `${grade} PTS` : 'Graded',
          color: '#10B981',
          bg: '#10B98120',
          icon: CheckCircle2,
        };
      case 'submitted':
        return {
          text: 'Submitted',
          color: '#6366F1',
          bg: '#6366F120',
          icon: Clock,
        };
      case 'overdue':
        return {
          text: 'Overdue',
          color: '#EF4444',
          bg: '#EF444420',
          icon: AlertCircle,
        };
      default:
        return {
          text: 'Due Soon',
          color: '#F59E0B',
          bg: '#F59E0B20',
          icon: Clock,
        };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Assignments"
        subtitle="Homework, problem sets & submissions"
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
          {/* Search bar */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search tasks or courses..."
              placeholderTextColor={colors.textSubtle}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Filter tabs */}
          <View style={styles.tabsRow}>
            {(['all', 'pending', 'submitted'] as const).map((tab) => {
              const isSelected = activeTab === tab;
              const count =
                tab === 'all'
                  ? assignments.length
                  : tab === 'pending'
                  ? assignments.filter((a) => a.status === 'pending' || a.status === 'overdue').length
                  : assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabBtn,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.cardBorder,
                    },
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isSelected ? '#FFFFFF' : colors.textMuted },
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Assignment items list */}
          {filtered.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <FileCheck2 size={40} color={colors.primaryLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Assignments Found
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                {search
                  ? 'No tasks matched your search criteria.'
                  : 'You are all caught up! No tasks in this category.'}
              </Text>
            </View>
          ) : (
            filtered.map((item) => {
              const badge = getStatusBadge(item.status, item.grade);
              const BadgeIcon = badge.icon;
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

                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <BadgeIcon size={12} color={badge.color} />
                      <Text style={[styles.statusText, { color: badge.color }]}>
                        {badge.text}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                  {item.description ? (
                    <Text style={[styles.desc, { color: colors.textMuted }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}

                  <View style={[styles.metaBar, { borderTopColor: colors.divider }]}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.textMuted }]}>
                        {item.dueDate
                          ? `Due ${new Date(item.dueDate).toLocaleDateString()}`
                          : 'No due date'}
                      </Text>
                    </View>

                    <Text style={[styles.pointsText, { color: colors.textSubtle }]}>
                      Max: {item.maxScore || 100} pts
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        {
                          backgroundColor:
                            item.status === 'graded' || item.status === 'submitted'
                              ? colors.background
                              : colors.primary,
                        },
                      ]}
                      onPress={() =>
                        Alert.alert(
                          item.title,
                          item.status === 'graded'
                            ? `Grade: ${item.grade || 'A'}\nFeedback: ${item.feedback || 'Great work!'}`
                            : item.status === 'submitted'
                            ? 'Submission uploaded. Awaiting teacher grading.'
                            : 'Upload your homework file to complete this assignment.',
                          [{ text: 'OK' }]
                        )
                      }
                    >
                      <Upload
                        size={12}
                        color={
                          item.status === 'graded' || item.status === 'submitted'
                            ? colors.text
                            : '#FFFFFF'
                        }
                      />
                      <Text
                        style={[
                          styles.actionBtnText,
                          {
                            color:
                              item.status === 'graded' || item.status === 'submitted'
                                ? colors.text
                                : '#FFFFFF',
                          },
                        ]}
                      >
                        {item.status === 'graded'
                          ? 'Review'
                          : item.status === 'submitted'
                          ? 'Submitted'
                          : 'Submit'}
                      </Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 12,
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
  statusText: {
    fontSize: 11,
    fontWeight: '700',
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
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
