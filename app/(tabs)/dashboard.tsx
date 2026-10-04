import React, { useState, useMemo } from 'react';
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
import { Transaction } from '../../types';
import VirtualCardView from '../../components/VirtualCardView';
import BankSwitcherModal from '../../components/BankSwitcherModal';
import SendMoneyModal from '../../components/SendMoneyModal';
import ReceiveMoneyModal from '../../components/ReceiveMoneyModal';
import DepositCashModal from '../../components/DepositCashModal';
import TransferModal from '../../components/TransferModal';
import TransactionDetailModal from '../../components/TransactionDetailModal';
import NotificationsModal from '../../components/NotificationsModal';
import BillPayModal from '../../components/BillPayModal';
import VaultModal from '../../components/VaultModal';
import StatementModal from '../../components/StatementModal';
import AtmLocatorModal from '../../components/AtmLocatorModal';
import TransactionItem from '../../components/TransactionItem';
import ToastNotification from '../../components/ToastNotification';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();
  const {
    state,
    activeAccount,
    toggleCardFreeze,
    toggleHideBalance,
  } = useBank();

  // Modals state
  const [bankSwitcherVisible, setBankSwitcherVisible] = useState(false);
  const [sendVisible, setSendVisible] = useState(false);
  const [receiveVisible, setReceiveVisible] = useState(false);
  const [depositVisible, setDepositVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [billPayVisible, setBillPayVisible] = useState(false);
  const [vaultVisible, setVaultVisible] = useState(false);
  const [statementVisible, setStatementVisible] = useState(false);
  const [atmVisible, setAtmVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const isHidden = state.settings.isBalanceHidden;

  const displayBalance = (val: number, cur = activeAccount.currency) => {
    if (isHidden) return `${activeAccount.symbol}••••••`;
    return formatAmount(val, cur);
  };

  const unreadCount = useMemo(() => {
    return state.notifications.filter((n) => !n.read).length;
  }, [state.notifications]);

  // Filter transactions for active bank or recent 5
  const recentTransactions = useMemo(() => {
    return state.transactions
      .filter((t) => t.bankId === activeAccount.id || t.type === 'transfer')
      .slice(0, 5);
  }, [state.transactions, activeAccount.id]);

  // Dynamic monthly spending
  const monthlySpending = useMemo(() => {
    return state.transactions
      .filter((t) => t.bankId === activeAccount.id && t.type === 'out')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions, activeAccount.id]);

  const monthlyBudget = 2500;
  const budgetPercentage = Math.min(
    100,
    Math.round((monthlySpending / monthlyBudget) * 100)
  );

  const totalVaultsSaved = useMemo(() => {
    return state.vaults.reduce((sum, v) => sum + v.currentAmount, 0);
  }, [state.vaults]);

  const copyAccountDetails = () => {
    showToast(
      `${activeAccount.identifierType} (${activeAccount.identifierValue}) copied to clipboard!`
    );
  };

  return (
    <View style={commonStyles.container}>
      {/* Toast Notification */}
      <ToastNotification message={toastMessage} onHide={() => setToastMessage(null)} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.contentMaxWidth}>
          {/* Top Bar: Profile, Bank Switcher, and Notifications */}
          <View style={styles.topHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>
                  {state.profile.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.greetingText}>
                  {state.profile.name}
                </Text>
                <View style={styles.tierRow}>
                  <Ionicons name="sparkles" size={11} color={colors.primary} />
                  <Text style={styles.tierText}>{state.profile.tier}</Text>
                </View>
              </View>
            </View>

            <View style={styles.topActionsRow}>
              {/* Bank Switcher Button */}
              <TouchableOpacity
                style={styles.bankSwitchBtn}
                onPress={() => setBankSwitcherVisible(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.flagEmoji}>{activeAccount.flag}</Text>
                <Text style={styles.switchBankCur}>{activeAccount.currency}</Text>
                <Ionicons name="chevron-down" size={13} color={colors.primary} />
              </TouchableOpacity>

              {/* Notification Bell */}
              <TouchableOpacity
                style={styles.bellBtn}
                onPress={() => setNotifVisible(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Ionicons name="notifications-outline" size={20} color={colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Hero Card with Discreet Eye Mode */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceHeaderRow}>
              <Text style={styles.balanceLabel}>Total Available Balance</Text>
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={toggleHideBalance}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isHidden ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>
                {displayBalance(activeAccount.balance)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.acctInfoPill}
              onPress={copyAccountDetails}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.acctInfoText}>
                {activeAccount.bankName} • {activeAccount.identifierType}:{' '}
                {activeAccount.identifierValue}
              </Text>
              <Ionicons name="copy-outline" size={13} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Interactive Virtual Card */}
          <VirtualCardView
            account={activeAccount}
            onToggleFreeze={() => {
              toggleCardFreeze(activeAccount.id);
              showToast(
                activeAccount.card.isFrozen
                  ? `Unfroze ${activeAccount.bankName} card`
                  : `Froze ${activeAccount.bankName} card`
              );
            }}
            onShowToast={showToast}
          />

          {/* Primary Quick Action Buttons (Send, Receive, Deposit, Exchange) */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setSendVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={[styles.actionCircle, styles.actionCircleGreen]}>
                <Ionicons name="arrow-up" size={22} color="#000000" />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setReceiveVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={styles.actionCircle}>
                <Ionicons name="arrow-down" size={22} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setDepositVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={styles.actionCircle}>
                <Ionicons name="add" size={22} color={colors.text} />
              </View>
              <Text style={styles.actionLabel}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setTransferVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={styles.actionCircle}>
                <Ionicons name="swap-horizontal" size={22} color={colors.secondary} />
              </View>
              <Text style={styles.actionLabel}>Exchange</Text>
            </TouchableOpacity>
          </View>

          {/* Real Banking Utility Quick Bar (Pay Bills, Savings Vaults, Statements, ATM Finder) */}
          <View style={styles.utilityBar}>
            <TouchableOpacity
              style={styles.utilityBtn}
              onPress={() => setBillPayVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="flash-outline" size={18} color={colors.warning} />
              <Text style={styles.utilityText}>Pay Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.utilityBtn}
              onPress={() => setVaultVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
              <Text style={styles.utilityText}>Vaults ({state.vaults.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.utilityBtn}
              onPress={() => setStatementVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <Text style={styles.utilityText}>Statement</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.utilityBtn}
              onPress={() => setAtmVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="location-outline" size={18} color={colors.secondary} />
              <Text style={styles.utilityText}>ATMs</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Savings Vaults Mini Widget */}
          <TouchableOpacity
            style={styles.vaultsWidget}
            onPress={() => setVaultVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.vaultsWidgetLeft}>
              <View style={styles.vaultWidgetIcon}>
                <Ionicons name="lock-closed" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.vaultsWidgetTitle}>Savings Vaults & Goals</Text>
                <Text style={styles.vaultsWidgetSub}>
                  {displayBalance(totalVaultsSaved)} total saved across {state.vaults.length} vaults
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Dynamic Budget & Spending Card */}
          <View style={styles.spendingCard}>
            <View style={styles.spendingTopRow}>
              <View>
                <Text style={styles.spendingTitle}>Monthly Analytics</Text>
                <Text style={styles.spendingSubtitle}>
                  {displayBalance(monthlySpending)} spent of budget
                </Text>
              </View>
              <View style={styles.percentageBadge}>
                <Text style={styles.percentageText}>{budgetPercentage}%</Text>
              </View>
            </View>

            {/* Visual Progress Bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.max(8, budgetPercentage)}%`,
                    backgroundColor:
                      budgetPercentage > 90 ? colors.danger : colors.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.spendingFooter}>
              <Text style={styles.limitText}>
                Budget: {displayBalance(monthlyBudget)}
              </Text>
              <Text style={styles.remainingText}>
                {displayBalance(Math.max(0, monthlyBudget - monthlySpending))} remaining
              </Text>
            </View>
          </View>

          {/* Recent Activity Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/transactions')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>View All ({state.transactions.length})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.txCard}>
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
                <Text style={styles.emptyText}>No transactions yet for this bank.</Text>
                <TouchableOpacity
                  style={styles.emptyAction}
                  onPress={() => setDepositVisible(true)}
                >
                  <Text style={styles.emptyActionText}>Add Funds Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              recentTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  tx={tx}
                  onPress={() => setSelectedTx(tx)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Interactive Banking Modals */}
      <BankSwitcherModal
        visible={bankSwitcherVisible}
        onClose={() => setBankSwitcherVisible(false)}
        onSelectBank={(id) => {
          const bank = state.accounts.find((a) => a.id === id);
          if (bank) {
            showToast(`Switched active bank to ${bank.countryName} (${bank.currency})`);
          }
        }}
      />

      <SendMoneyModal
        visible={sendVisible}
        onClose={() => setSendVisible(false)}
        onSuccess={showToast}
      />

      <ReceiveMoneyModal
        visible={receiveVisible}
        onClose={() => setReceiveVisible(false)}
        onSuccess={showToast}
      />

      <DepositCashModal
        visible={depositVisible}
        onClose={() => setDepositVisible(false)}
        onSuccess={showToast}
      />

      <TransferModal
        visible={transferVisible}
        onClose={() => setTransferVisible(false)}
        onSuccess={showToast}
      />

      <BillPayModal
        visible={billPayVisible}
        onClose={() => setBillPayVisible(false)}
        onSuccess={showToast}
      />

      <VaultModal
        visible={vaultVisible}
        onClose={() => setVaultVisible(false)}
        onSuccess={showToast}
      />

      <StatementModal
        visible={statementVisible}
        onClose={() => setStatementVisible(false)}
        onShowToast={showToast}
      />

      <AtmLocatorModal
        visible={atmVisible}
        onClose={() => setAtmVisible(false)}
        onShowToast={showToast}
      />

      <NotificationsModal
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
        onShowToast={showToast}
      />

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onShare={showToast}
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  greetingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  tierText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 5,
  },
  flagEmoji: {
    fontSize: 17,
  },
  switchBankCur: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  balanceSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  eyeBtn: {
    padding: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
  },
  acctInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  acctInfoText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionCircleGreen: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  utilityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 6,
  },
  utilityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  utilityText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  vaultsWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16231C',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    marginVertical: 8,
  },
  vaultsWidgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vaultWidgetIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultsWidgetTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  vaultsWidgetSub: {
    color: colors.primary,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  spendingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginVertical: 8,
  },
  spendingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spendingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  spendingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percentageBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  percentageText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 13,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  spendingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  limitText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  remainingText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  txCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  emptyAction: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  emptyActionText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
