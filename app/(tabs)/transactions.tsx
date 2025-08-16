
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useBank } from '../../context/BankContext';
import TransactionItem from '../../components/TransactionItem';
import Button from '../../components/Button';
import ActionSheetModal from '../../components/ActionSheetModal';
import { useState } from 'react';

export default function Transactions() {
  const { state, addTransaction, receiveTransaction } = useBank();
  const [actionVisible, setActionVisible] = useState<null | 'add' | 'receive'>(null);

  return (
    <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <Text style={commonStyles.title}>Transactions</Text>

        <View style={[commonStyles.row, commonStyles.between, { marginBottom: 10 }]}>
          <Button
            text="Add Money"
            onPress={() => setActionVisible('add')}
            style={styles.btnPrimary}
            textStyle={styles.btnPrimaryText}
          />
          <Button
            text="Receive"
            onPress={() => setActionVisible('receive')}
            style={styles.btnSecondary}
            textStyle={styles.btnSecondaryText}
          />
        </View>

        <View style={commonStyles.card}>
          {state.transactions.length === 0 ? (
            <Text style={[commonStyles.text, commonStyles.muted]}>No transactions yet.</Text>
          ) : (
            state.transactions.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} currency={state.currency} />
            ))
          )}
        </View>
      </View>

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
              console.log('Invalid amount in transactions action sheet', payload);
            }
          } catch (e) {
            console.log('Confirm handler error in transactions screen', e);
          }
          setActionVisible(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    backgroundColor: colors.primary,
    width: '48%',
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '800',
  },
  btnSecondary: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    width: '48%',
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnSecondaryText: {
    color: colors.text,
    fontWeight: '800',
  },
});
