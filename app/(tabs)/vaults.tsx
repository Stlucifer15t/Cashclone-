import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useBank } from '../../context/BankContext';
import { formatAmount } from '../../utils/currency';
import VaultModal from '../../components/VaultModal';
import BillPayModal from '../../components/BillPayModal';
import TransferModal from '../../components/TransferModal';
import ToastNotification from '../../components/ToastNotification';
import { Ionicons } from '@expo/vector-icons';

export default function VaultsAndPayScreen() {
  const { state, activeAccount } = useBank();
  const [vaultModalVisible, setVaultModalVisible] = useState(false);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const totalVaultsSaved = state.vaults.reduce((sum, v) => sum + v.currentAmount, 0);

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
            <View>
              <Text style={styles.title}>Vaults & Payments</Text>
              <Text style={styles.subtitle}>
                Ring-fenced savings, utility bill settlement & currency exchange
              </Text>
            </View>
          </View>

          {/* Savings Vaults Hero Summary */}
          <View style={styles.vaultsHero}>
            <View style={styles.vaultsHeroTop}>
              <View>
                <Text style={styles.heroLabel}>TOTAL VAULT LIQUIDITY</Text>
                <Text style={styles.heroAmount}>
                  {formatAmount(totalVaultsSaved, activeAccount.currency)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addVaultBtn}
                onPress={() => setVaultModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#000000" />
                <Text style={styles.addVaultText}>New Goal</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heroSub}>
              Earning 4.85% APY compounding daily across {state.vaults.length} dedicated goals
            </Text>
          </View>

          {/* Vaults Grid */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Savings Goals</Text>
            <TouchableOpacity onPress={() => setVaultModalVisible(true)}>
              <Text style={styles.manageLink}>Manage All</Text>
            </TouchableOpacity>
          </View>

          {state.vaults.map((vault) => {
            const progress = Math.min(
              100,
              Math.round((vault.currentAmount / vault.targetAmount) * 100)
            );
            return (
              <TouchableOpacity
                key={vault.id}
                style={styles.goalCard}
                onPress={() => setVaultModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.goalTop}>
                  <View style={[styles.goalIcon, { backgroundColor: `${vault.color}25` }]}>
                    <Ionicons
                      name={vault.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={vault.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalName}>{vault.name}</Text>
                    <Text style={styles.goalTarget}>
                      Target: {formatAmount(vault.targetAmount, activeAccount.currency)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.goalCurrent}>
                      {formatAmount(vault.currentAmount, activeAccount.currency)}
                    </Text>
                    <Text style={styles.goalProgressText}>{progress}%</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.max(6, progress)}%`, backgroundColor: vault.color },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Bill Payments & Direct Utility Settlement */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Bill Pay & Direct Debits</Text>
          </View>

          <View style={styles.billsCard}>
            <View style={styles.billsHeader}>
              <View style={styles.billsIconWrap}>
                <Ionicons name="flash" size={20} color={colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.billsTitle}>Pay Clean Energy, Broadband & Rent</Text>
                <Text style={styles.billsSub}>Instant electronic settlement with receipt confirmation</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.billsActionBtn}
              onPress={() => setBillModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.billsActionText}>Select Provider & Pay Bill</Text>
              <Ionicons name="arrow-forward" size={16} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Inter-Bank Currency Exchange Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Foreign Exchange & Inter-Bank</Text>
          </View>

          <View style={styles.fxCard}>
            <View style={styles.fxHeader}>
              <View style={styles.fxIconWrap}>
                <Ionicons name="swap-horizontal" size={20} color={colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fxTitle}>Multi-Currency Transfer</Text>
                <Text style={styles.fxSub}>
                  Exchange between USD, EUR, CAD, GBP, NGN, and JPY at mid-market rates
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.fxActionBtn}
              onPress={() => setTransferVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.fxActionText}>Launch FX Exchange</Text>
              <Ionicons name="repeat" size={16} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <VaultModal
        visible={vaultModalVisible}
        onClose={() => setVaultModalVisible(false)}
        onSuccess={showToast}
      />

      <BillPayModal
        visible={billModalVisible}
        onClose={() => setBillModalVisible(false)}
        onSuccess={showToast}
      />

      <TransferModal
        visible={transferVisible}
        onClose={() => setTransferVisible(false)}
        onSuccess={showToast}
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
  vaultsHero: {
    backgroundColor: '#0F2617',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.primaryMuted,
    marginBottom: 18,
  },
  vaultsHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  addVaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addVaultText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  heroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  manageLink: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  goalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  goalTarget: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalCurrent: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  goalProgressText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  barBg: {
    height: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  billsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  billsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  billsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  billsSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  billsActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  billsActionText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  fxCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  fxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  fxIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fxTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  fxSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fxActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  fxActionText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '800',
  },
});
