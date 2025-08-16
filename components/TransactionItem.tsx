
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { formatAmount } from '../utils/currency';
import { Transaction } from '../types';

export default function TransactionItem({ tx, currency }: { tx: Transaction; currency: string }) {
  const income = tx.type === 'in';
  return (
    <View style={[styles.item]}>
      <View style={[styles.iconWrap, { backgroundColor: income ? '#E6F3EC' : '#FCE8E6' }]}>
        <Icon name={income ? 'arrow-down-circle' : 'arrow-up-circle'} color={income ? '#0F9D58' : '#D93025'} size={22} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{tx.note || (income ? 'Received' : 'Sent')}</Text>
        <Text style={[commonStyles.muted, { fontSize: 12 }]}>{new Date(tx.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={[styles.amount, { color: income ? '#0F9D58' : '#D93025' }]}>
        {income ? '+' : '-'}
        {formatAmount(tx.amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontWeight: '700',
  },
  amount: {
    fontWeight: '900',
  },
});
