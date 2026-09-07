import React from 'react';
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
  FileText,
  Download,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react-native';

export const ParentReportsScreen = () => {
  const { colors } = useTheme();

  const reports = [
    { id: '1', child: 'Alex Smith', term: 'Fall Term 2026 - Midterm Report Card', date: 'Oct 1, 2026', gpa: '3.85', status: 'Official' },
    { id: '2', child: 'Emma Smith', term: 'Fall Term 2026 - Progress Report', date: 'Oct 1, 2026', gpa: '3.92', status: 'Official' },
    { id: '3', child: 'Alex Smith', term: 'Spring Term 2026 - Final Transcript', date: 'Jun 15, 2026', gpa: '3.80', status: 'Archived' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Children’s Reports" subtitle="Official term report cards & transcripts" />

      <ScrollView contentContainerStyle={styles.container}>
        {reports.map((r) => (
          <View
            key={r.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.childBadge, { backgroundColor: colors.primary + '18' }]}>
                <Text style={[styles.childBadgeText, { color: colors.primaryLight }]}>{r.child}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>{r.status}</Text>
              </View>
            </View>

            <View style={styles.bodyRow}>
              <View style={[styles.iconWrap, { backgroundColor: '#6366F115' }]}>
                <FileText size={22} color={colors.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.termTitle, { color: colors.text }]}>{r.term}</Text>
                <Text style={[styles.dateText, { color: colors.textMuted }]}>
                  Issued: {r.date} • Cumulative GPA: {r.gpa}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Download', `Downloading PDF for ${r.term}`)}
            >
              <Download size={14} color="#FFFFFF" />
              <Text style={styles.downloadBtnText}>Download PDF</Text>
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
    gap: 14,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  childBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    marginTop: 3,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
