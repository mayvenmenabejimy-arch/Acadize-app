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
import { teacherService, TeacherCourse } from '../../services/teacher.service';
import {
  BookOpen,
  Users,
  Layers,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

export const TeacherCoursesScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [classes, setClasses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      const liveCourses = await teacherService.getMyCourses();
      setClasses(liveCourses);
    } catch (error) {
      console.warn('Error fetching courses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Classes & Courses"
        subtitle="Manage your curriculum, lessons & students"
        rightAction={{
          icon: Plus,
          onPress: () => Alert.alert('New Course', 'Create Course wizard initiated.'),
        }}
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading your courses from database...
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
          <View style={styles.topInfoRow}>
            <Text style={[styles.courseCount, { color: colors.text }]}>
              Assigned Courses ({classes.length})
            </Text>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('New Course', 'Create Course wizard initiated.')}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={styles.createBtnText}>New Course</Text>
            </TouchableOpacity>
          </View>

          {classes.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <BookOpen size={40} color={colors.primaryLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No courses assigned yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                You currently have no classes configured in the database. Tap "New Course" to create one.
              </Text>
            </View>
          ) : (
            classes.map((course) => (
              <View
                key={course.id}
                style={[
                  styles.courseCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.codeBadge, { backgroundColor: colors.background }]}>
                    <Text style={[styles.codeText, { color: colors.primaryLight }]}>
                      {course.code || 'COURSE'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: course.isPublished ? '#10B98120' : '#F59E0B20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: course.isPublished ? '#10B981' : '#F59E0B' },
                      ]}
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
                {course.description ? (
                  <Text style={[styles.desc, { color: colors.textMuted }]} numberOfLines={2}>
                    {course.description}
                  </Text>
                ) : null}

                <View style={[styles.metaBar, { borderTopColor: colors.divider }]}>
                  <View style={styles.metaItem}>
                    <Users size={14} color={colors.textMuted} />
                    <Text style={[styles.metaText, { color: colors.text }]}>
                      {course.studentsCount ?? 0} Students
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Layers size={14} color={colors.textMuted} />
                    <Text style={[styles.metaText, { color: colors.text }]}>
                      {course.lessonsCount ?? 0} Lessons
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.manageBtn}
                    onPress={() =>
                      Alert.alert(
                        'Course Details',
                        `Opening curriculum details for "${course.title}".`
                      )
                    }
                  >
                    <Text style={[styles.manageBtnText, { color: colors.primaryLight }]}>
                      Manage
                    </Text>
                    <ChevronRight size={14} color={colors.primaryLight} />
                  </TouchableOpacity>
                </View>
              </View>
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
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  courseCount: {
    fontSize: 15,
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
  courseCard: {
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
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
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
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  manageBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  manageBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
