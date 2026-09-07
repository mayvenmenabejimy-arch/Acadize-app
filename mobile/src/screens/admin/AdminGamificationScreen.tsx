import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { adminService, PointRule } from '../../services/admin.service';
import {
  Award,
  Sparkles,
  Flame,
  Zap,
  Save,
  Sliders,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileCheck2,
  GraduationCap,
} from 'lucide-react-native';

interface RuleMeta {
  label: string;
  description: string;
  icon: any;
  color: string;
}

const EVENT_TYPE_CONFIG: Record<string, RuleMeta> = {
  lesson_complete: {
    label: 'Lesson Completed',
    description: 'Awarded when a student completes all materials in a lesson',
    icon: BookOpen,
    color: '#6366F1',
  },
  quiz_complete: {
    label: 'Quiz Completed',
    description: 'Awarded upon finishing a knowledge check quiz',
    icon: Sparkles,
    color: '#10B981',
  },
  exam_complete: {
    label: 'Exam Completed',
    description: 'Awarded when a student submits an official term exam',
    icon: Award,
    color: '#F59E0B',
  },
  assignment_submit: {
    label: 'Assignment Submitted',
    description: 'Awarded when an assignment is submitted before the deadline',
    icon: Zap,
    color: '#8B5CF6',
  },
  assignment_graded_pass: {
    label: 'Assignment Graded Pass',
    description: 'Awarded when instructor marks homework with a passing grade',
    icon: FileCheck2,
    color: '#06B6D4',
  },
  course_complete: {
    label: 'Course Graduation',
    description: 'Awarded upon completing 100% of a course curriculum',
    icon: GraduationCap,
    color: '#EC4899',
  },
};

const DEFAULT_EVENT_TYPES = [
  { eventType: 'lesson_complete', points: 20, isActive: true },
  { eventType: 'quiz_complete', points: 30, isActive: true },
  { eventType: 'exam_complete', points: 100, isActive: true },
  { eventType: 'assignment_submit', points: 40, isActive: true },
  { eventType: 'assignment_graded_pass', points: 50, isActive: true },
  { eventType: 'course_complete', points: 200, isActive: true },
];

export const AdminGamificationScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [rules, setRules] = useState<PointRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRules = useCallback(async () => {
    try {
      const serverRules = await adminService.getGamificationRules();
      if (serverRules && serverRules.length > 0) {
        setRules(serverRules);
      } else {
        // Fallback to standard 6 default event types
        setRules(
          DEFAULT_EVENT_TYPES.map((d, index) => ({
            id: String(index + 1),
            eventType: d.eventType,
            points: d.points,
            isActive: d.isActive,
          }))
        );
      }
    } catch (error) {
      console.warn('Failed to load rules:', error);
      Alert.alert('Error', 'Unable to fetch gamification rules from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRules();
  };

  const handleUpdatePoints = (eventType: string, val: string) => {
    const num = parseInt(val, 10);
    setRules((prev) =>
      prev.map((r) =>
        r.eventType === eventType ? { ...r, points: isNaN(num) ? 0 : num } : r
      )
    );
  };

  const handleToggleActive = (eventType: string, val: boolean) => {
    setRules((prev) =>
      prev.map((r) =>
        r.eventType === eventType ? { ...r, isActive: val } : r
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateGamificationRules(
        rules.map((r) => ({
          eventType: r.eventType,
          points: Number(r.points) || 0,
          isActive: r.isActive !== false,
        }))
      );
      Alert.alert(
        'Rules Updated',
        'Gamification rules have been successfully synced to the live database.'
      );
      loadRules();
    } catch (error: any) {
      Alert.alert('Save Failed', error?.message || 'Failed to save rules to database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Gamification Rules"
        subtitle="Live points & reward criteria from database"
        rightAction={{
          icon: Save,
          onPress: handleSave,
        }}
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading live rules from database...
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
          {/* Header Banner */}
          <View
            style={[
              styles.banner,
              { backgroundColor: '#6366F115', borderColor: '#6366F130' },
            ]}
          >
            <Sliders size={20} color={colors.primaryLight} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: colors.text }]}>
                Live Platform Rules Engine
              </Text>
              <Text style={[styles.bannerSub, { color: colors.textMuted }]}>
                Adjust points rewarded to students automatically across your organization.
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Academic Event Point Allocation
          </Text>

          {rules.map((rule) => {
            const meta = EVENT_TYPE_CONFIG[rule.eventType] || {
              label: rule.eventType.replace(/_/g, ' ').toUpperCase(),
              description: 'Triggered upon student action',
              icon: Sparkles,
              color: '#6366F1',
            };
            const Icon = meta.icon;
            const active = rule.isActive !== false;

            return (
              <View
                key={rule.eventType}
                style={[
                  styles.ruleCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: active ? colors.cardBorder : colors.cardBorder + '60',
                    opacity: active ? 1 : 0.65,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: meta.color + '20' },
                  ]}
                >
                  <Icon size={20} color={meta.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.ruleAction, { color: colors.text }]}>
                      {meta.label}
                    </Text>
                    <Switch
                      value={active}
                      onValueChange={(val) => handleToggleActive(rule.eventType, val)}
                      trackColor={{ false: colors.cardBorder, true: colors.primary + '80' }}
                      thumbColor={active ? colors.primary : '#FFFFFF'}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                  </View>
                  <Text style={[styles.ruleLabel, { color: colors.textSubtle }]}>
                    {meta.description}
                  </Text>
                </View>

                <View style={styles.xpInputBox}>
                  <TextInput
                    style={[
                      styles.xpInput,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.text,
                      },
                    ]}
                    value={String(rule.points || 0)}
                    onChangeText={(val) => handleUpdatePoints(rule.eventType, val)}
                    keyboardType="number-pad"
                    maxLength={5}
                    editable={active}
                  />
                  <Text style={[styles.xpText, { color: colors.textMuted }]}>PTS</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 },
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Save size={16} color="#FFFFFF" />
            )}
            <Text style={styles.saveBtnText}>
              {saving ? 'Syncing to Database...' : 'Save Gamification Rules'}
            </Text>
          </TouchableOpacity>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bannerSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruleAction: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  ruleLabel: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  xpInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpInput: {
    width: 60,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 14,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
