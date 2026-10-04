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
import { Vault } from '../types';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function VaultModal({ visible, onClose, onSuccess }: Props) {
  const { state, activeAccount, depositToVault, withdrawFromVault, createVault } = useBank();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [amount, setAmount] = useState('100');
  const [isCreating, setIsCreating] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('5000');
  const [error, setError] = useState<string | null>(null);

  const handleDeposit = (vault: Vault) => {
    setError(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid deposit amount');
      return;
    }
    const res = depositToVault(vault.id, num);
    if (res.success) {
      onSuccess(`Moved ${formatAmount(num, activeAccount.currency)} into "${vault.name}" Vault!`);
      setSelectedVault(null);
    } else {
      setError(res.message || 'Deposit failed');
    }
  };

  const handleWithdraw = (vault: Vault) => {
    setError(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid withdrawal amount');
      return;
    }
    const res = withdrawFromVault(vault.id, num);
    if (res.success) {
      onSuccess(`Withdrew ${formatAmount(num, activeAccount.currency)} from "${vault.name}" back to balance!`);
      setSelectedVault(null);
    } else {
      setError(res.message || 'Withdrawal failed');
    }
  };

  const handleCreate = () => {
    if (!newVaultName.trim()) {
      setError('Please provide a goal name');
      return;
    }
    const target = parseFloat(newVaultTarget) || 2000;
    createVault(newVaultName, target, 'shield-checkmark', '#10B981');
    onSuccess(`Created "${newVaultName}" savings vault!`);
    setIsCreating(false);
    setNewVaultName('');
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Savings Vaults & Goals</Text>
              <Text style={styles.subtitle}>
                Ring-fenced interest-earning savings pockets
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* List existing vaults */}
            {state.vaults.map((vault) => {
              const progress = Math.min(
                100,
                Math.round((vault.currentAmount / vault.targetAmount) * 100)
              );
              const isManaging = selectedVault?.id === vault.id;

              return (
                <View key={vault.id} style={styles.vaultCard}>
                  <View style={styles.vaultTop}>
                    <View style={[styles.vaultIcon, { backgroundColor: `${vault.color}25` }]}>
                      <Ionicons
                        name={vault.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={vault.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.vaultName}>{vault.name}</Text>
                      <Text style={styles.vaultTarget}>
                        Target: {formatAmount(vault.targetAmount, activeAccount.currency)}
                      </Text>
                    </View>
                    <View style={styles.vaultAmountWrap}>
                      <Text style={styles.vaultCurrent}>
                        {formatAmount(vault.currentAmount, activeAccount.currency)}
                      </Text>
                      <Text style={styles.progressPercent}>{progress}% Saved</Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.max(5, progress)}%`, backgroundColor: vault.color },
                      ]}
                    />
                  </View>

                  {/* Actions toggle */}
                  {isManaging ? (
                    <View style={styles.manageWrap}>
                      <Text style={styles.manageLabel}>Amount to Deposit / Withdraw</Text>
                      <View style={styles.amountInputRow}>
                        <Text style={styles.inputSym}>{activeAccount.symbol}</Text>
                        <TextInput
                          style={styles.amountInput}
                          value={amount}
                          onChangeText={setAmount}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.manageBtns}>
                        <Button
                          text="Deposit to Vault"
                          onPress={() => handleDeposit(vault)}
                          variant="primary"
                          icon="add"
                          style={{ flex: 1 }}
                        />
                        <Button
                          text="Withdraw"
                          onPress={() => handleWithdraw(vault)}
                          variant="secondary"
                          icon="arrow-up"
                          style={{ flex: 1 }}
                        />
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.quickManageBtn}
                      onPress={() => setSelectedVault(vault)}
                    >
                      <Text style={styles.quickManageText}>Manage Funds ▾</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

            {/* Create new vault form */}
            {isCreating ? (
              <View style={styles.createCard}>
                <Text style={styles.createTitle}>Create New Savings Vault</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Vault Name (e.g. Dream House, Tesla)"
                  placeholderTextColor={colors.textMuted}
                  value={newVaultName}
                  onChangeText={setNewVaultName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Target Goal Amount"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={newVaultTarget}
                  onChangeText={setNewVaultTarget}
                />
                <View style={styles.createButtonsRow}>
                  <Button
                    text="Create Vault"
                    onPress={handleCreate}
                    variant="primary"
                    style={{ flex: 1 }}
                  />
                  <Button
                    text="Cancel"
                    onPress={() => setIsCreating(false)}
                    variant="ghost"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addVaultBtn}
                onPress={() => setIsCreating(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.addVaultText}>Create Another Savings Vault</Text>
              </TouchableOpacity>
            )}

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
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
    maxHeight: '88%',
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
  vaultCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  vaultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vaultIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  vaultTarget: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vaultAmountWrap: {
    alignItems: 'flex-end',
  },
  vaultCurrent: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  progressPercent: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickManageBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
  },
  quickManageText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  manageWrap: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  manageLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  inputSym: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  manageBtns: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  addVaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderLight,
    marginVertical: 8,
  },
  addVaultText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  createCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  createTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
  },
  createButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
