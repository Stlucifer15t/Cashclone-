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
import { formatAmount, convertAmount, RATES_TO_USD } from '../utils/currency';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function TransferModal({ visible, onClose, onSuccess }: Props) {
  const { state, transferBetweenBanks } = useBank();
  const [sourceId, setSourceId] = useState(state.activeBankId);
  const [destId, setDestId] = useState(
    state.accounts.find((a) => a.id !== state.activeBankId)?.id || state.accounts[1].id
  );
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState<string | null>(null);

  const sourceBank = state.accounts.find((a) => a.id === sourceId) || state.accounts[0];
  const destBank = state.accounts.find((a) => a.id === destId) || state.accounts[1];

  const numAmount = parseFloat(amount) || 0;
  const convertedAmount = convertAmount(numAmount, sourceBank.currency, destBank.currency);

  const handleSwap = () => {
    setSourceId(destId);
    setDestId(sourceId);
  };

  const handleTransfer = () => {
    setError(null);
    if (numAmount <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }
    if (sourceBank.balance < numAmount) {
      setError(`Insufficient balance in ${sourceBank.bankName}`);
      return;
    }

    const res = transferBetweenBanks(sourceId, destId, numAmount);
    if (res.success) {
      onSuccess(
        `Transferred ${formatAmount(numAmount, sourceBank.currency)} to ${destBank.bankName} (${formatAmount(convertedAmount, destBank.currency)})`
      );
      onClose();
    } else {
      setError(res.message || 'Transfer failed');
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
              <Text style={styles.title}>Inter-Bank Exchange</Text>
              <Text style={styles.subtitle}>Transfer between your international accounts</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Source Bank Box */}
            <View style={styles.bankPickerBox}>
              <Text style={styles.pickerLabel}>FROM</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bankScroll}>
                {state.accounts.map((acc) => {
                  const isSelected = acc.id === sourceId;
                  return (
                    <TouchableOpacity
                      key={acc.id}
                      style={[styles.bankPill, isSelected && styles.bankPillSelected]}
                      onPress={() => {
                        setSourceId(acc.id);
                        if (acc.id === destId) {
                          setDestId(state.accounts.find((a) => a.id !== acc.id)!.id);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.flag}>{acc.flag}</Text>
                      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                        {acc.country} ({acc.currency})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text style={styles.balanceNote}>
                Available: {formatAmount(sourceBank.balance, sourceBank.currency)}
              </Text>
            </View>

            {/* Swap Button */}
            <TouchableOpacity style={styles.swapBtn} onPress={handleSwap} activeOpacity={0.8}>
              <Ionicons name="swap-vertical" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* Destination Bank Box */}
            <View style={styles.bankPickerBox}>
              <Text style={styles.pickerLabel}>TO</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bankScroll}>
                {state.accounts.map((acc) => {
                  const isSelected = acc.id === destId;
                  return (
                    <TouchableOpacity
                      key={acc.id}
                      style={[styles.bankPill, isSelected && styles.bankPillSelected]}
                      onPress={() => {
                        setDestId(acc.id);
                        if (acc.id === sourceId) {
                          setSourceId(state.accounts.find((a) => a.id !== acc.id)!.id);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.flag}>{acc.flag}</Text>
                      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                        {acc.country} ({acc.currency})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text style={styles.balanceNote}>
                Current Balance: {formatAmount(destBank.balance, destBank.currency)}
              </Text>
            </View>

            {/* Amount input */}
            <View style={styles.amountWrap}>
              <Text style={styles.amountLabel}>You send ({sourceBank.currency})</Text>
              <View style={styles.inputRow}>
                <Text style={styles.sym}>{sourceBank.symbol}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    setError(null);
                  }}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Conversion result card */}
            <View style={styles.conversionCard}>
              <View style={styles.convRow}>
                <Text style={styles.convLabel}>Recipient gets ({destBank.currency}):</Text>
                <Text style={styles.convValue}>{formatAmount(convertedAmount, destBank.currency)}</Text>
              </View>
              <View style={styles.convRow}>
                <Text style={styles.convSub}>Exchange Rate:</Text>
                <Text style={styles.convSubVal}>
                  1 {sourceBank.currency} ≈ {(RATES_TO_USD[sourceBank.currency] / RATES_TO_USD[destBank.currency]).toFixed(4)} {destBank.currency}
                </Text>
              </View>
              <View style={styles.convRow}>
                <Text style={styles.convSub}>Transfer Fee:</Text>
                <Text style={[styles.convSubVal, { color: colors.primary }]}>$0.00 (Free Demo)</Text>
              </View>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              text="Confirm Exchange & Transfer"
              onPress={handleTransfer}
              icon="swap-horizontal"
              style={{ marginTop: 14 }}
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
  bankPickerBox: {
    backgroundColor: colors.surfaceElevated,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  bankScroll: {
    marginVertical: 4,
  },
  bankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankPillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  flag: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pillTextSelected: {
    color: colors.primary,
  },
  balanceNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
  },
  swapBtn: {
    alignSelf: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -8,
    zIndex: 10,
  },
  amountWrap: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginTop: 14,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  sym: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 8,
  },
  input: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    flex: 1,
  },
  conversionCard: {
    backgroundColor: '#1E232B',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  convRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  convValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  convSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  convSubVal: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
