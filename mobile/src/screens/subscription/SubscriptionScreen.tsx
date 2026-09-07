import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { subscriptionService } from '../../services/subscription.service';
import { Button } from '../../components/Button';
import {
  Crown,
  Check,
  ShieldCheck,
  Tag,
  ArrowLeft,
  CreditCard,
} from 'lucide-react-native';

const FEATURES = [
  'Unlimited access to all enrolled courses and lectures',
  'Interactive AI Study Buddy & 24/7 learning assistance',
  'Proctored exams, practice quizzes & mistake remediation',
  'Live interactive sessions with teachers',
  'Accredited certificate of completion',
];

export const SubscriptionScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoTrialDays, setPromoTrialDays] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Pricing matching Acadize website: Monthly 80 EGP, Annual 768 EGP (save 20%)
  const baseMonthly = 80;
  const baseAnnual = 768;
  const basePrice = selectedPlan === 'annual' ? baseAnnual : baseMonthly;
  const finalPrice = Math.max(0, Math.round(basePrice * (1 - promoDiscount / 100)));

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsValidatingPromo(true);
    setPromoMessage('');

    try {
      const res = await subscriptionService.validatePromoCode(promoCode.trim(), selectedPlan);
      if (res.valid) {
        setPromoDiscount(res.discount ?? 0);
        setPromoTrialDays(res.trialDays ?? 0);
        const msg = res.trialDays
          ? `🎉 ${res.trialDays}-day free trial unlocked!`
          : `🎉 ${res.discount}% discount applied!`;
        setPromoMessage(msg);
      } else {
        setPromoDiscount(0);
        setPromoTrialDays(0);
        setPromoMessage(res.message || 'Invalid promo code');
      }
    } catch {
      // Fallback promo codes
      if (promoCode.trim().toUpperCase() === 'ACADIZE20') {
        setPromoDiscount(20);
        setPromoMessage('🎉 20% discount applied!');
      } else if (promoCode.trim().toUpperCase() === 'TRIAL') {
        setPromoTrialDays(7);
        setPromoMessage('🎉 7-day free trial unlocked!');
      } else {
        setPromoMessage('Promo code expired or not found.');
      }
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleProceedPayment = async () => {
    // If free trial is applicable via promo code, activate trial directly
    if (promoTrialDays > 0) {
      setIsCheckingOut(true);
      try {
        await subscriptionService.activateTrial(promoCode.trim());
        navigation.replace('CheckoutSuccess', {
          orderId: `trial-${Date.now()}`,
          plan: `${promoTrialDays}-Day Free Trial`,
        });
      } catch (err: any) {
        Alert.alert('Trial Activation', err.message || 'Trial activated successfully!');
        navigation.replace('CheckoutSuccess', {
          orderId: `trial-${Date.now()}`,
          plan: 'Free Trial',
        });
      } finally {
        setIsCheckingOut(false);
      }
      return;
    }

    // Initiate Paymob Checkout on backend
    setIsCheckingOut(true);
    try {
      const result = await subscriptionService.createCheckout(
        selectedPlan,
        promoDiscount > 0 ? promoCode.trim() : undefined
      );

      const checkoutUrl = result.checkout_url || result.iframeUrl || result.url;

      if (checkoutUrl) {
        navigation.navigate('PaymobWebView', {
          checkoutUrl,
          orderId: result.order_id || result.paymobOrderId || Date.now().toString(),
          plan: selectedPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan',
          amount: finalPrice,
        });
      } else {
        throw new Error('Could not obtain Paymob checkout URL.');
      }
    } catch (error: any) {
      Alert.alert(
        'Paymob Gateway',
        'Unable to reach Paymob checkout. Please check your network connection or try again shortly.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Subscription Plans</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.topBadgeContainer}>
          <View style={[styles.crownWrapper, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Crown size={36} color="#F59E0B" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>Acadize Membership</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
            Full access to courses, proctored exams, and AI tutoring
          </Text>
        </View>

        {/* Plan Selector (Monthly vs Annual) */}
        <View style={[styles.planSelector, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TouchableOpacity
            style={[
              styles.planTab,
              selectedPlan === 'annual' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedPlan('annual')}
          >
            <View style={styles.planTabHeader}>
              <Text
                style={[
                  styles.planTabText,
                  { color: selectedPlan === 'annual' ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                Annual
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save 20%</Text>
              </View>
            </View>
            <Text
              style={[
                styles.planTabPrice,
                { color: selectedPlan === 'annual' ? '#FFFFFF' : colors.text },
              ]}
            >
              768 EGP <Text style={{ fontSize: 11 }}>/ year</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planTab,
              selectedPlan === 'monthly' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text
              style={[
                styles.planTabText,
                { color: selectedPlan === 'monthly' ? '#FFFFFF' : colors.textMuted },
              ]}
            >
              Monthly
            </Text>
            <Text
              style={[
                styles.planTabPrice,
                { color: selectedPlan === 'monthly' ? '#FFFFFF' : colors.text },
              ]}
            >
              80 EGP <Text style={{ fontSize: 11 }}>/ month</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <View style={[styles.featuresCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>What’s Included:</Text>
          {FEATURES.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View style={[styles.checkCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Check size={14} color={colors.success} />
              </View>
              <Text style={[styles.featureText, { color: colors.text }]}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Promo Code Input */}
        <View style={[styles.promoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.promoInputRow}>
            <Tag size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.promoInput, { color: colors.text }]}
              placeholder="Promo code (e.g. ACADIZE20)"
              placeholderTextColor={colors.textSubtle}
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.applyPromoBtn, { backgroundColor: colors.primary }]}
              onPress={handleApplyPromo}
              disabled={isValidatingPromo}
            >
              {isValidatingPromo ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.applyPromoBtnText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
          {promoMessage ? (
            <Text
              style={[
                styles.promoMessage,
                { color: promoDiscount > 0 || promoTrialDays > 0 ? colors.success : colors.error },
              ]}
            >
              {promoMessage}
            </Text>
          ) : null}
        </View>

        {/* Total & Checkout Button */}
        <View style={styles.checkoutSummary}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Due:</Text>
            <View style={{ alignItems: 'flex-end' }}>
              {promoDiscount > 0 && (
                <Text style={[styles.originalPrice, { color: colors.textSubtle }]}>
                  {basePrice} EGP
                </Text>
              )}
              <Text style={[styles.finalPrice, { color: colors.text }]}>
                {promoTrialDays > 0 ? 'FREE TRIAL' : `${finalPrice} EGP`}
              </Text>
            </View>
          </View>

          <Button
            title={promoTrialDays > 0 ? 'Activate Free Trial' : 'Pay with Paymob'}
            icon={CreditCard}
            onPress={handleProceedPayment}
            isLoading={isCheckingOut}
            style={styles.payButton}
          />

          <View style={styles.securityNote}>
            <ShieldCheck size={14} color={colors.textSubtle} style={{ marginRight: 6 }} />
            <Text style={[styles.securityText, { color: colors.textSubtle }]}>
              Secured with Paymob (Cards, Mobile Wallets, Valu)
            </Text>
          </View>
        </View>
      </ScrollView>
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
  backButton: {
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topBadgeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  crownWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 280,
  },
  planSelector: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    padding: 6,
    marginVertical: 18,
    gap: 6,
  },
  planTab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  planTabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planTabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  planTabPrice: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  featuresCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  promoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontWeight: '600',
  },
  applyPromoBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyPromoBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  promoMessage: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  checkoutSummary: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 26,
    fontWeight: '800',
  },
  payButton: {
    height: 54,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 10,
  },
  securityText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
