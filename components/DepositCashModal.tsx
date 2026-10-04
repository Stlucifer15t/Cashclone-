import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  onSuccess: (msg: string) => void;
}

const METHODS = [
  { id: 'applepay', name: 'Apple / Google Pay', icon: 'logo-apple' as const },
  { id: 'card', name: 'Linked Visa •••• 9012', icon: 'card-outline' as const },
  { id: 'wire', name: 'Instant Bank Wire', icon: 'business-outline' as const },
];

export default function DepositCashModal({ visible, onClose, onSuccess }: Props) {
  const { activeAccount, depositCash } = useBank();
  const [amount, setAmount] = useState('100');
  const [selectedMethod, setSelectedMethod] = useState('applepay');

  const presets = [25, 50, 100, 250, 500];

  const handleDeposit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const methodObj = METHODS.find((m) => m.id === selectedMethod);
    depositCash(num, methodObj?.name || 'Direct Deposit');
    onSuccess(`Added ${formatAmount(num, activeAccount.currency)} to ${activeAccount.bankName}!`);
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
              <Text style={styles.title}>Deposit / Add Cash</Text>
              <Text style={styles.subtitle}>
                Into: {activeAccount.flag} {activeAccount.bankName}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Amount Box */}
          <View style={styles.amountBox}>
            <Text style={styles.symbol}>{activeAccount.symbol}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Presets */}
          <View style={styles.presetsRow}>
            {presets.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.presetBtn, amount === String(p) && styles.presetBtnActive]}
                onPress={() => setAmount(String(p))}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetText, amount === String(p) && styles.presetTextActive]}>
                  {activeAccount.symbol}{p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Funding Source */}
          <Text style={styles.sectionLabel}>Funding Method</Text>
          <View style={styles.methodList}>
            {METHODS.map((m) => {
              const active = selectedMethod === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.methodCard, active && styles.methodCardActive]}
                  onPress={() => setSelectedMethod(m.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodIcon}>
                    <Ionicons name={m.icon} size={20} color={active ? colors.primary : colors.text} />
                  </View>
                  <Text style={[styles.methodName, active && styles.methodNameActive]}>
                    {m.name}
                  </Text>
                  <Ionicons
                    name={active ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={active ? colors.primary : colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            text={`Deposit ${formatAmount(Number(amount) || 0, activeAccount.currency)}`}
            onPress={handleDeposit}
            icon="add-circle-outline"
            style={{ marginTop: 14 }}
          />
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
    fontSize: 22,
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
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  symbol: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.text,
    minWidth: 120,
    textAlign: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  presetText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  presetTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodList: {
    gap: 8,
    marginBottom: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodCardActive: {
    borderColor: colors.primary,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  methodName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  methodNameActive: {
    fontWeight: '700',
  },
});
