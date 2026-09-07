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
  GraduationCap,
  Clock,
  HelpCircle,
  Play,
  CheckCircle2,
  Award,
  BookOpen,
} from 'lucide-react-native';

interface ExamItem {
  id: string;
  title: string;
  course: string;
  durationMinutes: number;
  questionCount: number;
  status: 'available' | 'completed' | 'upcoming';
  score?: number;
  totalPoints: number;
  dueDate: string;
}

export const StudentExamsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  const exams: ExamItem[] = [
    {
      id: '1',
      title: 'Midterm Assessment: Differential Calculus',
      course: 'Advanced Calculus',
      durationMinutes: 60,
      questionCount: 25,
      status: 'available',
      totalPoints: 100,
      dueDate: 'Due in 2 days',
    },
    {
      id: '2',
      title: 'Thermodynamics & Waves Quiz',
      course: 'AP Physics C',
      durationMinutes: 45,
      questionCount: 20,
      status: 'available',
      totalPoints: 50,
      dueDate: 'Due Oct 12',
    },
    {
      id: '3',
      title: 'Periodic Trends & Chemical Bonding',
      course: 'Chemistry Honors',
      durationMinutes: 50,
      questionCount: 30,
      status: 'completed',
      score: 92,
      totalPoints: 100,
      dueDate: 'Completed Sep 28',
    },
    {
      id: '4',
      title: 'Algebra 2: Quadratics & Polynomials',
      course: 'Algebra Fundamentals',
      durationMinutes: 60,
      questionCount: 25,
      status: 'completed',
      score: 88,
      totalPoints: 100,
      dueDate: 'Completed Sep 15',
    },
  ];

  const filtered = exams.filter((e) => {
    if (filter === 'available') return e.status === 'available';
    if (filter === 'completed') return e.status === 'completed';
    return true;
  });

  const handleStartExam = (exam: ExamItem) => {
    Alert.alert(
      'Start Examination',
      `You are about to start "${exam.title}". Duration: ${exam.durationMinutes} minutes. Anti-cheat and timed monitoring will be active.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Now',
          onPress: () => Alert.alert('Exam Mode', 'Exam interface initiated.'),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Exams & Quizzes" subtitle="Timed assessments & score reviews" />

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['all', 'available', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? colors.primary : colors.card,
                borderColor: filter === f ? colors.primary : colors.cardBorder,
              },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filter === f ? '#FFFFFF' : colors.textMuted },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filtered.map((exam) => (
          <View
            key={exam.id}
            style={[styles.examCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={styles.examCardHeader}>
              <View style={[styles.coursePill, { backgroundColor: colors.background }]}>
                <BookOpen size={12} color={colors.primaryLight} />
                <Text style={[styles.courseText, { color: colors.textMuted }]}>{exam.course}</Text>
              </View>

              {exam.status === 'available' ? (
                <View style={[styles.badge, { backgroundColor: '#F59E0B20' }]}>
                  <Clock size={12} color="#F59E0B" />
                  <Text style={[styles.badgeText, { color: "#F59E0B" }]}>Available</Text>
                </View>
              ) : (
                <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
                  <CheckCircle2 size={12} color="#10B981" />
                  <Text style={[styles.badgeText, { color: "#10B981" }]}>
                    Score: {exam.score}/{exam.totalPoints}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.examTitle, { color: colors.text }]}>{exam.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  {exam.durationMinutes} mins
                </Text>
              </View>
              <View style={styles.metaItem}>
                <HelpCircle size={14} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  {exam.questionCount} Questions
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Award size={14} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  {exam.totalPoints} Points
                </Text>
              </View>
            </View>

            <View style={[styles.cardFooter, { borderTopColor: colors.divider }]}>
              <Text style={[styles.dueText, { color: colors.textMuted }]}>{exam.dueDate}</Text>
              {exam.status === 'available' ? (
                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: colors.primary }]}
                  onPress={() => handleStartExam(exam)}
                >
                  <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.startBtnText}>Start Exam</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.reviewBtn, { borderColor: colors.primary }]}
                  onPress={() => Alert.alert('Review', `Viewing analysis for ${exam.title}`)}
                >
                  <Text style={[styles.reviewBtnText, { color: colors.primaryLight }]}>
                    Review Answers
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    gap: 14,
  },
  examCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coursePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  courseText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  dueText: {
    fontSize: 12,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  reviewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  reviewBtnText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
