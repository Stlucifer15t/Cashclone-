import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import { useBank } from '../context/BankContext';
import { formatAmount } from '../utils/currency';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectBank?: (bankId: string) => void;
}

export default function BankSwitcherModal({ visible, onClose, onSelectBank }: Props) {
  const { state, switchBank } = useBank();

  const handleSelect = (bankId: string) => {
    switchBank(bankId);
    if (onSelectBank) {
      onSelectBank(bankId);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="slide"
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Switch Bank Account</Text>
              <Text style={styles.subtitle}>
                Choose your active regional bank & currency
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.accountList} showsVerticalScrollIndicator={false}>
            {state.accounts.map((acc) => {
              const isActive = acc.id === state.activeBankId;
              return (
                <TouchableOpacity
                  key={acc.id}
                  style={[styles.accountCard, isActive && styles.accountCardActive]}
                  onPress={() => handleSelect(acc.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  <View style={styles.flagContainer}>
                    <Text style={styles.flag}>{acc.flag}</Text>
                  </View>

                  <View style={styles.bankInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.bankName} numberOfLines={1}>
                        {acc.bankName}
                      </Text>
                      {isActive && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>ACTIVE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.countryLabel}>
                      {acc.countryName} • {acc.currency} ({acc.symbol})
                    </Text>
                    <Text style={styles.acctSub}>
                      {acc.identifierType}: {acc.identifierValue}
                    </Text>
                  </View>

                  <View style={styles.balanceWrap}>
                    <Text style={[styles.balance, isActive && styles.balanceActive]}>
                      {formatAmount(acc.balance, acc.currency)}
                    </Text>
                    <Ionicons
                      name={isActive ? 'checkmark-circle' : 'chevron-forward'}
                      size={20}
                      color={isActive ? colors.primary : colors.textMuted}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footerNote}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            <Text style={styles.footerText}>
              All accounts are protected with multi-currency FDIC / CDIC / BaFin safeguards.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountList: {
    maxHeight: 420,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  accountCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#0F2617',
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flag: {
    fontSize: 24,
  },
  bankInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
  },
  countryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  acctSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  balanceWrap: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  balance: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  balanceActive: {
    color: colors.primary,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
});
