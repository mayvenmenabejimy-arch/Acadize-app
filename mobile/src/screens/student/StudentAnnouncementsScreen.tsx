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
  Megaphone,
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  ChevronRight,
} from 'lucide-react-native';

export const StudentAnnouncementsScreen = () => {
  const { colors } = useTheme();

  const announcements = [
    {
      id: 'a1',
      title: 'Midterm Examination Schedule Released',
      content:
        'The official timetable for Midterm Examinations has been posted. Please review all scheduled dates and times carefully. Proctored sessions will begin promptly on Monday.',
      date: 'Today, 10:30 AM',
      author: 'Academic Administration',
      priority: 'high',
    },
    {
      id: 'a2',
      title: 'Science Fair 2026 Registration Open',
      content:
        'Submissions for the annual Acadize STEM Science Fair are now open. Projects in Artificial Intelligence, Physics, and Sustainable Tech can submit abstracts by Nov 1st.',
      date: 'Yesterday, 3:15 PM',
      author: 'Science Department',
      priority: 'normal',
    },
    {
      id: 'a3',
      title: 'Library System Scheduled Maintenance',
      content:
        'The digital library and online textbook repository will undergo regular server upgrades tonight from 12:00 AM to 02:00 AM UTC. Please save active notes.',
      date: 'Oct 3, 2026',
      author: 'IT Operations',
      priority: 'low',
    },
  ];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: '#EF4444', bg: '#EF444420', label: 'Urgent' };
      case 'normal':
        return { color: '#6366F1', bg: '#6366F120', label: 'Announcement' };
      default:
        return { color: '#10B981', bg: '#10B98120', label: 'Update' };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Announcements" subtitle="School-wide circulars & urgent notices" />

      <ScrollView contentContainerStyle={styles.container}>
        {announcements.map((item) => {
          const badge = getPriorityStyle(item.priority);
          return (
            <View
              key={item.id}
              style={[styles.annCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.priorityPill, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.priorityText, { color: badge.color }]}>{badge.label}</Text>
                </View>
                <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.date}</Text>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.body, { color: colors.textMuted }]}>{item.content}</Text>

              <View style={[styles.cardBottom, { borderTopColor: colors.divider }]}>
                <Text style={[styles.authorText, { color: colors.textSubtle }]}>
                  By {item.author}
                </Text>
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
  annCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
  },
  cardBottom: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
