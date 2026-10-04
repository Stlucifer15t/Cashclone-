import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import { useBank } from '../context/BankContext';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const ATMS = [
  {
    id: 'atm-1',
    name: 'Metropolitan Flagship Branch',
    address: '452 5th Avenue, New York, NY',
    distance: '0.2 miles away',
    type: 'Branch & ATM',
    features: ['24/7 Deposit', 'NFC Contactless', 'Teller Service'],
  },
  {
    id: 'atm-2',
    name: 'Allpoint Fee-Free Network ATM',
    address: 'Grand Central Terminal (Main Concourse)',
    distance: '0.4 miles away',
    type: 'ATM Only',
    features: ['Fee-Free', 'Cash Withdrawal', '24/7 Access'],
  },
  {
    id: 'atm-3',
    name: 'Financial Center International Hub',
    address: '100 Wall Street, Financial District',
    distance: '1.2 miles away',
    type: 'International Branch',
    features: ['Multi-Currency Exchange', 'Wire Desk', 'Private Banker'],
  },
];

export default function AtmLocatorModal({ visible, onClose, onShowToast }: Props) {
  const { activeAccount } = useBank();

  const handleDirections = (name: string) => {
    onShowToast(`Opening navigation to ${name}...`);
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>ATM & Branch Locator</Text>
              <Text style={styles.subtitle}>
                Fee-free access for {activeAccount.bankName} cardholders
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {ATMS.map((atm) => (
              <View key={atm.id} style={styles.atmCard}>
                <View style={styles.atmHeader}>
                  <View style={styles.iconWrap}>
                    <Ionicons name="location" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.atmName}>{atm.name}</Text>
                    <Text style={styles.atmAddress}>{atm.address}</Text>
                    <Text style={styles.distance}>{atm.distance}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => handleDirections(atm.name)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="navigate" size={16} color="#000000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.featuresRow}>
                  {atm.features.map((f, idx) => (
                    <View key={idx} style={styles.featurePill}>
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
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
    maxHeight: '85%',
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
    marginBottom: 16,
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
  atmCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  atmHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atmName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  atmAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  distance: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  navBtn: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  featurePill: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});
