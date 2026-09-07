import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { courseService, Course, Lesson } from '../../services/course.service';
import { Button } from '../../components/Button';
import {
  ArrowLeft,
  PlayCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';

export const CourseDetailScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const course: Course = route.params?.course;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);

  useEffect(() => {
    if (course?.id) {
      courseService
        .getCourseLessons(course.id)
        .then(data => setLessons(data))
        .finally(() => setIsLoadingLessons(false));
    }
  }, [course?.id]);

  const handleEnroll = () => {
    if (lessons.length > 0) {
      navigation.navigate('LessonViewer', {
        lesson: lessons[0],
        courseTitle: course.title,
      });
    } else {
      navigation.navigate('Subscription');
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    navigation.navigate('LessonViewer', {
      lesson,
      courseTitle: course.title,
    });
  };

  if (!course) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Course not found.</Text>
      </View>
    );
  }

  const instructor = course.instructorName || course.teacherName || 'Acadize Faculty';
  const priceDisplay = course.price ? `${course.price} EGP` : 'Included in Plan';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Sticky Back Button */}
      <TouchableOpacity
        style={[styles.floatingBack, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={20} color={colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <Image
          source={{
            uri:
              course.thumbnailUrl ||
              course.imageUrl ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
          }}
          style={styles.heroImage}
        />

        <View style={styles.body}>
          {/* Category & Price */}
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.categoryText, { color: colors.primaryLight }]}>
                {course.category || 'Curriculum'}
              </Text>
            </View>
            <Text style={[styles.price, { color: colors.success }]}>{priceDisplay}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>

          {/* Instructor & Stats */}
          <View style={[styles.metaBar, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.instructorText, { color: colors.textMuted }]}>
              Instructor: <Text style={{ color: colors.text, fontWeight: '600' }}>{instructor}</Text>
            </Text>
            <View style={styles.lessonCountBadge}>
              <BookOpen size={14} color={colors.textSubtle} />
              <Text style={[styles.lessonCountText, { color: colors.textMuted }]}>
                {lessons.length || course.totalLessons || 0} Lessons
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.sectionHeading, { color: colors.text }]}>About This Course</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            {course.description ||
              'Master this subject through structured lectures, downloadable course notes, and self-assessment evaluations designed by Acadize.'}
          </Text>

          {/* Syllabus / Lessons */}
          <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 24 }]}>
            Course Syllabus
          </Text>

          {isLoadingLessons ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            lessons.map((l, index) => (
              <TouchableOpacity
                key={l.id}
                style={[
                  styles.lessonItem,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                onPress={() => handleSelectLesson(l)}
              >
                <View style={styles.lessonIndexBadge}>
                  <Text style={[styles.lessonIndexText, { color: colors.primaryLight }]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.lessonTitle, { color: colors.text }]} numberOfLines={1}>
                    {l.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Clock size={12} color={colors.textSubtle} style={{ marginRight: 4 }} />
                    <Text style={[styles.durationText, { color: colors.textSubtle }]}>
                      {l.durationMinutes || 45} mins
                    </Text>
                  </View>
                </View>
                <PlayCircle size={24} color={colors.primaryLight} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Floating Enroll Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
        <View>
          <Text style={[styles.bottomPriceLabel, { color: colors.textMuted }]}>Course Access</Text>
          <Text style={[styles.bottomPrice, { color: colors.text }]}>{priceDisplay}</Text>
        </View>
        <Button
          title="Start Learning"
          onPress={handleEnroll}
          style={styles.enrollButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  floatingBack: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#1E293B',
  },
  body: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 12,
  },
  metaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  instructorText: {
    fontSize: 13,
  },
  lessonCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonCountText: {
    fontSize: 13,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  lessonIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonIndexText: {
    fontSize: 14,
    fontWeight: '700',
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  enrollButton: {
    width: 170,
    height: 48,
  },
});
