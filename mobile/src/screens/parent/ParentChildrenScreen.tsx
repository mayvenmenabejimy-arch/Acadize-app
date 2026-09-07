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
  User,
  Mail,
  GraduationCap,
} from 'lucide-react-native';

export const ParentChildrenScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadChildren = useCallback(async () => {
    try {
      const data = await parentService.getChildren();
      setChildren(data);
    } catch (error) {
      console.warn('Failed to load children:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const onRefresh = () => {
    setRefreshing(true);
    loadChildren();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="My Children" subtitle="Profiles, enrolled courses & teachers" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading children profiles from database...
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
                No Linked Children Found
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                No student accounts are currently mapped to your parent profile. Contact your school administrator to link your child.
              </Text>
            </View>
          ) : (
            children.map((child) => (
              <View
                key={child.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>
                      {(child.name || 'S').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: colors.text }]}>{child.name}</Text>
                    <Text style={[styles.grade, { color: colors.textMuted }]}>
                      {child.grade || 'Enrolled Student'}
                    </Text>
                  </View>
                  <View style={styles.gpaPill}>
                    <Text style={[styles.gpaNum, { color: colors.primaryLight }]}>
                      GPA {child.gpa || '3.8'}
                    </Text>
                  </View>
                </View>

                {/* Enrolled classes pills */}
                <Text style={[styles.subHeading, { color: colors.textMuted }]}>
                  Enrolled Courses ({child.enrolledCourses?.length || 0})
                </Text>
                <View style={styles.coursePillsRow}>
                  {child.enrolledCourses && child.enrolledCourses.length > 0 ? (
                    child.enrolledCourses.map((c, i) => (
                      <View
                        key={i}
                        style={[styles.coursePill, { backgroundColor: colors.background }]}
                      >
                        <BookOpen size={12} color={colors.primaryLight} />
                        <Text style={[styles.coursePillText, { color: colors.text }]}>{c}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: colors.textSubtle, fontSize: 12 }}>
                      Enrolled in platform curriculum
                    </Text>
                  )}
                </View>

                {/* Faculty advisor info */}
                <View style={[styles.teacherRow, { borderTopColor: colors.divider }]}>
                  <View style={styles.teacherInfo}>
                    <Text style={[styles.teacherTitle, { color: colors.textMuted }]}>
                      Lead Instructor
                    </Text>
                    <Text style={[styles.teacherName, { color: colors.text }]}>
                      {child.homeroomTeacher || 'Faculty Lead'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.contactBtn, { backgroundColor: colors.primary + '18' }]}
                    onPress={() =>
                      Alert.alert(
                        'Contact Instructor',
                        `Send email to ${child.teacherEmail || 'faculty@acadize.com'}?`,
                        [{ text: 'Cancel' }, { text: 'Send Message' }]
                      )
                    }
                  >
                    <Mail size={14} color={colors.primaryLight} />
                    <Text style={[styles.contactBtnText, { color: colors.primaryLight }]}>
                      Message
                    </Text>
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
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  grade: {
    fontSize: 12,
    marginTop: 2,
  },
  gpaPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#6366F115',
  },
  gpaNum: {
    fontSize: 12,
    fontWeight: '800',
  },
  subHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  coursePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coursePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  coursePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  teacherInfo: {
    gap: 2,
  },
  teacherTitle: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  teacherName: {
    fontSize: 13,
    fontWeight: '700',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
