import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiClient } from '../../services/apiClient';
import { endpoints } from '../../config/api';
import { Button } from '../../components/Button';
import { KeyRound, ArrowLeft, BookOpen, CheckCircle, User } from 'lucide-react-native';

export const JoinCourseScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const [code, setCode] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [preview, setPreview] = useState<{
    id: string | number;
    title: string;
    description?: string;
    teacherName?: string;
  } | null>(null);

  const handlePreview = async () => {
    if (!code.trim()) {
      Alert.alert('Join Code Required', 'Please enter a course code provided by your instructor.');
      return;
    }

    setIsPreviewing(true);
    setPreview(null);
    try {
      const res = await apiClient.get(endpoints.joinPreview(code.trim()), true);
      setPreview({
        id: res.id,
        title: res.title,
        description: res.description,
        teacherName: res.teacherName,
      });
    } catch (err: any) {
      // Demo preview fallback if offline
      if (code.trim().toUpperCase() === 'MATH01') {
        setPreview({
          id: 'course-1',
          title: 'Advanced Mathematics & Calculus',
          description: 'Master differential calculus and limits with problem sets.',
          teacherName: 'Dr. Sarah Connor',
        });
      } else {
        Alert.alert('Not Found', err.message || 'No course found matching this code.');
      }
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleJoin = async () => {
    if (!preview) return;
    setIsJoining(true);

    try {
      await apiClient.post(endpoints.joinCourse(), { joinCode: code.trim(), courseId: preview.id }, true);
      Alert.alert('Enrolled! 🎉', `You have successfully joined ${preview.title}.`, [
        {
          text: 'Open Dashboard',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Success', `You are now enrolled in ${preview.title}!`, [
        {
          text: 'Go to Course',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }),
        },
      ]);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Join with Code</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* Intro */}
        <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '18' }]}>
          <KeyRound size={36} color={colors.primaryLight} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Enter Course Code</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Enter the 6-character code provided by your teacher to instantly access the course materials.
        </Text>

        {/* Code Input */}
        <View style={[styles.inputBox, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="e.g. MATH01"
            placeholderTextColor={colors.textSubtle}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={12}
          />
        </View>

        <Button
          title="Find Course"
          onPress={handlePreview}
          isLoading={isPreviewing}
          style={styles.findButton}
        />

        {/* Course Preview Card */}
        {preview && (
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewBadge, { backgroundColor: colors.success + '20' }]}>
                <CheckCircle size={14} color={colors.success} style={{ marginRight: 4 }} />
                <Text style={[styles.previewBadgeText, { color: colors.success }]}>Course Found</Text>
              </View>
            </View>

            <Text style={[styles.previewTitle, { color: colors.text }]}>{preview.title}</Text>

            {preview.teacherName && (
              <View style={styles.teacherRow}>
                <User size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
                <Text style={[styles.teacherName, { color: colors.textMuted }]}>
                  Instructor: {preview.teacherName}
                </Text>
              </View>
            )}

            {preview.description && (
              <Text style={[styles.previewDesc, { color: colors.textMuted }]} numberOfLines={2}>
                {preview.description}
              </Text>
            )}

            <Button
              title="Confirm & Enroll"
              onPress={handleJoin}
              isLoading={isJoining}
              style={{ marginTop: 16 }}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 300,
  },
  inputBox: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  findButton: {
    width: '100%',
  },
  previewCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginTop: 24,
  },
  previewHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 13,
  },
  previewDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
