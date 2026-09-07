import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import {
  Award,
  Flame,
  Sparkles,
  Trophy,
  Medal,
  Target,
  Zap,
  CheckCircle2,
} from 'lucide-react-native';

export const StudentGamificationScreen = () => {
  const { colors } = useTheme();
  const [tab, setTab] = useState<'overview' | 'badges' | 'leaderboard'>('overview');

  const badges = [
    { id: 'b1', name: 'Calculus Pioneer', desc: 'Completed 10 Calculus Problem Sets', icon: Trophy, unlocked: true },
    { id: 'b2', name: '7-Day Streak Master', desc: 'Maintained continuous daily study for 7 days', icon: Flame, unlocked: true },
    { id: 'b3', name: 'Bug Hunter', desc: 'Corrected 15 mistakes in the Mistakes Notebook', icon: Zap, unlocked: true },
    { id: 'b4', name: 'Exam Ace', desc: 'Scored 95%+ on 3 official examinations', icon: Award, unlocked: false },
    { id: 'b5', name: 'Collaborator', desc: 'Participated in 5 study group discussion sessions', icon: Medal, unlocked: false },
  ];

  const leaderboard = [
    { rank: 1, name: 'Karim Mostafa', xp: 2450, badge: '🥇' },
    { rank: 2, name: 'Layla El-Sayed', xp: 2180, badge: '🥈' },
    { rank: 3, name: 'Omar Farouk', xp: 1950, badge: '🥉' },
    { rank: 4, name: 'You (Alex Smith)', xp: 1840, badge: '⭐' },
    { rank: 5, name: 'Nour Hassan', xp: 1720, badge: '✨' },
    { rank: 6, name: 'Ziad Mansour', xp: 1610, badge: '⚡' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Achievements & XP" subtitle="XP progress, badges & class leaderboard" />

      {/* Tabs */}
      <View style={[styles.tabsRow, { borderBottomColor: colors.divider }]}>
        {(['overview', 'badges', 'leaderboard'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.primaryLight : colors.textMuted }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {tab === 'overview' && (
          <>
            {/* Level Card */}
            <View style={[styles.levelCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.levelTop}>
                <View>
                  <Text style={[styles.levelSub, { color: colors.textMuted }]}>CURRENT RANK</Text>
                  <Text style={[styles.levelTitle, { color: colors.text }]}>Level 4 • Scholar</Text>
                </View>
                <View style={[styles.xpPill, { backgroundColor: '#6366F120' }]}>
                  <Sparkles size={16} color="#6366F1" />
                  <Text style={{ color: '#6366F1', fontWeight: '800', fontSize: 13 }}>1,840 XP</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.barBox}>
                <View style={[styles.barBackground, { backgroundColor: colors.background }]}>
                  <View style={[styles.barFill, { width: '72%', backgroundColor: colors.primary }]} />
                </View>
                <View style={styles.barMeta}>
                  <Text style={[styles.barMetaText, { color: colors.textSubtle }]}>1,840 / 2,500 XP</Text>
                  <Text style={[styles.barMetaText, { color: colors.primaryLight }]}>660 XP to Level 5</Text>
                </View>
              </View>
            </View>

            {/* Streak card */}
            <View style={[styles.streakCard, { backgroundColor: '#FEF3C720', borderColor: '#F59E0B40' }]}>
              <View style={styles.streakIconBox}>
                <Flame size={28} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.streakTitle, { color: colors.text }]}>5-Day Active Streak</Text>
                <Text style={[styles.streakSub, { color: colors.textMuted }]}>
                  Complete 1 lesson today to keep your streak alive and earn +50 XP bonus!
                </Text>
              </View>
            </View>

            {/* Active Quests */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Quests</Text>
            <View style={[styles.questCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.questRow}>
                <CheckCircle2 size={18} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.questTitle, { color: colors.text }]}>Answer 5 AI Study Buddy queries</Text>
                  <Text style={[styles.questSub, { color: colors.textMuted }]}>Reward: +30 XP</Text>
                </View>
                <Text style={{ color: '#10B981', fontWeight: '700', fontSize: 12 }}>Completed</Text>
              </View>

              <View style={[styles.questDivider, { backgroundColor: colors.divider }]} />

              <View style={styles.questRow}>
                <Target size={18} color={colors.primaryLight} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.questTitle, { color: colors.text }]}>Complete 1 practice quiz</Text>
                  <Text style={[styles.questSub, { color: colors.textMuted }]}>Reward: +60 XP</Text>
                </View>
                <Text style={{ color: colors.primaryLight, fontWeight: '700', fontSize: 12 }}>In Progress</Text>
              </View>
            </View>
          </>
        )}

        {tab === 'badges' && (
          <View style={styles.badgeList}>
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <View
                  key={b.id}
                  style={[
                    styles.badgeItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: b.unlocked ? colors.primary + '50' : colors.cardBorder,
                      opacity: b.unlocked ? 1 : 0.6,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badgeIconWrap,
                      { backgroundColor: b.unlocked ? '#6366F125' : colors.background },
                    ]}
                  >
                    <Icon size={24} color={b.unlocked ? colors.primaryLight : colors.textSubtle} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.badgeName, { color: colors.text }]}>{b.name}</Text>
                    <Text style={[styles.badgeDesc, { color: colors.textMuted }]}>{b.desc}</Text>
                  </View>
                  {b.unlocked ? (
                    <View style={[styles.unlockedPill, { backgroundColor: '#10B98120' }]}>
                      <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>Unlocked</Text>
                    </View>
                  ) : (
                    <View style={[styles.unlockedPill, { backgroundColor: colors.background }]}>
                      <Text style={{ color: colors.textSubtle, fontSize: 11, fontWeight: '600' }}>Locked</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {tab === 'leaderboard' && (
          <View style={[styles.leadCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {leaderboard.map((item, index) => {
              const isMe = item.name.includes('You');
              return (
                <View
                  key={item.rank}
                  style={[
                    styles.leadRow,
                    isMe && { backgroundColor: colors.primary + '18' },
                    index < leaderboard.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 },
                  ]}
                >
                  <Text style={styles.leadBadge}>{item.badge}</Text>
                  <Text style={[styles.leadRank, { color: colors.textMuted }]}>#{item.rank}</Text>
                  <Text style={[styles.leadName, { color: isMe ? colors.primaryLight : colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.leadXp, { color: colors.text }]}>{item.xp.toLocaleString()} XP</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tabBtn: {
    paddingVertical: 12,
    marginRight: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    padding: 16,
    gap: 14,
  },
  levelCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  levelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  barBox: {
    gap: 6,
  },
  barBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barMetaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  streakIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  streakSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  questCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  questSub: {
    fontSize: 11,
    marginTop: 2,
  },
  questDivider: {
    height: 1,
  },
  badgeList: {
    gap: 10,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  unlockedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  leadCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  leadBadge: {
    fontSize: 18,
  },
  leadRank: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
  },
  leadName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  leadXp: {
    fontSize: 13,
    fontWeight: '700',
  },
});
