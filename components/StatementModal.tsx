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
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export default function StatementModal({ visible, onClose, onShowToast }: Props) {
  const { activeAccount, state } = useBank();

  const handleDownload = () => {
    onShowToast(`Downloaded official statement PDF for ${activeAccount.bankName}!`);
    onClose();
  };

  const handleEmail = () => {
    onShowToast(`Official statement sent to ${state.profile.email}!`);
    onClose();
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Proof of Account & Statement</Text>
              <Text style={styles.subtitle}>
                Official bank certified balance statement
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Formal Certificate Document View */}
            <View style={styles.docPage}>
              {/* Document Header */}
              <View style={styles.docHeader}>
                <View>
                  <Text style={styles.docBankName}>{activeAccount.bankName}</Text>
                  <Text style={styles.docSub}>{activeAccount.countryName} Institutional Banking</Text>
                  <Text style={styles.docBic}>SWIFT / BIC: {activeAccount.swiftBic}</Text>
                </View>
                <View style={styles.docFlagWrap}>
                  <Text style={styles.docFlag}>{activeAccount.flag}</Text>
                </View>
              </View>

              <View style={styles.docDivider} />

              {/* Account Holder Details */}
              <Text style={styles.docSection}>ACCOUNT HOLDER DETAILS</Text>
              <View style={styles.docGrid}>
                <View style={styles.docCol}>
                  <Text style={styles.docLabel}>Legal Name</Text>
                  <Text style={styles.docVal}>{state.profile.name}</Text>
                </View>
                <View style={styles.docCol}>
                  <Text style={styles.docLabel}>Account Tier</Text>
                  <Text style={[styles.docVal, { color: colors.primary }]}>{state.profile.tier}</Text>
                </View>
              </View>

              <View style={styles.docGrid}>
                <View style={styles.docCol}>
                  <Text style={styles.docLabel}>{activeAccount.identifierType}</Text>
                  <Text style={styles.docValMono}>{activeAccount.identifierValue}</Text>
                </View>
                <View style={styles.docCol}>
                  <Text style={styles.docLabel}>Account Number</Text>
                  <Text style={styles.docValMono}>{activeAccount.accountNumber}</Text>
                </View>
              </View>

              {/* Certified Liquidity Balance */}
              <View style={styles.balanceHighlight}>
                <Text style={styles.highlightLabel}>CERTIFIED AVAILABLE BALANCE</Text>
                <Text style={styles.highlightAmount}>
                  {formatAmount(activeAccount.balance, activeAccount.currency)}
                </Text>
                <Text style={styles.highlightDate}>
                  As of: {new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}
                </Text>
              </View>

              {/* Official Seal / Verification Stamp */}
              <View style={styles.sealRow}>
                <View style={styles.sealBadge}>
                  <Ionicons name="checkmark-done-circle" size={20} color={colors.primary} />
                  <Text style={styles.sealText}>AUTHENTICATED & DIGITALLY SEALED</Text>
                </View>
                <Text style={styles.sealId}>REF #DOC-{activeAccount.id.toUpperCase()}-2026</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.btnRow}>
              <Button
                text="Download PDF"
                onPress={handleDownload}
                icon="download-outline"
                variant="primary"
                style={{ flex: 1 }}
              />
              <Button
                text="Email Copy"
                onPress={handleEmail}
                icon="mail-outline"
                variant="secondary"
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '90%',
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
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
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
  docPage: {
    backgroundColor: '#0F1218',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docBankName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  docSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  docBic: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  docFlagWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docFlag: {
    fontSize: 24,
  },
  docDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  docSection: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  docGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  docCol: {
    flex: 1,
  },
  docLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  docVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  docValMono: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  balanceHighlight: {
    backgroundColor: '#16231C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  highlightLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  highlightAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  highlightDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sealText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  sealId: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
});
