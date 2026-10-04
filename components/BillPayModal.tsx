import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
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
  onSuccess: (msg: string) => void;
}

const PROVIDERS = [
  { id: 'p1', name: 'ConEdison Clean Power', category: 'Electricity', icon: 'flash' as const },
  { id: 'p2', name: 'AT&T Fiber Gigabit', category: 'Internet', icon: 'wifi' as const },
  { id: 'p3', name: 'Metropolitan Water Dist.', category: 'Water', icon: 'water' as const },
  { id: 'p4', name: 'Greystar Property Rent', category: 'Housing', icon: 'home' as const },
  { id: 'p5', name: 'Campus Tuition & Board', category: 'Tuition', icon: 'school' as const },
];

export default function BillPayModal({ visible, onClose, onSuccess }: Props) {
  const { activeAccount, payBill } = useBank();
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [accountNo, setAccountNo] = useState('892019482');
  const [amount, setAmount] = useState('85');
  const [error, setError] = useState<string | null>(null);

  const presets = [45, 85, 120, 250, 500];

  const handlePay = () => {
    setError(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid payment amount');
      return;
    }
    if (!accountNo.trim()) {
      setError('Enter your billing reference / account number');
      return;
    }
    if (activeAccount.balance < num) {
      setError(`Insufficient funds in ${activeAccount.bankName}`);
      return;
    }

    const res = payBill(
      selectedProvider.name,
      selectedProvider.category,
      accountNo,
      num
    );

    if (res.success) {
      onSuccess(
        `Paid ${formatAmount(num, activeAccount.currency)} to ${selectedProvider.name}!`
      );
      onClose();
    } else {
      setError(res.message || 'Payment failed');
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Pay Bills & Utilities</Text>
              <Text style={styles.subtitle}>
                From: {activeAccount.flag} {activeAccount.bankName} (
                {formatAmount(activeAccount.balance, activeAccount.currency)} available)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Provider selection */}
            <Text style={styles.label}>Select Service Provider</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providerScroll}>
              {PROVIDERS.map((p) => {
                const isSelected = selectedProvider.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.providerCard, isSelected && styles.providerCardSelected]}
                    onPress={() => setSelectedProvider(p)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.providerIcon, isSelected && styles.providerIconSelected]}>
                      <Ionicons
                        name={p.icon}
                        size={20}
                        color={isSelected ? colors.primary : colors.text}
                      />
                    </View>
                    <Text style={[styles.providerCategory, isSelected && styles.textPrimary]}>
                      {p.category}
                    </Text>
                    <Text style={styles.providerName} numberOfLines={1}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Account / Reference Number */}
            <Text style={styles.label}>Customer / Meter / Account Number</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="barcode-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                value={accountNo}
                onChangeText={setAccountNo}
                placeholder="Account or Meter No."
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Amount input */}
            <Text style={styles.label}>Bill Amount ({activeAccount.currency})</Text>
            <View style={styles.amountWrap}>
              <Text style={styles.sym}>{activeAccount.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  setError(null);
                }}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Quick chips */}
            <View style={styles.chipRow}>
              {presets.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, amount === String(p) && styles.chipActive]}
                  onPress={() => setAmount(String(p))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, amount === String(p) && styles.chipTextActive]}>
                    {activeAccount.symbol}{p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              text={`Settle Bill: ${formatAmount(Number(amount) || 0, activeAccount.currency)}`}
              onPress={handlePay}
              icon="receipt"
              style={{ marginTop: 16 }}
            />
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
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  providerScroll: {
    marginVertical: 4,
  },
  providerCard: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    width: 140,
    marginRight: 10,
  },
  providerCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  providerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  providerIconSelected: {
    backgroundColor: '#052E16',
  },
  providerCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
  },
  textPrimary: {
    color: colors.primary,
  },
  providerName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  sym: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    flex: 1,
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
