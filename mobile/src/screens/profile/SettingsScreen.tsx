import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  getApiUrl,
  setApiUrl,
  getTenantSubdomain,
  setTenantSubdomain,
  resetApiConfig,
  DEFAULT_API_URL,
  DEFAULT_TENANT_SUBDOMAIN,
} from '../../config/api';
import { Button } from '../../components/Button';
import { ArrowLeft, Server, Globe, RotateCcw, Save } from 'lucide-react-native';

export const SettingsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const [apiUrl, setApiUrlState] = useState(getApiUrl());
  const [tenant, setTenantState] = useState(getTenantSubdomain());

  const handleSave = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'API URL cannot be empty.');
      return;
    }

    await setApiUrl(apiUrl);
    await setTenantSubdomain(tenant || 'default');
    Alert.alert('Settings Saved', 'Backend API configuration updated successfully.');
  };

  const handleReset = async () => {
    await resetApiConfig();
    setApiUrlState(DEFAULT_API_URL);
    setTenantState(DEFAULT_TENANT_SUBDOMAIN);
    Alert.alert('Reset Complete', `Restored default production settings (${DEFAULT_API_URL}).`);
  };

  const handlePreset = (url: string) => {
    setApiUrlState(url);
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>API & Server</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Server size={24} color={colors.primaryLight} style={{ marginBottom: 8 }} />
          <Text style={[styles.infoTitle, { color: colors.text }]}>Backend Configuration</Text>
          <Text style={[styles.infoSubtitle, { color: colors.textMuted }]}>
            Connect your mobile app directly to your production Acadize server, local computer (Wi-Fi IP), or Ngrok tunnel.
          </Text>
        </View>

        {/* API URL Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Backend API URL</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={apiUrl}
            onChangeText={setApiUrlState}
            placeholder="https://eduverse-20jy.onrender.com/api"
            placeholderTextColor={colors.textSubtle}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Quick presets */}
        <Text style={[styles.presetLabel, { color: colors.textMuted }]}>Quick Presets:</Text>
        <View style={styles.presetsRow}>
          <TouchableOpacity
            style={[styles.presetChip, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => handlePreset('https://eduverse-20jy.onrender.com/api')}
          >
            <Text style={[styles.presetText, { color: colors.primaryLight }]}>Production API</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.presetChip, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => handlePreset('http://10.0.2.2:3001/api')}
          >
            <Text style={[styles.presetText, { color: colors.textMuted }]}>Android Emulator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.presetChip, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => handlePreset('http://192.168.1.15:3001/api')}
          >
            <Text style={[styles.presetText, { color: colors.textMuted }]}>Local Wi-Fi IP</Text>
          </TouchableOpacity>
        </View>

        {/* Organization / Tenant Subdomain */}
        <View style={[styles.inputGroup, { marginTop: 20 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Organization Subdomain</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={tenant}
            onChangeText={setTenantState}
            placeholder="default"
            placeholderTextColor={colors.textSubtle}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={[styles.hint, { color: colors.textSubtle }]}>
            Sent via 'x-tenant-subdomain' header for multi-tenancy.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 32, gap: 12 }}>
          <Button
            title="Save Configuration"
            icon={Save}
            onPress={handleSave}
          />

          <Button
            title="Restore Defaults"
            variant="outline"
            icon={RotateCcw}
            onPress={handleReset}
          />
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
