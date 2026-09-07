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
  Brain,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react-native';

export const StudentMistakesScreen = () => {
  const { colors } = useTheme();

  const mistakes = [
    {
      id: 'm1',
      course: 'Advanced Calculus',
      topic: 'Chain Rule with Trig Functions',
      question: 'Find the derivative of f(x) = sin(x² + 3x)',
      yourAnswer: 'cos(x² + 3x)',
      correctAnswer: '(2x + 3) · cos(x² + 3x)',
      aiExplanation:
        'You computed the outer derivative cos(u) correctly, but missed multiplying by the inner derivative du/dx = (2x + 3). Remember: d/dx[f(g(x))] = f’(g(x)) · g’(x).',
      frequency: 2,
    },
    {
      id: 'm2',
      course: 'AP Physics C',
      topic: 'Conservation of Angular Momentum',
      question: 'When a figure skater pulls in her arms, what happens to kinetic energy?',
      yourAnswer: 'Remains constant',
      correctAnswer: 'Increases (work is done pulling arms inward)',
      aiExplanation:
        'Angular momentum L is conserved, but rotational kinetic energy K = L² / (2I). As moment of inertia I decreases, K increases because the skater does internal mechanical work.',
      frequency: 1,
    },
  ];

  const handlePractice = (topic: string) => {
    Alert.alert(
      'AI Practice Generated',
      `Versa AI has generated 3 targeted practice questions for "${topic}". Ready to solve?`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Start Practice', onPress: () => Alert.alert('Practice', 'Launching targeted practice session...') },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Mistakes Notebook" subtitle="AI diagnostics on past errors & retakes" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner */}
        <View style={[styles.aiBanner, { backgroundColor: '#4F46E518', borderColor: '#4F46E540' }]}>
          <View style={styles.aiBannerIcon}>
            <Sparkles size={20} color="#818CF8" />
          </View>
          <View style={styles.aiBannerText}>
            <Text style={[styles.aiBannerTitle, { color: colors.text }]}>
              Adaptive Error Correction
            </Text>
            <Text style={[styles.aiBannerSub, { color: colors.textMuted }]}>
              Questions you missed are categorized here. Practice them to master tricky concepts.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Identified Weak Areas ({mistakes.length})
        </Text>

        {mistakes.map((m) => (
          <View
            key={m.id}
            style={[styles.mistakeCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.coursePill, { backgroundColor: colors.background }]}>
                <BookOpen size={12} color={colors.primaryLight} />
                <Text style={[styles.courseText, { color: colors.textMuted }]}>{m.course}</Text>
              </View>

              <View style={[styles.freqBadge, { backgroundColor: '#EF444420' }]}>
                <Text style={[styles.freqText, { color: '#EF4444' }]}>
                  Missed {m.frequency}x
                </Text>
              </View>
            </View>

            <Text style={[styles.topicTitle, { color: colors.primaryLight }]}>{m.topic}</Text>
            <Text style={[styles.questionText, { color: colors.text }]}>{m.question}</Text>

            {/* Answer comparison */}
            <View style={[styles.answersBox, { backgroundColor: colors.background }]}>
              <View style={styles.answerRow}>
                <XCircle size={14} color="#EF4444" />
                <Text style={[styles.answerLabel, { color: '#EF4444' }]}>Your Answer:</Text>
                <Text style={[styles.answerVal, { color: colors.textMuted }]}>{m.yourAnswer}</Text>
              </View>

              <View style={styles.answerRow}>
                <CheckCircle2 size={14} color="#10B981" />
                <Text style={[styles.answerLabel, { color: '#10B981' }]}>Correct Answer:</Text>
                <Text style={[styles.answerVal, { color: colors.text }]}>{m.correctAnswer}</Text>
              </View>
            </View>

            {/* AI Explanation */}
            <View style={[styles.explanationBox, { backgroundColor: '#6366F110', borderColor: '#6366F130' }]}>
              <View style={styles.explHeader}>
                <Brain size={14} color={colors.primaryLight} />
                <Text style={[styles.explTitle, { color: colors.primaryLight }]}>AI Diagnostic</Text>
              </View>
              <Text style={[styles.explBody, { color: colors.textMuted }]}>{m.aiExplanation}</Text>
            </View>

            {/* Practice Button */}
            <TouchableOpacity
              style={[styles.practiceBtn, { backgroundColor: colors.primary }]}
              onPress={() => handlePractice(m.topic)}
            >
              <RefreshCw size={14} color="#FFFFFF" />
              <Text style={styles.practiceBtnText}>Practice Similar Problem</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  aiBanner: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  aiBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#4F46E525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerText: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  aiBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  mistakeCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  freqBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freqText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  answersBox: {
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  answerVal: {
    fontSize: 12,
    fontWeight: '500',
  },
  explanationBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  explHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  explBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  practiceBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
