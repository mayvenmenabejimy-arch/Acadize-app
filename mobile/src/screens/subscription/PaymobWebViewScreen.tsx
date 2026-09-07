import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';
import { X, ShieldCheck } from 'lucide-react-native';

export const PaymobWebViewScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();

  const checkoutUrl: string = route.params?.checkoutUrl;
  const orderId: string = route.params?.orderId || Date.now().toString();
  const plan: string = route.params?.plan || 'Subscription';

  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    Alert.alert(
      'Cancel Payment?',
      'Are you sure you want to leave the payment window? Your checkout will not be finalized.',
      [
        { text: 'Keep Paying', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleNavigationStateChange = (navState: any) => {
    const url: string = navState.url || '';

    // 1. Detect Successful payment redirection
    const isSuccess =
      url.includes('checkout-success') ||
      url.includes('success=true') ||
      url.includes('success=1') ||
      (url.includes('txn_response_code') && url.includes('approved'));

    if (isSuccess) {
      navigation.replace('CheckoutSuccess', {
        orderId,
        plan,
      });
      return;
    }

    // 2. Detect Payment failure / declined redirection
    const isFailed =
      url.includes('checkout-failed') ||
      url.includes('success=false') ||
      (url.includes('txn_response_code') && url.includes('declined'));

    if (isFailed) {
      Alert.alert('Payment Declined', 'The transaction could not be processed. Please try again or use another payment method.');
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Secure Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.secureHeader}>
          <ShieldCheck size={18} color={colors.success} style={{ marginRight: 6 }} />
          <Text style={[styles.secureTitle, { color: colors.text }]}>
            Paymob Secure Payment Gateway
          </Text>
        </View>

        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                Connecting to Paymob Gateway...
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    padding: 6,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B1120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    marginTop: 12,
    fontWeight: '500',
  },
});
