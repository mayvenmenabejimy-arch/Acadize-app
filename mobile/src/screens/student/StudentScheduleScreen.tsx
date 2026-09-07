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
  Clock,
  MapPin,
  User,
  BookOpen,
  Calendar as CalendarIcon,
} from 'lucide-react-native';

export const StudentScheduleScreen = () => {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const periods: Record<string, Array<{ time: string; course: string; room: string; teacher: string }>> = {
    Monday: [
      { time: '08:30 - 09:45 AM', course: 'Advanced Calculus', room: 'Hall 204', teacher: 'Dr. Sarah Connor' },
      { time: '10:00 - 11:15 AM', course: 'AP Physics C', room: 'Science Lab B', teacher: 'Prof. Mark Davis' },
      { time: '11:45 - 01:00 PM', course: 'Chemistry Honors', room: 'Lab 101', teacher: 'Dr. Emily Vance' },
      { time: '02:00 - 03:15 PM', course: 'Algebra Fundamentals', room: 'Room 302', teacher: 'Mr. Robert Taylor' },
    ],
    Tuesday: [
      { time: '09:00 - 10:15 AM', course: 'World History', room: 'Room 110', teacher: 'Ms. Linda Gomez' },
      { time: '10:30 - 11:45 AM', course: 'Advanced Calculus', room: 'Hall 204', teacher: 'Dr. Sarah Connor' },
      { time: '01:30 - 02:45 PM', course: 'Literature & Composition', room: 'Room 215', teacher: 'Mr. Adams' },
    ],
    Wednesday: [
      { time: '08:30 - 09:45 AM', course: 'AP Physics C Lab', room: 'Physics Lab A', teacher: 'Prof. Mark Davis' },
      { time: '10:00 - 11:15 AM', course: 'Algebra Fundamentals', room: 'Room 302', teacher: 'Mr. Robert Taylor' },
      { time: '01:00 - 02:15 PM', course: 'Chemistry Honors', room: 'Lab 101', teacher: 'Dr. Emily Vance' },
    ],
    Thursday: [
      { time: '09:00 - 10:15 AM', course: 'Advanced Calculus Problem Session', room: 'Hall 204', teacher: 'Dr. Sarah Connor' },
      { time: '10:30 - 11:45 AM', course: 'World History Seminar', room: 'Room 110', teacher: 'Ms. Linda Gomez' },
    ],
    Friday: [
      { time: '09:00 - 10:15 AM', course: 'AP Physics C', room: 'Science Lab B', teacher: 'Prof. Mark Davis' },
      { time: '10:30 - 11:45 AM', course: 'Weekly Review & Office Hours', room: 'Online Zoom', teacher: 'Multiple' },
    ],
  };

  const currentPeriods = periods[selectedDay] || [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Timetable & Schedule" subtitle="Weekly class schedule and classroom rooms" />

      {/* Days Selector */}
      <View style={styles.daysScrollBox}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysList}>
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Periods list */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.dayHeading, { color: colors.text }]}>
          {selectedDay} Classes ({currentPeriods.length})
        </Text>

        {currentPeriods.map((period, index) => (
          <View
            key={index}
            style={[styles.periodCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={[styles.periodNumber, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.periodNumText, { color: colors.primaryLight }]}>
                P{index + 1}
              </Text>
            </View>

            <View style={styles.periodDetails}>
              <Text style={[styles.courseTitle, { color: colors.text }]}>{period.course}</Text>

              <View style={styles.detailRow}>
                <Clock size={13} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textMuted }]}>{period.time}</Text>
              </View>

              <View style={styles.detailRow}>
                <MapPin size={13} color={colors.primaryLight} />
                <Text style={[styles.detailText, { color: colors.textMuted }]}>{period.room}</Text>
              </View>

              <View style={styles.detailRow}>
                <User size={13} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textSubtle }]}>{period.teacher}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  daysScrollBox: {
    paddingVertical: 12,
  },
  daysList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    padding: 16,
    gap: 12,
  },
  dayHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  periodCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    alignItems: 'center',
  },
  periodNumber: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNumText: {
    fontSize: 16,
    fontWeight: '800',
  },
  periodDetails: {
    flex: 1,
    gap: 4,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
  },
});
