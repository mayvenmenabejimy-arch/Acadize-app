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
  Video,
  Clock,
  Users,
  Calendar,
  Plus,
  Play,
  Share2,
} from 'lucide-react-native';

export const TeacherSessionsScreen = () => {
  const { colors } = useTheme();

  const sessions = [
    {
      id: 's1',
      title: 'Calculus: Derivatives Problem Solving & Q&A',
      course: 'Advanced Calculus',
      time: 'Today • 4:00 PM - 5:30 PM',
      isLiveNow: true,
      registeredStudents: 32,
      platform: 'Zoom Integrated',
    },
    {
      id: 's2',
      title: 'AP Physics C Mechanics Review',
      course: 'AP Physics C',
      time: 'Tomorrow • 11:00 AM - 12:30 PM',
      isLiveNow: false,
      registeredStudents: 26,
      platform: 'Zoom Integrated',
    },
    {
      id: 's3',
      title: 'Algebra 2 Office Hours',
      course: 'Algebra Fundamentals',
      time: 'Thursday • 2:00 PM - 3:00 PM',
      isLiveNow: false,
      registeredStudents: 15,
      platform: 'Zoom Integrated',
    },
  ];

  const handleStart = (session: any) => {
    Alert.alert(
      'Starting Live Session',
      `Launching Zoom classroom for "${session.title}". Students in ${session.course} are being notified!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Live Class Sessions"
        subtitle="Zoom integrated classroom & live webinars"
        rightAction={{
          icon: Plus,
          onPress: () => Alert.alert('New Session', 'Schedule live class modal open.'),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Scheduled Sessions</Text>
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('New Session', 'Schedule live class modal open.')}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.createBtnText}>Schedule Class</Text>
          </TouchableOpacity>
        </View>

        {sessions.map((s) => (
          <View
            key={s.id}
            style={[
              styles.sessionCard,
              { backgroundColor: colors.card, borderColor: s.isLiveNow ? '#EC4899' : colors.cardBorder },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.platformPill, { backgroundColor: colors.background }]}>
                <Video size={12} color={s.isLiveNow ? '#EC4899' : colors.primaryLight} />
                <Text style={[styles.platformText, { color: colors.textMuted }]}>{s.course}</Text>
              </View>

              {s.isLiveNow && (
                <View style={styles.liveNowBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveNowText}>READY TO START</Text>
                </View>
              )}
            </View>

            <Text style={[styles.sessionTitle, { color: colors.text }]}>{s.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={13} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>{s.time}</Text>
              </View>

              <View style={styles.metaItem}>
                <Users size={13} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textSubtle }]}>
                  {s.registeredStudents} Enrolled
                </Text>
              </View>
            </View>

            <View style={[styles.footer, { borderTopColor: colors.divider }]}>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => Alert.alert('Link Copied', 'Zoom classroom invite link copied to clipboard.')}
              >
                <Share2 size={16} color={colors.textMuted} />
                <Text style={[styles.shareBtnText, { color: colors.textMuted }]}>Invite Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.startBtn,
                  { backgroundColor: s.isLiveNow ? '#EC4899' : colors.primary },
                ]}
                onPress={() => handleStart(s)}
              >
                <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.startBtnText}>
                  {s.isLiveNow ? 'Host Session Now' : 'Open Room'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  sessionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
  },
  liveNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EC489920',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EC4899',
  },
  liveNowText: {
    color: '#EC4899',
    fontSize: 10,
    fontWeight: '800',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '600',
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
});
