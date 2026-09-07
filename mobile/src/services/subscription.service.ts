import { apiClient } from './apiClient';
import { endpoints } from '../config/api';

export interface SubscriptionStatus {
  hasAccess: boolean;
  status: 'active' | 'trial' | 'expired' | 'inactive' | 'not_required' | 'admin';
  expiresAt?: string;
  plan?: string;
  daysRemaining?: number;
}

export interface PromoValidationResult {
  valid: boolean;
  trialDays?: number;
  discount?: number;
  description?: string;
  message?: string;
  code?: string;
}

export interface CheckoutResult {
  status?: string;
  order_id?: string | number;
  paymobOrderId?: number;
  paymentToken?: string;
  iframeUrl?: string;
  checkout_url?: string;
  url?: string;
}

export const subscriptionService = {
  async getStatus(): Promise<SubscriptionStatus> {
    try {
      return await apiClient.get<SubscriptionStatus>(endpoints.subscriptionStatus(), true);
    } catch {
      return {
        hasAccess: false,
        status: 'inactive',
      };
    }
  },

  async validatePromoCode(code: string, plan: 'monthly' | 'annual' = 'annual'): Promise<PromoValidationResult> {
    return await apiClient.post<PromoValidationResult>(
      endpoints.validatePromo(),
      { code, plan },
      true
    );
  },

  async activateTrial(promoCode: string): Promise<{ message: string }> {
    return await apiClient.post(
      endpoints.activateTrial(),
      { code: promoCode },
      true
    );
  },

  async activateFreeTrial(userId: string, organizationId: string): Promise<{ message: string }> {
    return await apiClient.post(
      endpoints.activateFreeTrial(),
      { userId, organizationId },
      false
    );
  },

  /**
   * Initiates Paymob payment session on backend
   * Returns iframeUrl or checkout_url to open in WebView
   */
  async createCheckout(billingCycle: 'monthly' | 'annual', promoCode?: string): Promise<CheckoutResult> {
    return await apiClient.post<CheckoutResult>(
      endpoints.checkout(),
      {
        billingCycle,
        promoCode: promoCode || undefined,
      },
      true
    );
  },
};
