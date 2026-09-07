import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { notificationService, AppNotification } from '../../services/notification.service';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Video,
  Award,
  Flame,
  Megaphone,
  FileText,
  CheckCircle2,
} from 'lucide-react-native';

export const NotificationsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleItemPress = async (item: AppNotification) => {
    if (!item.isRead) {
      await notificationService.markAsRead(item.id);
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
  };

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'session':
        return <Video size={18} color="#EF4444" />;
      case 'grade':
        return <Award size={18} color="#10B981" />;
      case 'streak':
        return <Flame size={18} color="#F59E0B" />;
      case 'announcement':
        return <Megaphone size={18} color={colors.primaryLight} />;
      case 'assignment':
      default:
        return <FileText size={18} color={colors.secondary} />;
    }
  };

  const getIconBackground = (type?: string) => {
    switch (type) {
      case 'session':
        return 'rgba(239, 68, 68, 0.12)';
      case 'grade':
        return 'rgba(16, 185, 129, 0.12)';
      case 'streak':
        return 'rgba(245, 158, 11, 0.12)';
      case 'announcement':
        return 'rgba(99, 102, 241, 0.12)';
      case 'assignment':
      default:
        return 'rgba(6, 182, 212, 0.12)';
    }
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

        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={handleMarkAllRead}
        >
          <CheckCheck size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notifCard,
                {
                  backgroundColor: item.isRead ? colors.card : colors.card,
                  borderColor: item.isRead ? colors.cardBorder : colors.primary,
                  borderWidth: item.isRead ? 1 : 1.5,
                },
              ]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.8}
            >
              {/* Type Icon */}
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: getIconBackground(item.type) },
                ]}
              >
                {renderIcon(item.type)}
              </View>

              {/* Text content */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!item.isRead && (
                    <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                  )}
                </View>

                <Text style={[styles.message, { color: colors.textMuted }]} numberOfLines={3}>
                  {item.message}
                </Text>

                <View style={styles.cardBottomRow}>
                  {item.courseTitle ? (
                    <Text style={[styles.courseTag, { color: colors.primaryLight }]}>
                      {item.courseTitle}
                    </Text>
                  ) : null}
                  <Text style={[styles.timeText, { color: colors.textSubtle }]}>
                    {item.createdAt}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={48} color={colors.textSubtle} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                You have no new notifications right now.
              </Text>
            </View>
          }
        />
      )}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  notifCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTag: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 11,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
