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
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function ReceiveMoneyModal({ visible, onClose, onSuccess }: Props) {
  const { activeAccount, state, receiveMoney } = useBank();
  const [requestAmount, setRequestAmount] = useState('');
  const [senderName, setSenderName] = useState('Sarah Jenkins');

  const paymentLink = `https://cash.clone/pay/${state.profile.cashtag.replace('$', '')}`;

  const handleCopyLink = () => {
    onSuccess(`Payment link copied: ${paymentLink}`);
  };

  const handleSimulatePayment = () => {
    const num = parseFloat(requestAmount) || 150;
    receiveMoney(num, senderName || 'Demo Payer', 'Simulated peer payment');
    onSuccess(`Received ${formatAmount(num, activeAccount.currency)} from ${senderName}!`);
    setRequestAmount('');
    onClose();
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Receive & Request</Text>
              <Text style={styles.subtitle}>
                Into: {activeAccount.flag} {activeAccount.bankName}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Visual QR Code Card */}
            <View style={styles.qrCard}>
              <View style={styles.qrBox}>
                <Ionicons name="qr-code" size={130} color="#000000" />
                <View style={styles.cashtagBadge}>
                  <Text style={styles.cashtagBadgeText}>{state.profile.cashtag}</Text>
                </View>
              </View>

              <Text style={styles.userName}>{state.profile.name}</Text>
              <Text style={styles.accountSub}>
                {activeAccount.bankName} • {activeAccount.currency}
              </Text>
              <Text style={styles.acctNum}>
                {activeAccount.identifierType}: {activeAccount.identifierValue}
              </Text>

              {/* Share link button */}
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={handleCopyLink}
                activeOpacity={0.8}
              >
                <Ionicons name="link-outline" size={16} color={colors.primary} />
                <Text style={styles.shareText}>Copy Payment Link</Text>
              </TouchableOpacity>
            </View>

            {/* Simulated Live Payment Tester for the school project demo */}
            <View style={styles.simulateCard}>
              <View style={styles.simulateHeader}>
                <Ionicons name="flash" size={16} color={colors.warning} />
                <Text style={styles.simulateTitle}>Demo Simulator (School Project)</Text>
              </View>
              <Text style={styles.simulateDesc}>
                Simulate a friend or client sending payment into your {activeAccount.countryName} account right now:
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Sender name"
                  placeholderTextColor={colors.textMuted}
                  value={senderName}
                  onChangeText={setSenderName}
                />
                <TextInput
                  style={[styles.input, { width: 110 }]}
                  placeholder="Amount"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={requestAmount}
                  onChangeText={setRequestAmount}
                />
              </View>

              <Button
                text={`Simulate Receive +${activeAccount.symbol}${requestAmount || '150'}`}
                onPress={handleSimulatePayment}
                variant="primary"
                icon="download-outline"
                style={{ marginTop: 8 }}
              />
            </View>
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
  qrCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  cashtagBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cashtagBadgeText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 10,
  },
  accountSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  acctNum: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 14,
  },
  shareText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  simulateCard: {
    backgroundColor: '#1C1917',
    borderWidth: 1,
    borderColor: '#78350F',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  simulateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  simulateTitle: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '800',
  },
  simulateDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
  },
});
