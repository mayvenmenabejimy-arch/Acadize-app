import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { adminService, AdminUserRecord } from '../../services/admin.service';
import {
  Users,
  Search,
  Plus,
  Shield,
  GraduationCap,
  BookOpen,
  HeartHandshake,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';

export const AdminUsersScreen = () => {
  const { colors } = useTheme();
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'parent' | 'admin'>('all');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminService.getAllUsers({
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: query.trim() || undefined,
        limit: 50,
      });
      setUsers(res.users);
      setTotalCount(res.total);
    } catch (err) {
      console.warn('Error fetching live users:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [roleFilter, query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const newStatus = !user.isActive;
    Alert.alert(
      newStatus ? 'Activate User' : 'Deactivate User',
      `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} ${user.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await adminService.toggleUserStatus(user.id, newStatus);
              setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus, status: newStatus ? 'Active' : 'Inactive' } : u))
              );
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to update user status');
            }
          },
        },
      ]
    );
  };

  const getRoleBadge = (role: AdminUserRecord['role']) => {
    switch (role) {
      case 'teacher':
        return { color: '#F59E0B', bg: '#F59E0B20', label: 'Teacher' };
      case 'admin':
        return { color: '#EC4899', bg: '#EC489920', label: 'Admin' };
      case 'parent':
        return { color: '#8B5CF6', bg: '#8B5CF620', label: 'Parent' };
      default:
        return { color: '#6366F1', bg: '#6366F120', label: 'Student' };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Users Directory"
        subtitle="Manage accounts, roles & database users"
        rightAction={{
          icon: Plus,
          onPress: () =>
            Alert.alert(
              'Add User',
              'To add a user, register them or invite them through the registration flow.'
            ),
        }}
      />

      {/* Role Filter Chips */}
      <View style={styles.filterScrollBox}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {(['all', 'student', 'teacher', 'parent', 'admin'] as const).map((r) => {
            const isSelected = roleFilter === r;
            return (
              <TouchableOpacity
                key={r}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => setRoleFilter(r)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, username or email..."
            placeholderTextColor={colors.textSubtle}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Fetching live users from database...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={[styles.countText, { color: colors.textMuted }]}>
            Found {totalCount} Users in Database
          </Text>

          {users.length > 0 ? (
            users.map((u) => {
              const badge = getRoleBadge(u.role);
              return (
                <View
                  key={u.id}
                  style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: badge.color }]}>
                    <Text style={styles.avatarLetter}>{u.fullName.charAt(0).toUpperCase()}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.userName, { color: colors.text }]}>{u.fullName}</Text>
                      <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.roleText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>
                    <Text style={[styles.userEmail, { color: colors.textMuted }]}>{u.email}</Text>
                    <Text style={[styles.dateJoined, { color: colors.textSubtle }]}>
                      Created: {new Date(u.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Status Toggle Button */}
                  <TouchableOpacity
                    style={[
                      styles.statusToggleBtn,
                      { backgroundColor: u.isActive ? '#10B98118' : '#EF444418' },
                    ]}
                    onPress={() => handleToggleStatus(u)}
                  >
                    <Text
                      style={[
                        styles.statusToggleText,
                        { color: u.isActive ? '#10B981' : '#EF4444' },
                      ]}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Users size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No users found matching your criteria in the database.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
  },
  filterScrollBox: {
    paddingVertical: 10,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
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
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  dateJoined: {
    fontSize: 11,
    marginTop: 2,
  },
  statusToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
