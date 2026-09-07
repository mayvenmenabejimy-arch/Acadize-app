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
import { Lesson } from '../../services/course.service';
import { Button } from '../../components/Button';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  FileText,
  Download,
  Share2,
} from 'lucide-react-native';

export const LessonViewerScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const lesson: Lesson = route.params?.lesson;
  const courseTitle: string = route.params?.courseTitle || 'Course';

  const [isCompleted, setIsCompleted] = useState(lesson?.isCompleted || false);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    Alert.alert('Congratulations! 🎉', 'You have marked this lesson as complete. Progress updated!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={[styles.courseSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {courseTitle}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {lesson?.title || 'Lesson Details'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => Alert.alert('Share', 'Share this lesson with your study group')}
        >
          <Share2 size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Video Player Placeholder */}
        <View style={styles.videoPlayer}>
          <View style={styles.playOverlay}>
            <View style={[styles.playCircle, { backgroundColor: colors.primary }]}>
              <Play size={28} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.videoMetaBar}>
            <Text style={styles.videoDuration}>{lesson?.durationMinutes || 45} mins • HD Video</Text>
          </View>
        </View>

        {/* Lesson Information */}
        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.text }]}>{lesson?.title}</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            {lesson?.description ||
              'In this session, we analyze fundamental equations and core principles with applied illustrations and interactive breakdowns.'}
          </Text>

          {/* Lesson Resources / Attachments */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Lesson Materials</Text>
          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => Alert.alert('PDF Resource', 'Downloading lesson summary notes...')}
          >
            <View style={[styles.resourceIcon, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
              <FileText size={20} color={colors.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Lecture Notes & Cheat Sheet
              </Text>
              <Text style={[styles.resourceSize, { color: colors.textMuted }]}>PDF • 2.4 MB</Text>
            </View>
            <Download size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Completion Button */}
          <View style={{ marginTop: 32 }}>
            <Button
              title={isCompleted ? 'Completed ✓' : 'Mark as Complete'}
              variant={isCompleted ? 'secondary' : 'primary'}
              onPress={handleMarkComplete}
              icon={CheckCircle2}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseSubtitle: {
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  videoPlayer: {
    width: '100%',
    height: 230,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  videoMetaBar: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoDuration: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  resourceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  resourceSize: {
    fontSize: 12,
    marginTop: 2,
  },
});
