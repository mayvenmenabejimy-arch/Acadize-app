import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  Users,
  Search,
  BookOpen,
  Award,
  ChevronRight,
  Mail,
} from 'lucide-react-native';

export const TeacherStudentsScreen = () => {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const students = [
    { id: '1', name: 'Alex Smith', email: 'alex@acadize.com', grade: 'Grade 11', course: 'Advanced Calculus', gpa: '3.85', attendance: '96%' },
    { id: '2', name: 'Layla El-Sayed', email: 'layla@acadize.com', grade: 'Grade 11', course: 'Advanced Calculus', gpa: '3.92', attendance: '98%' },
    { id: '3', name: 'Karim Mostafa', email: 'karim@acadize.com', grade: 'Grade 12', course: 'AP Physics C', gpa: '3.95', attendance: '100%' },
    { id: '4', name: 'Nour Hassan', email: 'nour@acadize.com', grade: 'Grade 10', course: 'Algebra Fundamentals', gpa: '3.70', attendance: '92%' },
    { id: '5', name: 'Omar Farouk', email: 'omar@acadize.com', grade: 'Grade 12', course: 'AP Physics C', gpa: '3.88', attendance: '94%' },
  ];

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Students Roster" subtitle="Enrolled students & individual academic progress" />

      {/* Search Input */}
      <View style={styles.searchBoxContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search students by name or course..."
            placeholderTextColor={colors.textSubtle}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.countText, { color: colors.textMuted }]}>
          Showing {filtered.length} Students
        </Text>

        {filtered.map((s) => (
          <View
            key={s.id}
            style={[styles.studentCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{s.name.charAt(0)}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{s.name}</Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {s.course} • {s.grade}
              </Text>
              <Text style={[styles.email, { color: colors.textSubtle }]}>{s.email}</Text>
            </View>

            <View style={styles.statsBox}>
              <Text style={[styles.gpaText, { color: colors.primaryLight }]}>GPA {s.gpa}</Text>
              <Text style={[styles.attendText, { color: '#10B981' }]}>{s.attendance} Att.</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
  },
  email: {
    fontSize: 11,
    marginTop: 2,
  },
  statsBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  gpaText: {
    fontSize: 13,
    fontWeight: '800',
  },
  attendText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
