import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  Calendar as CalendarIcon,
  Clock,
  Tag,
  ChevronRight,
  GraduationCap,
  CalendarCheck,
  Award,
} from 'lucide-react-native';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'exam' | 'holiday' | 'assignment' | 'workshop';
  location: string;
}

export const StudentCalendarScreen = () => {
  const { colors } = useTheme();

  const events: CalendarEvent[] = [
    {
      id: 'e1',
      title: 'Midterm Exam: Advanced Calculus',
      date: 'Oct 8, 2026',
      time: '10:00 AM - 11:30 AM',
      type: 'exam',
      location: 'Hall A / Online Proctored',
    },
    {
      id: 'e2',
      title: 'Rotational Dynamics Problem Set Due',
      date: 'Oct 15, 2026',
      time: '11:59 PM',
      type: 'assignment',
      location: 'Student Portal',
    },
    {
      id: 'e3',
      title: 'STEM Guest Workshop: Quantum Computing Intro',
      date: 'Oct 20, 2026',
      time: '04:00 PM - 05:30 PM',
      type: 'workshop',
      location: 'Auditorium / Zoom Stream',
    },
    {
      id: 'e4',
      title: 'Fall Mid-Semester Break (School Closed)',
      date: 'Oct 26 - Oct 28, 2026',
      time: 'All Day',
      type: 'holiday',
      location: 'Campus Wide',
    },
    {
      id: 'e5',
      title: 'Chemistry Honors Lab Exam',
      date: 'Nov 4, 2026',
      time: '01:30 PM - 03:00 PM',
      type: 'exam',
      location: 'Science Lab 101',
    },
  ];

  const getTypeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam':
        return { color: '#EF4444', bg: '#EF444420', label: 'Examination' };
      case 'assignment':
        return { color: '#F59E0B', bg: '#F59E0B20', label: 'Deadline' };
      case 'workshop':
        return { color: '#6366F1', bg: '#6366F120', label: 'Workshop' };
      default:
        return { color: '#10B981', bg: '#10B98120', label: 'Holiday' };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Academic Calendar" subtitle="Key dates, exam schedules & holidays" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Month Title */}
        <View style={styles.monthHeader}>
          <CalendarIcon size={20} color={colors.primaryLight} />
          <Text style={[styles.monthText, { color: colors.text }]}>October - November 2026</Text>
        </View>

        {events.map((item) => {
          const badge = getTypeStyle(item.type);
          return (
            <View
              key={item.id}
              style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={styles.eventCardTop}>
                <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.typeBadgeText, { color: badge.color }]}>{badge.label}</Text>
                </View>
                <Text style={[styles.eventDate, { color: colors.primaryLight }]}>{item.date}</Text>
              </View>

              <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={13} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.time}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Tag size={13} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSubtle }]}>{item.location}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
});
