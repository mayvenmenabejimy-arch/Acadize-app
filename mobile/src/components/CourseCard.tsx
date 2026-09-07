import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Course } from '../services/course.service';
import { BookOpen, User as UserIcon } from 'lucide-react-native';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const { colors } = useTheme();

  const instructor = course.instructorName || course.teacherName || 'Acadize Faculty';
  const priceDisplay = course.price ? `${course.price} EGP` : 'Included';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{
          uri:
            course.thumbnailUrl ||
            course.imageUrl ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.categoryText, { color: colors.primaryLight }]}>
              {course.category || 'General'}
            </Text>
          </View>
          <Text style={[styles.priceText, { color: colors.success }]}>{priceDisplay}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {course.title}
        </Text>

        {course.description ? (
          <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
            {course.description}
          </Text>
        ) : null}

        <View style={[styles.footer, { borderTopColor: colors.divider }]}>
          <View style={styles.metaItem}>
            <UserIcon size={14} color={colors.textSubtle} />
            <Text style={[styles.metaText, { color: colors.textMuted }]} numberOfLines={1}>
              {instructor}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <BookOpen size={14} color={colors.textSubtle} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              {course.totalLessons || 10} Lessons
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#1E293B',
  },
  content: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    maxWidth: 160,
  },
});
