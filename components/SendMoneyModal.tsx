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
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import { useBank } from '../context/BankContext';
import { formatAmount } from '../utils/currency';
import { TransactionCategory } from '../types';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Transfers',
  'Shopping',
  'Food & Drinks',
  'Bills & Utilities',
  'Entertainment',
];

export default function SendMoneyModal({ visible, onClose, onSuccess }: Props) {
  const { activeAccount, sendMoney } = useBank();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Transfers');
  const [error, setError] = useState<string | null>(null);

  const presets = [10, 25, 50, 100, 250];

  const handleSend = () => {
    setError(null);
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!recipient.trim()) {
      setError('Please enter a recipient ($cashtag, name, or account)');
      return;
    }
    if (numAmount > activeAccount.balance) {
      setError(`Insufficient balance (${formatAmount(activeAccount.balance, activeAccount.currency)})`);
      return;
    }

    const res = sendMoney(numAmount, recipient, note, category);
    if (res.success) {
      onSuccess(`Sent ${formatAmount(numAmount, activeAccount.currency)} to ${recipient}`);
      setRecipient('');
      setAmount('');
      setNote('');
      setError(null);
      onClose();
    } else {
      setError(res.message || 'Transaction failed');
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Send Money</Text>
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
            {/* Amount Input */}
            <View style={styles.amountBox}>
              <Text style={styles.currencySymbol}>{activeAccount.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  setError(null);
                }}
                autoFocus
              />
            </View>

            {/* Quick Chips */}
            <View style={styles.chipRow}>
              {presets.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={styles.chip}
                  onPress={() => setAmount(String(p))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>+{activeAccount.symbol}{p}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.chip, styles.chipMax]}
                onPress={() => setAmount(String(activeAccount.balance))}
                activeOpacity={0.7}
              >
                <Text style={styles.chipMaxText}>MAX</Text>
              </TouchableOpacity>
            </View>

            {/* Recipient Input */}
            <Text style={styles.label}>Recipient ($cashtag, Name, or Account)</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="at" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. $david, Sarah Miller, 839201"
                placeholderTextColor={colors.textMuted}
                value={recipient}
                onChangeText={(val) => {
                  setRecipient(val);
                  setError(null);
                }}
              />
            </View>

            {/* Category selection */}
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, category === cat && styles.catPillActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.catText, category === cat && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Note Input */}
            <Text style={styles.label}>Note (Optional)</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="What's this for?"
                placeholderTextColor={colors.textMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              text={`Pay ${amount ? formatAmount(Number(amount) || 0, activeAccount.currency) : ''}`}
              onPress={handleSend}
              icon="paper-plane"
              style={{ marginTop: 16 }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 12,
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
    paddingVertical: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  currencySymbol: {
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipMax: {
    backgroundColor: 'rgba(0, 214, 50, 0.15)',
    borderColor: colors.primary,
  },
  chipMaxText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
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
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  catScroll: {
    marginBottom: 8,
  },
  catPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  catPillActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  catText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  catTextActive: {
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
