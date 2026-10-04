import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import { Transaction } from '../types';
import { formatAmount } from '../utils/currency';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onShare: (msg: string) => void;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
  onShare,
}: Props) {
  if (!transaction) return null;

  const isIncome = transaction.type === 'in';
  const isTransfer = transaction.type === 'transfer';

  const formattedDate = new Date(transaction.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleCopyId = () => {
    onShare(`Copied Ref ID: ${transaction.id}`);
  };

  const handleShareReceipt = () => {
    onShare(`Digital receipt for ${transaction.recipient} shared successfully!`);
    onClose();
  };

  return (
    <Modal visible={!!transaction} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Transaction Receipt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Amount Badge */}
          <View style={styles.amountCard}>
            <View
              style={[
                styles.iconWrap,
                isIncome
                  ? styles.iconIncome
                  : isTransfer
                  ? styles.iconTransfer
                  : styles.iconExpense,
              ]}
            >
              <Ionicons
                name={isIncome ? 'arrow-down' : isTransfer ? 'swap-horizontal' : 'arrow-up'}
                size={28}
                color={isIncome ? colors.primary : isTransfer ? colors.secondary : colors.text}
              />
            </View>

            <Text
              style={[
                styles.amountText,
                isIncome
                  ? styles.amountIncome
                  : isTransfer
                  ? styles.amountTransfer
                  : styles.amountExpense,
              ]}
            >
              {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}
              {formatAmount(transaction.amount, transaction.currency)}
            </Text>

            <Text style={styles.recipientName}>{transaction.recipient}</Text>

            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>

          {/* Breakdown Items */}
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank Account</Text>
              <Text style={styles.detailValue}>{transaction.bankName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{transaction.category}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>

            {transaction.note ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Note</Text>
                <Text style={styles.detailValue}>{transaction.note}</Text>
              </View>
            ) : null}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference ID</Text>
              <TouchableOpacity
                onPress={handleCopyId}
                style={styles.copyIdBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.idText}>
                  {transaction.id.slice(0, 16)}...
                </Text>
                <Ionicons name="copy-outline" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <Button
              text="Share Digital Receipt"
              onPress={handleShareReceipt}
              icon="share-social-outline"
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
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
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconIncome: {
    backgroundColor: '#052E16',
    borderWidth: 1.5,
    borderColor: '#15803D',
  },
  iconExpense: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconTransfer: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  amountText: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
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
  recipientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 214, 50, 0.3)',
  },
  statusText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  detailsBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
  },
  copyIdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionRow: {
    marginTop: 8,
  },
});
