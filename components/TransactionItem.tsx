import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { Transaction, CurrencyCode } from '../types';
import { formatAmount } from '../utils/currency';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  tx: Transaction;
  currency?: CurrencyCode;
  onPress?: () => void;
}

const getCategoryIcon = (
  category: Transaction['category'],
  type: Transaction['type']
): keyof typeof Ionicons.glyphMap => {
  if (type === 'transfer') return 'swap-horizontal';
  switch (category) {
    case 'Food & Drinks':
      return 'cafe-outline';
    case 'Shopping':
      return 'cart-outline';
    case 'Bills & Utilities':
      return 'receipt-outline';
    case 'Entertainment':
      return 'film-outline';
    case 'Deposits':
      return 'wallet-outline';
    case 'Income':
      return 'cash-outline';
    default:
      return type === 'in' ? 'arrow-down' : 'arrow-up';
  }
};

export default function TransactionItem({ tx, onPress }: TransactionItemProps) {
  const isIncome = tx.type === 'in';
  const isTransfer = tx.type === 'transfer';

  const iconName = getCategoryIcon(tx.category, tx.type);
  const formattedDate = new Date(tx.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.iconCircle,
          isIncome
            ? styles.iconCircleIncome
            : isTransfer
            ? styles.iconCircleTransfer
            : styles.iconCircleExpense,
        ]}
      >
        <Ionicons
          name={iconName}
          size={20}
          color={isIncome ? colors.primary : isTransfer ? colors.secondary : colors.textSecondary}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.recipient} numberOfLines={1}>
            {tx.recipient}
          </Text>
          <Text
            style={[
              styles.amount,
              isIncome
                ? styles.amountIncome
                : isTransfer
                ? styles.amountTransfer
                : styles.amountExpense,
            ]}
          >
            {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}
            {formatAmount(tx.amount, tx.currency)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.categoryBadge}>{tx.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={styles.bankTag}>
            <Text style={styles.bankTagText}>{tx.bankName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleIncome: {
    backgroundColor: '#052E16',
    borderWidth: 1,
    borderColor: '#15803D',
  },
  iconCircleExpense: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircleTransfer: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipient: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
  },
  amountIncome: {
    color: colors.primary,
  },
  amountExpense: {
    color: colors.text,
  },
  amountTransfer: {
    color: colors.secondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  categoryBadge: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dot: {
    color: colors.textMuted,
    fontSize: 10,
    marginHorizontal: 3,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  bankTag: {
    marginLeft: 'auto',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bankTagText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
