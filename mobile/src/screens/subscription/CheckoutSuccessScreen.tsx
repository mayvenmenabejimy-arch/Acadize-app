import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/Button';
import { CheckCircle, Sparkles } from 'lucide-react-native';

export const CheckoutSuccessScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();

  const orderId: string = route.params?.orderId || `ORD-${Date.now()}`;
  const plan: string = route.params?.plan || 'Premium Membership';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {/* Animated Check Icon */}
        <View style={styles.iconWrapper}>
          <View style={[styles.glow, { backgroundColor: colors.success + '30' }]} />
          <View style={[styles.circle, { backgroundColor: colors.success }]}>
            <CheckCircle size={48} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>🎉 Payment Successful!</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Your subscription is now active. You have complete access to courses, exams, and AI tutoring!
        </Text>

        {/* Order Details */}
        <View style={[styles.detailsBox, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Plan:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{plan}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Reference / Order:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Status:</Text>
            <Text style={[styles.detailValue, { color: colors.success, fontWeight: '700' }]}>
              Active ✓
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <Button
          title="Return to Dashboard"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsBox: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionBtn: {
    width: '100%',
  },
});
