import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  studentService,
  AttendanceRecordItem,
} from '../../services/student.service';
import {
  CalendarCheck,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  X,
} from 'lucide-react-native';

export const StudentAttendanceScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<AttendanceRecordItem[]>([]);
  const [stats, setStats] = useState({
    overallRate: '100%',
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    total: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [scanning, setScanning] = useState(false);

  const loadAttendance = useCallback(async () => {
    try {
      const data = await studentService.getAttendanceHistory();
      setRecords(data.records);
      setStats(data.stats);
    } catch (error) {
      console.warn('Failed to load attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendance();
  };

  const handleCheckIn = async () => {
    if (!qrToken.trim()) {
      Alert.alert('Required', 'Please enter or scan the classroom session code.');
      return;
    }

    setScanning(true);
    try {
      const res = await studentService.scanQr(qrToken.trim());
      if (res.success) {
        Alert.alert('Checked In!', `You have been checked into ${res.sessionTitle || 'class'}! 🎉`);
        setModalVisible(false);
        setQrToken('');
        loadAttendance();
      } else {
        Alert.alert('Check-In Failed', res.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit QR check-in.');
    } finally {
      setScanning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return { text: 'Present', color: '#10B981', bg: '#10B98120', icon: CheckCircle2 };
      case 'late':
        return { text: 'Late', color: '#F59E0B', bg: '#F59E0B20', icon: Clock };
      default:
        return { text: 'Absent', color: '#EF4444', bg: '#EF444420', icon: XCircle };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Attendance" subtitle="Track your attendance & classroom check-ins" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading attendance records...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom + 24, 32) },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Check-in action banner */}
          <View
            style={[
              styles.checkInCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.checkInLeft}>
              <Text style={[styles.checkInTitle, { color: colors.text }]}>Class Check-In</Text>
              <Text style={[styles.checkInSub, { color: colors.textMuted }]}>
                Enter the active session QR code or token to mark your presence
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.scanBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <QrCode size={18} color="#FFFFFF" />
              <Text style={styles.scanBtnText}>Check In</Text>
            </TouchableOpacity>
          </View>

          {/* Attendance KPI Card */}
          <View
            style={[
              styles.statsCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.rateRow}>
              <View>
                <Text style={[styles.rateLabel, { color: colors.textMuted }]}>
                  OVERALL ATTENDANCE RATE
                </Text>
                <Text style={[styles.rateValue, { color: colors.primaryLight }]}>
                  {stats.overallRate}
                </Text>
              </View>
              <View style={[styles.rateBadge, { backgroundColor: '#10B98120' }]}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={[styles.rateBadgeText, { color: '#10B981' }]}>
                  {stats.presentCount} Sessions Attended
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

            <View style={styles.countsRow}>
              <View style={styles.countItem}>
                <Text style={[styles.countVal, { color: '#10B981' }]}>
                  {stats.presentCount}
                </Text>
                <Text style={[styles.countLbl, { color: colors.textMuted }]}>Present</Text>
              </View>
              <View style={styles.countItem}>
                <Text style={[styles.countVal, { color: '#F59E0B' }]}>
                  {stats.lateCount}
                </Text>
                <Text style={[styles.countLbl, { color: colors.textMuted }]}>Late</Text>
              </View>
              <View style={styles.countItem}>
                <Text style={[styles.countVal, { color: '#EF4444' }]}>
                  {stats.absentCount}
                </Text>
                <Text style={[styles.countLbl, { color: colors.textMuted }]}>Absent</Text>
              </View>
              <View style={styles.countItem}>
                <Text style={[styles.countVal, { color: colors.text }]}>
                  {stats.total}
                </Text>
                <Text style={[styles.countLbl, { color: colors.textMuted }]}>Total</Text>
              </View>
            </View>
          </View>

          {/* Attendance Log List */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 4 }]}>
            Attendance History ({records.length})
          </Text>

          {records.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <CalendarCheck size={40} color={colors.primaryLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Attendance Records Yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                Your classroom check-ins and session attendance will be logged here automatically.
              </Text>
            </View>
          ) : (
            records.map((log) => {
              const badge = getStatusBadge(log.status);
              const BadgeIcon = badge.icon;
              return (
                <View
                  key={log.id}
                  style={[
                    styles.logCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.logCourse, { color: colors.text }]}>
                      {log.courseTitle || log.sessionTitle || 'Class Session'}
                    </Text>
                    <View style={styles.logMetaRow}>
                      <Calendar size={12} color={colors.textMuted} />
                      <Text style={[styles.logMeta, { color: colors.textMuted }]}>
                        {log.sessionStart
                          ? new Date(log.sessionStart).toLocaleDateString()
                          : 'Recent'}
                      </Text>
                      {log.joinTime && (
                        <>
                          <Text style={[styles.logMeta, { color: colors.textSubtle }]}>•</Text>
                          <Clock size={12} color={colors.textMuted} />
                          <Text style={[styles.logMeta, { color: colors.textMuted }]}>
                            {new Date(log.joinTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <BadgeIcon size={12} color={badge.color} />
                    <Text style={[styles.statusText, { color: badge.color }]}>
                      {badge.text}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* QR Check-in Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Classroom QR Check-In
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: colors.textMuted }]}>
              Enter the session token displayed on your instructor's screen:
            </Text>

            <TextInput
              style={[
                styles.tokenInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. SESS-QR-8829"
              placeholderTextColor={colors.textSubtle}
              value={qrToken}
              onChangeText={setQrToken}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: colors.primary, opacity: scanning ? 0.7 : 1 },
              ]}
              onPress={handleCheckIn}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <CheckCircle2 size={16} color="#FFFFFF" />
              )}
              <Text style={styles.submitBtnText}>
                {scanning ? 'Verifying with Database...' : 'Confirm Presence'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  checkInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  checkInLeft: {
    flex: 1,
    gap: 4,
  },
  checkInTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  checkInSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  statsCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rateValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  rateBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  countItem: {
    alignItems: 'center',
    gap: 2,
  },
  countVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  countLbl: {
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  logCourse: {
    fontSize: 14,
    fontWeight: '700',
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  logMeta: {
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  tokenInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
