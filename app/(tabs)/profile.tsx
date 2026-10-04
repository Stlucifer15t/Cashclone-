import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Platform,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useBank } from '../../context/BankContext';
import { formatAmount } from '../../utils/currency';
import Button from '../../components/Button';
import StatementModal from '../../components/StatementModal';
import ToastNotification from '../../components/ToastNotification';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = ['English (US)', 'Español', 'Français', 'Deutsch', '日本語'];

const SESSIONS = [
  { id: 's1', device: 'iPhone 15 Pro Max', location: 'New York, US', current: true },
  { id: 's2', device: 'MacBook Pro M3', location: 'New York, US', current: false },
  { id: 's3', device: 'iPad Pro 12.9"', location: 'London, UK', current: false },
];

export default function ProfileAndSettings() {
  const {
    state,
    activeAccount,
    updateProfile,
    updateSettings,
    toggleHideBalance,
    resetDemoData,
    depositCash,
  } = useBank();

  // Profile edit states
  const [name, setName] = useState(state.profile.name);
  const [cashtag, setCashtag] = useState(state.profile.cashtag);
  const [email, setEmail] = useState(state.profile.email);
  const [phone, setPhone] = useState(state.profile.phone);
  const [avatar, setAvatar] = useState<string | null>(state.profile.avatarUri || null);

  // Modals & Sheets
  const [statementVisible, setStatementVisible] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [activeSessions, setActiveSessions] = useState(SESSIONS);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showToast('Media permissions are needed to select an avatar');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setAvatar(uri);
        updateProfile({ avatarUri: uri });
        showToast('Profile photo updated!');
      }
    } catch (e) {
      console.warn('Avatar picker error:', e);
      showToast('Avatar selection cancelled');
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      name,
      cashtag: cashtag.startsWith('$') ? cashtag : `$${cashtag}`,
      email,
      phone,
      avatarUri: avatar || undefined,
    });
    showToast('Personal information updated!');
  };

  const handleSavePin = () => {
    if (pinInput.length !== 4) {
      showToast('PIN must be exactly 4 digits');
      return;
    }
    updateSettings({ pinCode: pinInput, isPinRequired: true });
    showToast('Security PIN code updated successfully!');
    setPinInput('');
    setPinModalVisible(false);
  };

  const handleRevokeSession = (sessionId: string, device: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast(`Revoked access for ${device}`);
  };

  const atmLimitPresets = [500, 1000, 1500, 2500];
  const onlineLimitPresets = [2500, 5000, 8000, 15000];

  return (
    <View style={commonStyles.container}>
      <ToastNotification message={toastMessage} onHide={() => setToastMessage(null)} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.contentMaxWidth}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings & Security</Text>
            <Text style={styles.subtitle}>
              Global banking preferences, card controls & hardware security
            </Text>
          </View>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>{name.charAt(0)}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={handlePickAvatar}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color="#000000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileCashtag}>{cashtag}</Text>
            <View style={styles.tierPill}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={styles.tierPillText}>{state.profile.tier} Member</Text>
            </View>

            {/* Editable Profile Inputs */}
            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Full Legal Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.fieldLabel}>Cashtag Identifier</Text>
              <TextInput
                style={styles.input}
                value={cashtag}
                onChangeText={setCashtag}
                placeholder="$handle"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />

              <Button
                text="Save Personal Details"
                onPress={handleSaveProfile}
                icon="save-outline"
                style={{ marginTop: 8 }}
              />
            </View>
          </View>

          {/* 1. SECURITY & PRIVACY SETTINGS */}
          <Text style={styles.sectionHeader}>Security & Privacy</Text>
          <View style={styles.settingsGroup}>
            {/* Biometrics */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="finger-print" size={20} color={colors.primary} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.settingTitle}>Biometric Verification</Text>
                  <Text style={styles.settingSub}>
                    Require FaceID / TouchID for transfers & app open
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.biometricsEnabled}
                onValueChange={(val) => {
                  updateSettings({ biometricsEnabled: val });
                  showToast(val ? 'FaceID / Fingerprint enabled' : 'Biometrics disabled');
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Privacy Discreet Balance */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="eye-off-outline" size={20} color={colors.text} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.settingTitle}>Discreet Mode (Hide Balances)</Text>
                  <Text style={styles.settingSub}>
                    Mask account balances in public places
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.isBalanceHidden}
                onValueChange={() => {
                  toggleHideBalance();
                  showToast(
                    state.settings.isBalanceHidden
                      ? 'Balances revealed'
                      : 'Balances masked (Discreet Mode)'
                  );
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Change 4-digit PIN */}
            <TouchableOpacity
              style={styles.settingRowClickable}
              onPress={() => setPinModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="key-outline" size={20} color={colors.warning} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.settingTitle}>App PIN Code</Text>
                  <Text style={styles.settingSub}>
                    Configured: •••• (Tap to modify security PIN)
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* 2. CARD LIMITS & CONTROLS */}
          <Text style={styles.sectionHeader}>Spending Limits & Card Controls</Text>
          <View style={styles.settingsGroup}>
            {/* Daily ATM Limit */}
            <View style={{ paddingVertical: 4 }}>
              <View style={styles.limitHeader}>
                <Text style={styles.settingTitle}>Daily ATM Cash Limit</Text>
                <Text style={styles.limitHighlight}>
                  {formatAmount(state.settings.atmDailyLimit, activeAccount.currency)} / day
                </Text>
              </View>
              <View style={styles.chipsRow}>
                {atmLimitPresets.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.chip,
                      state.settings.atmDailyLimit === l && styles.chipActive,
                    ]}
                    onPress={() => {
                      updateSettings({ atmDailyLimit: l });
                      showToast(`Daily ATM limit updated to $${l}`);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        state.settings.atmDailyLimit === l && styles.chipTextActive,
                      ]}
                    >
                      ${l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Monthly Online Limit */}
            <View style={{ paddingVertical: 4 }}>
              <View style={styles.limitHeader}>
                <Text style={styles.settingTitle}>Monthly Online Spend Limit</Text>
                <Text style={styles.limitHighlight}>
                  {formatAmount(state.settings.onlineMonthlyLimit, activeAccount.currency)} / mo
                </Text>
              </View>
              <View style={styles.chipsRow}>
                {onlineLimitPresets.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.chip,
                      state.settings.onlineMonthlyLimit === l && styles.chipActive,
                    ]}
                    onPress={() => {
                      updateSettings({ onlineMonthlyLimit: l });
                      showToast(`Monthly online limit updated to $${l.toLocaleString()}`);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        state.settings.onlineMonthlyLimit === l && styles.chipTextActive,
                      ]}
                    >
                      ${l >= 1000 ? `${l / 1000}k` : l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* International Payments */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="globe-outline" size={20} color={colors.secondary} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.settingTitle}>International Roaming & Payments</Text>
                  <Text style={styles.settingSub}>
                    Permit foreign POS & ATM transactions abroad
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.internationalPayments}
                onValueChange={(val) => {
                  updateSettings({ internationalPayments: val });
                  showToast(
                    val
                      ? 'International transactions permitted'
                      : 'International transactions blocked'
                  );
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Contactless NFC */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="radio" size={20} color={colors.primary} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.settingTitle}>Contactless NFC Tap-to-Pay</Text>
                  <Text style={styles.settingSub}>
                    Enable Apple Pay / Google Wallet NFC antenna
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.contactlessNFC}
                onValueChange={(val) => {
                  updateSettings({ contactlessNFC: val });
                  showToast(val ? 'Contactless NFC enabled' : 'Contactless NFC disabled');
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* 3. NOTIFICATION PREFERENCES */}
          <Text style={styles.sectionHeader}>Push Notifications</Text>
          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="cash-outline" size={18} color={colors.primary} />
                <Text style={[styles.settingTitle, { marginLeft: 10 }]}>Instant Transaction Receipts</Text>
              </View>
              <Switch
                value={state.settings.notifications.transactions}
                onValueChange={(val) => {
                  updateSettings({
                    notifications: { ...state.settings.notifications, transactions: val },
                  });
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-outline" size={18} color={colors.secondary} />
                <Text style={[styles.settingTitle, { marginLeft: 10 }]}>Security & Login Alerts</Text>
              </View>
              <Switch
                value={state.settings.notifications.security}
                onValueChange={(val) => {
                  updateSettings({
                    notifications: { ...state.settings.notifications, security: val },
                  });
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
                <Text style={[styles.settingTitle, { marginLeft: 10 }]}>Low Balance Warning</Text>
              </View>
              <Switch
                value={state.settings.notifications.lowBalance}
                onValueChange={(val) => {
                  updateSettings({
                    notifications: { ...state.settings.notifications, lowBalance: val },
                  });
                }}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* 4. LANGUAGE & STATEMENTS */}
          <Text style={styles.sectionHeader}>Preferences & Statements</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingRowClickable}
              onPress={() => setLangModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="language" size={18} color={colors.text} />
                <Text style={[styles.settingTitle, { marginLeft: 10 }]}>Application Language</Text>
              </View>
              <View style={styles.langBadge}>
                <Text style={styles.langText}>{state.settings.language}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRowClickable}
              onPress={() => setStatementVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="document-attach-outline" size={18} color={colors.primary} />
                <Text style={[styles.settingTitle, { marginLeft: 10 }]}>
                  Generate Certified Account Statement
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* 5. ACTIVE SESSIONS */}
          <Text style={styles.sectionHeader}>Active Devices & Hardware</Text>
          <View style={styles.settingsGroup}>
            {activeSessions.map((s, idx) => (
              <View key={s.id}>
                {idx > 0 && <View style={styles.divider} />}
                <View style={styles.sessionRow}>
                  <Ionicons
                    name={s.device.includes('MacBook') ? 'laptop-outline' : 'phone-portrait-outline'}
                    size={20}
                    color={s.current ? colors.primary : colors.textSecondary}
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.settingTitle}>{s.device}</Text>
                      {s.current && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>THIS DEVICE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.settingSub}>{s.location} • Active Now</Text>
                  </View>
                  {!s.current && (
                    <TouchableOpacity
                      onPress={() => handleRevokeSession(s.id, s.device)}
                      style={styles.revokeBtn}
                    >
                      <Text style={styles.revokeText}>Revoke</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* 6. SCHOOL PROJECT DEMO SHORTCUTS */}
          <Text style={styles.sectionHeader}>Project Demo Presentation Controls</Text>
          <View style={styles.demoCard}>
            <Text style={styles.demoDesc}>
              Quickly seed transactions or reset balances while presenting your school project:
            </Text>

            <View style={styles.demoButtonsRow}>
              <Button
                text="Inject +$1,000 Grant"
                onPress={() => {
                  depositCash(1000, 'Demo Grant Deposit');
                  showToast(`Injected +$1,000 demo grant into ${activeAccount.bankName}!`);
                }}
                variant="secondary"
                icon="cash-outline"
                style={{ flex: 1 }}
              />
              <Button
                text="Reset Demo Data"
                onPress={() => {
                  resetDemoData();
                  showToast('Demo data and account balances reset to defaults!');
                }}
                variant="outline"
                icon="refresh-outline"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Change PIN Modal */}
      <Modal visible={pinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set 4-Digit Security PIN</Text>
            <Text style={styles.modalSubtitle}>
              Used to authorize payments and view sensitive card numbers
            </Text>

            <TextInput
              style={styles.pinInput}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              value={pinInput}
              onChangeText={setPinInput}
              placeholder="••••"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Button
                text="Save PIN"
                onPress={handleSavePin}
                variant="primary"
                style={{ flex: 1 }}
              />
              <Button
                text="Cancel"
                onPress={() => setPinModalVisible(false)}
                variant="ghost"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={langModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.langSheet}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langItem,
                  state.settings.language === l && styles.langItemActive,
                ]}
                onPress={() => {
                  updateSettings({ language: l });
                  showToast(`Language set to ${l}`);
                  setLangModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.langItemText,
                    state.settings.language === l && { color: colors.primary },
                  ]}
                >
                  {l}
                </Text>
                {state.settings.language === l && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Statement Modal */}
      <StatementModal
        visible={statementVisible}
        onClose={() => setStatementVisible(false)}
        onShowToast={showToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryMuted,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  profileCashtag: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 214, 50, 0.3)',
  },
  tierPillText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  formSection: {
    width: '100%',
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingRowClickable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  settingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  currentBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },
  revokeBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  revokeText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  demoCard: {
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  demoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 22,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  pinInput: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: 32,
    color: colors.text,
    letterSpacing: 10,
    textAlign: 'center',
    width: 180,
  },
  langSheet: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langItemActive: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  langItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
});
