import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useBank } from '../../context/BankContext';
import { Transaction } from '../../types';
import { formatAmount } from '../../utils/currency';
import TransactionItem from '../../components/TransactionItem';
import TransactionDetailModal from '../../components/TransactionDetailModal';
import SendMoneyModal from '../../components/SendMoneyModal';
import ReceiveMoneyModal from '../../components/ReceiveMoneyModal';
import ToastNotification from '../../components/ToastNotification';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'all' | 'in' | 'out' | 'transfer' | 'active_bank';

export default function TransactionsScreen() {
  const { state, activeAccount } = useBank();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [sendVisible, setSendVisible] = useState(false);
  const [receiveVisible, setReceiveVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((tx) => {
      // Type filter
      if (filter === 'in' && tx.type !== 'in') return false;
      if (filter === 'out' && tx.type !== 'out') return false;
      if (filter === 'transfer' && tx.type !== 'transfer') return false;
      if (filter === 'active_bank' && tx.bankId !== activeAccount.id) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRecipient = tx.recipient.toLowerCase().includes(q);
        const matchNote = tx.note?.toLowerCase().includes(q) || false;
        const matchCategory = tx.category.toLowerCase().includes(q);
        const matchBank = tx.bankName.toLowerCase().includes(q);
        const matchAmount = String(tx.amount).includes(q);
        return matchRecipient || matchNote || matchCategory || matchBank || matchAmount;
      }

      return true;
    });
  }, [state.transactions, filter, searchQuery, activeAccount.id]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    filteredTransactions.forEach((tx) => {
      if (tx.type === 'in') totalIn += tx.amount;
      if (tx.type === 'out') totalOut += tx.amount;
    });
    return { totalIn, totalOut, net: totalIn - totalOut };
  }, [filteredTransactions]);

  const handleExport = () => {
    showToast(`Exported ${filteredTransactions.length} transactions as CSV/PDF receipt statement!`);
  };

  return (
    <View style={commonStyles.container}>
      <ToastNotification message={toastMessage} onHide={() => setToastMessage(null)} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.contentMaxWidth}>
          {/* Header & Quick Action Buttons */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Activity & Statements</Text>
              <Text style={styles.subtitle}>
                Global ledger across all {state.accounts.length} linked accounts
              </Text>
            </View>
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={handleExport}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* Top Quick Actions Bar */}
          <View style={styles.topActionsRow}>
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnPrimary]}
              onPress={() => setSendVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-up" size={16} color="#000000" />
              <Text style={styles.quickBtnPrimaryText}>Send Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnSecondary]}
              onPress={() => setReceiveVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-down" size={16} color={colors.text} />
              <Text style={styles.quickBtnSecondaryText}>Request Cash</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Stat Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconIn}>
                <Ionicons name="arrow-down" size={14} color={colors.primary} />
              </View>
              <Text style={styles.statLabel}>Total Inflow</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                +{formatAmount(stats.totalIn, activeAccount.currency)}
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconOut}>
                <Ionicons name="arrow-up" size={14} color={colors.danger} />
              </View>
              <Text style={styles.statLabel}>Total Outflow</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                -{formatAmount(stats.totalOut, activeAccount.currency)}
              </Text>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, note, category or amount..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.pill, filter === 'all' && styles.pillActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.pillText, filter === 'all' && styles.pillTextActive]}>
                All ({state.transactions.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filter === 'in' && styles.pillActive]}
              onPress={() => setFilter('in')}
            >
              <Text style={[styles.pillText, filter === 'in' && styles.pillTextActive]}>
                Received
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filter === 'out' && styles.pillActive]}
              onPress={() => setFilter('out')}
            >
              <Text style={[styles.pillText, filter === 'out' && styles.pillTextActive]}>
                Sent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filter === 'transfer' && styles.pillActive]}
              onPress={() => setFilter('transfer')}
            >
              <Text style={[styles.pillText, filter === 'transfer' && styles.pillTextActive]}>
                Inter-Bank
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filter === 'active_bank' && styles.pillActive]}
              onPress={() => setFilter('active_bank')}
            >
              <Text style={[styles.pillText, filter === 'active_bank' && styles.pillTextActive]}>
                {activeAccount.flag} {activeAccount.country} Only
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Transaction List */}
          <View style={styles.listCard}>
            {filteredTransactions.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="search-outline" size={36} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No matching transactions</Text>
                <Text style={styles.emptySub}>
                  Try clearing your search or filter criteria.
                </Text>
                <TouchableOpacity
                  style={styles.resetFilterBtn}
                  onPress={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.resetFilterText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredTransactions.map((tx) => (
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

      {/* Transaction Receipt Modal */}
      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onShare={showToast}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  exportText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  topActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  quickBtnPrimary: {
    backgroundColor: colors.primary,
  },
  quickBtnPrimaryText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  quickBtnSecondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quickBtnSecondaryText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconIn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#052E16',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statIconOut: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  filterScroll: {
    marginBottom: 14,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.primary,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  resetFilterBtn: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  resetFilterText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
