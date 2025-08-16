
import { useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import { useBank } from '../../context/BankContext';
import CurrencyPicker from '../../components/CurrencyPicker';
import ActionSheetModal from '../../components/ActionSheetModal';
import { formatAmount } from '../../utils/currency';
import TransactionItem from '../../components/TransactionItem';

export default function Dashboard() {
  const { state, addTransaction, receiveTransaction, setCurrency } = useBank();
  const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);
  const [actionVisible, setActionVisible] = useState<null | 'add' | 'receive'>(null);

  const balance = useMemo(() => {
    return state.accounts.reduce((sum, a) => sum + a.balance, 0);
  }, [state.accounts]);

  const lastTransactions = useMemo(() => {
    return [...state.transactions].slice(0, 6);
  }, [state.transactions]);

  return (
    <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <View style={[commonStyles.card, styles.headerCard]}>
          <View style={[commonStyles.row, commonStyles.between]}>
            <View>
              <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>Total Balance</Text>
              <Text style={styles.balanceText}>
                {formatAmount(balance, state.currency)}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setCurrencyPickerVisible(true)}
              style={styles.currencyButton}
              activeOpacity={0.8}
            >
              <Text style={styles.currencyText}>{state.currency}</Text>
            </TouchableOpacity>
          </View>

          <View style={[commonStyles.row, { marginTop: 16 }]}>
            <View style={[styles.donutWrapper]}>
              <View style={styles.donutBase} />
              <View style={[styles.halfCircle, styles.leftHalf]} />
              <View style={[styles.halfCircle, styles.rightHalf]} />
              <View style={styles.donutHole} />
              <Text style={styles.donutLabel}>75%</Text>
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={commonStyles.subtitle}>Spending this month</Text>
              <Text style={[commonStyles.text, commonStyles.muted]}>
                75% of your planned budget used.
              </Text>
            </View>
          </View>

          <View style={[commonStyles.row, commonStyles.between, { marginTop: 16 }]}>
            <Button
              text="Add Money"
              onPress={() => setActionVisible('add')}
              style={buttonStyles.primaryBtn}
              textStyle={buttonStyles.primaryBtnText}
            />
            <Button
              text="Receive"
              onPress={() => setActionVisible('receive')}
              style={buttonStyles.secondaryBtn}
              textStyle={buttonStyles.secondaryBtnText}
            />
          </View>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={[commonStyles.title, { fontSize: 20 }]}>Latest Transactions</Text>
          <View style={[commonStyles.card]}>
            {lastTransactions.length === 0 ? (
              <Text style={[commonStyles.text, commonStyles.muted]}>No transactions yet.</Text>
            ) : (
              lastTransactions.map((tx) => <TransactionItem key={tx.id} tx={tx} currency={state.currency} />)
            )}
          </View>
        </View>
      </View>

      <CurrencyPicker
        visible={currencyPickerVisible}
        current={state.currency}
        onClose={() => setCurrencyPickerVisible(false)}
        onSelect={(cur) => {
          setCurrency(cur);
          setCurrencyPickerVisible(false);
        }}
      />

      <ActionSheetModal
        visible={actionVisible !== null}
        title={actionVisible === 'add' ? 'Add Money' : 'Receive Money'}
        confirmText={actionVisible === 'add' ? 'Add' : 'Receive'}
        onClose={() => setActionVisible(null)}
        onConfirm={(payload) => {
          try {
            const amount = parseFloat(payload.amount || '0');
            const note = payload.note || '';
            if (!isNaN(amount) && amount > 0) {
              if (actionVisible === 'add') {
                addTransaction(amount, note);
              } else {
                receiveTransaction(amount, note);
              }
            } else {
              console.log('Invalid amount submitted to action sheet:', payload);
            }
          } catch (e) {
            console.log('Failed to parse amount in action sheet onConfirm', e);
          }
          setActionVisible(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    padding: 16,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  currencyButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.06)',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  donutWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutBase: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8EEF9',
    position: 'absolute',
  },
  donutHole: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    position: 'absolute',
  },
  donutLabel: {
    position: 'absolute',
    fontWeight: '800',
    color: colors.text,
  },
  halfCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  leftHalf: {
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    borderLeftColor: colors.primary,
    borderBottomColor: colors.primary,
    borderWidth: 8,
    transform: [{ rotate: '135deg' }],
  },
  rightHalf: {
    borderRightColor: colors.primary,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: 8,
    transform: [{ rotate: '135deg' }],
  },
});

const buttonStyles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '48%',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '48%',
  },
  secondaryBtnText: {
    color: colors.text,
    fontWeight: '800',
  },
});
