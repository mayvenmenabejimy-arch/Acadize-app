import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/Button';
import {
  User as UserIcon,
  Crown,
  Settings,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Shield,
  CreditCard,
  Mail,
} from 'lucide-react-native';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of Acadize?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const displayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Student';
  const role = (user?.role || 'student').toUpperCase();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Profile Header Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
        <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>

        <View style={[styles.roleBadge, { backgroundColor: colors.primary + '20' }]}>
          <Shield size={12} color={colors.primaryLight} style={{ marginRight: 4 }} />
          <Text style={[styles.roleText, { color: colors.primaryLight }]}>{role}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={[styles.menuSection, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {/* Subscription */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.divider }]}
          onPress={() => navigation.navigate('Subscription')}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Crown size={18} color="#D97706" />
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Subscription & Paymob</Text>
          <ChevronRight size={18} color={colors.textSubtle} />
        </TouchableOpacity>

        {/* Server & API Settings */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.divider }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#EEF2FF' }]}>
            <Settings size={18} color="#4F46E5" />
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>API & Server Settings</Text>
          <ChevronRight size={18} color={colors.textSubtle} />
        </TouchableOpacity>

        {/* Dark / Light Mode Toggle */}
        <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
          <View style={[styles.menuIconWrap, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
            {isDark ? (
              <Sun size={18} color="#FBBF24" />
            ) : (
              <Moon size={18} color="#4F46E5" />
            )}
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>
            Appearance: {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text style={[styles.themeHint, { color: colors.textSubtle }]}>Toggle</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Sign Out"
          variant="outline"
          icon={LogOut}
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuSection: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  themeHint: {
    fontSize: 13,
  },
});
