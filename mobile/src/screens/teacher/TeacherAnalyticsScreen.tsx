import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Brain,
} from 'lucide-react-native';

export const TeacherAnalyticsScreen = () => {
  const { colors } = useTheme();

  const metrics = [
    { label: 'Avg Class Grade', value: '88.4%', change: '+3.2%', positive: true },
    { label: 'Homework Submission', value: '94.1%', change: '+1.5%', positive: true },
    { label: 'Live Attendance', value: '91.8%', change: '-0.8%', positive: false },
    { label: 'Active Students', value: '112', change: '100% active', positive: true },
  ];

  const commonMistakes = [
    { topic: 'Calculus: Chain Rule with Exponentials', errorRate: '42%', studentsCount: 14 },
    { topic: 'Physics: Moment of Inertia for Cylinders', errorRate: '38%', studentsCount: 11 },
    { topic: 'Algebra: Matrix Determinants 3x3', errorRate: '25%', studentsCount: 8 },
  ];

  const topStudents = [
    { rank: 1, name: 'Layla El-Sayed', gpa: '3.98', course: 'Advanced Calculus' },
    { rank: 2, name: 'Karim Mostafa', gpa: '3.95', course: 'AP Physics C' },
    { rank: 3, name: 'Alex Smith', gpa: '3.85', course: 'Advanced Calculus' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Class Analytics" subtitle="Student performance, common errors & metrics" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* KPI Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((m, i) => (
            <View
              key={i}
              style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{m.label}</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{m.value}</Text>
              <Text
                style={[
                  styles.metricChange,
                  { color: m.positive ? '#10B981' : '#EF4444' },
                ]}
              >
                {m.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Most Frequent Concept Errors */}
        <View style={styles.sectionHeader}>
          <Brain size={18} color={colors.primaryLight} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Top Concepts Requiring Review
          </Text>
        </View>

        <View style={styles.mistakesList}>
          {commonMistakes.map((item, idx) => (
            <View
              key={idx}
              style={[styles.mistakeItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.mistakeTopic, { color: colors.text }]}>{item.topic}</Text>
                <Text style={[styles.mistakeSub, { color: colors.textMuted }]}>
                  {item.studentsCount} students made mistakes in this topic
                </Text>
              </View>

              <View style={[styles.errorPill, { backgroundColor: '#EF444420' }]}>
                <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 13 }}>
                  {item.errorRate} Error
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Scholars in Class */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <TrendingUp size={18} color="#10B981" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Performing Students</Text>
        </View>

        <View style={[styles.topCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {topStudents.map((s, idx) => (
            <View
              key={s.rank}
              style={[
                styles.topRow,
                idx < topStudents.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
              ]}
            >
              <Text style={styles.medalIcon}>
                {s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : '🥉'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.topName, { color: colors.text }]}>{s.name}</Text>
                <Text style={[styles.topCourse, { color: colors.textMuted }]}>{s.course}</Text>
              </View>
              <Text style={[styles.topGpa, { color: colors.primaryLight }]}>GPA {s.gpa}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
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
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  metricChange: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  mistakesList: {
    gap: 10,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  mistakeTopic: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  mistakeSub: {
    fontSize: 12,
    marginTop: 2,
  },
  errorPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  topCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  medalIcon: {
    fontSize: 20,
  },
  topName: {
    fontSize: 14,
    fontWeight: '700',
  },
  topCourse: {
    fontSize: 12,
    marginTop: 1,
  },
  topGpa: {
    fontSize: 13,
    fontWeight: '800',
  },
});
