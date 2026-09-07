import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  BarChart3,
  Award,
  Download,
  BookOpen,
  FileText,
  TrendingUp,
} from 'lucide-react-native';

export const StudentGradesScreen = () => {
  const { colors } = useTheme();
  const [viewTab, setViewTab] = useState<'courses' | 'reports'>('courses');

  const coursesGrades = [
    { id: '1', name: 'Advanced Calculus', teacher: 'Dr. Sarah Connor', grade: 'A', percent: '94%', gpa: 4.0, credits: 4 },
    { id: '2', name: 'AP Physics C', teacher: 'Prof. Mark Davis', grade: 'A-', percent: '91%', gpa: 3.7, credits: 4 },
    { id: '3', name: 'Chemistry Honors', teacher: 'Dr. Emily Vance', grade: 'B+', percent: '88%', gpa: 3.3, credits: 3 },
    { id: '4', name: 'Algebra Fundamentals', teacher: 'Mr. Robert Taylor', grade: 'A+', percent: '98%', gpa: 4.0, credits: 3 },
    { id: '5', name: 'World History', teacher: 'Ms. Linda Gomez', grade: 'A', percent: '93%', gpa: 4.0, credits: 3 },
  ];

  const reportCards = [
    { id: 'r1', term: 'Fall Semester 2026 - Midterm', date: 'Oct 1, 2026', gpa: '3.82', status: 'Official' },
    { id: 'r2', term: 'Spring Semester 2026 - Final', date: 'Jun 12, 2026', gpa: '3.78', status: 'Archived' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Grades & Reports" subtitle="Academic performance & term report cards" />

      {/* GPA Banner */}
      <View style={styles.bannerPadding}>
        <View style={[styles.gpaCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.gpaLeft}>
            <Text style={[styles.gpaLabel, { color: colors.textMuted }]}>Cumulative GPA</Text>
            <Text style={[styles.gpaValue, { color: colors.primaryLight }]}>3.85</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={14} color="#10B981" />
              <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '700' }}>
                Top 5% in Class
              </Text>
            </View>
          </View>
          <View style={[styles.gpaDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.gpaRight}>
            <View style={styles.gpaStat}>
              <Text style={[styles.subGpaNum, { color: colors.text }]}>17</Text>
              <Text style={[styles.subGpaLbl, { color: colors.textMuted }]}>Total Credits</Text>
            </View>
            <View style={styles.gpaStat}>
              <Text style={[styles.subGpaNum, { color: colors.text }]}>4.0</Text>
              <Text style={[styles.subGpaLbl, { color: colors.textMuted }]}>Scale</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab bar */}
      <View style={[styles.tabsRow, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity
          style={[styles.tabBtn, viewTab === 'courses' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setViewTab('courses')}
        >
          <Text style={[styles.tabText, { color: viewTab === 'courses' ? colors.primaryLight : colors.textMuted }]}>
            Course Breakdown
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, viewTab === 'reports' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setViewTab('reports')}
        >
          <Text style={[styles.tabText, { color: viewTab === 'reports' ? colors.primaryLight : colors.textMuted }]}>
            Report Cards (PDF)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {viewTab === 'courses' ? (
          coursesGrades.map((course) => (
            <View
              key={course.id}
              style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={styles.courseCardLeft}>
                <Text style={[styles.courseName, { color: colors.text }]}>{course.name}</Text>
                <Text style={[styles.teacherName, { color: colors.textMuted }]}>{course.teacher}</Text>
                <Text style={[styles.creditsText, { color: colors.textSubtle }]}>
                  {course.credits} Credits • Weighted GPA: {course.gpa}
                </Text>
              </View>

              <View style={styles.gradeBadge}>
                <Text style={[styles.gradeLetter, { color: colors.primaryLight }]}>{course.grade}</Text>
                <Text style={[styles.gradePercent, { color: colors.textMuted }]}>{course.percent}</Text>
              </View>
            </View>
          ))
        ) : (
          reportCards.map((rc) => (
            <View
              key={rc.id}
              style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={styles.reportIconBox}>
                <FileText size={22} color={colors.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reportTerm, { color: colors.text }]}>{rc.term}</Text>
                <Text style={[styles.reportDate, { color: colors.textMuted }]}>
                  Issued: {rc.date} • Term GPA: {rc.gpa}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert('Downloading', `Downloading official report card for ${rc.term}...`)}
              >
                <Download size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerPadding: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gpaCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpaLeft: {
    flex: 1.2,
  },
  gpaLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  gpaValue: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  gpaDivider: {
    width: 1,
    height: 48,
    marginHorizontal: 16,
  },
  gpaRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gpaStat: {
    alignItems: 'center',
  },
  subGpaNum: {
    fontSize: 18,
    fontWeight: '700',
  },
  subGpaLbl: {
    fontSize: 11,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginTop: 12,
  },
  tabBtn: {
    paddingVertical: 12,
    marginRight: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  courseCardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
  },
  teacherName: {
    fontSize: 12,
    marginTop: 2,
  },
  creditsText: {
    fontSize: 11,
    marginTop: 4,
  },
  gradeBadge: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#6366F112',
  },
  gradeLetter: {
    fontSize: 20,
    fontWeight: '800',
  },
  gradePercent: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  reportIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#6366F115',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTerm: {
    fontSize: 14,
    fontWeight: '700',
  },
  reportDate: {
    fontSize: 12,
    marginTop: 2,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
