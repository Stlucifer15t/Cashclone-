import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import { BankAccount } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  account: BankAccount;
  onToggleFreeze: () => void;
  onShowToast: (msg: string) => void;
}

export default function VirtualCardView({ account, onToggleFreeze, onShowToast }: Props) {
  const [showSensitive, setShowSensitive] = useState(false);
  const { card } = account;

  const maskedNumber = showSensitive
    ? card.cardNumber
    : `•••• •••• •••• ${card.cardNumber.slice(-4)}`;

  const maskedCVV = showSensitive ? card.cvv : '•••';

  const copyCardNumber = () => {
    onShowToast(`Card number copied: ${card.cardNumber.slice(-4)}`);
  };

  return (
    <View style={styles.wrapper}>
      {/* Visual Debit Card */}
      <View
        style={[
          styles.cardContainer,
          { backgroundColor: account.color },
          card.isFrozen && styles.cardFrozen,
        ]}
      >
        {/* Top row: Flag, Bank name, Contactless */}
        <View style={styles.topRow}>
          <View style={styles.bankTag}>
            <Text style={styles.flagText}>{account.flag}</Text>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.bankTitle}>{account.bankName}</Text>
              <Text style={styles.countrySub}>{account.countryName} • {account.currency}</Text>
            </View>
          </View>

          <View style={styles.contactlessWrap}>
            <Ionicons name="radio" size={20} color="#FFFFFF" />
          </View>
        </View>

        {/* EMV Chip & Reveal Toggle */}
        <View style={styles.chipRow}>
          <View style={styles.chipGraphic}>
            <View style={styles.chipLine1} />
            <View style={styles.chipLine2} />
          </View>
          <TouchableOpacity
            style={styles.revealBtn}
            onPress={() => setShowSensitive(!showSensitive)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Ionicons
              name={showSensitive ? 'eye-off-outline' : 'eye-outline'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.revealText}>
              {showSensitive ? 'Hide Details' : 'Show Details'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Number */}
        <TouchableOpacity
          onPress={copyCardNumber}
          activeOpacity={0.8}
          style={styles.numberRow}
          accessibilityRole="button"
        >
          <Text style={styles.cardNumber}>{maskedNumber}</Text>
          <Ionicons name="copy-outline" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Bottom Details */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.label}>CARDHOLDER</Text>
            <Text style={styles.valText}>{card.cardholder}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={{ marginRight: 16 }}>
              <Text style={styles.label}>EXPIRES</Text>
              <Text style={styles.valText}>{card.expiry}</Text>
            </View>
            <View>
              <Text style={styles.label}>CVV</Text>
              <Text style={styles.valText}>{maskedCVV}</Text>
            </View>
          </View>

          <View style={styles.cardTypeWrap}>
            <Text style={styles.cardType}>{card.cardType}</Text>
          </View>
        </View>

        {/* Frozen Overlay */}
        {card.isFrozen && (
          <View style={styles.frozenOverlay}>
            <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
            <Text style={styles.frozenTitle}>CARD FROZEN</Text>
            <Text style={styles.frozenSub}>Transactions are temporarily disabled</Text>
          </View>
        )}
      </View>

      {/* Card Controls Bar */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.controlBtn, card.isFrozen && styles.controlBtnActive]}
          onPress={onToggleFreeze}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Ionicons
            name={card.isFrozen ? 'lock-open-outline' : 'lock-closed-outline'}
            size={16}
            color={card.isFrozen ? colors.warning : colors.text}
          />
          <Text style={[styles.controlText, card.isFrozen && { color: colors.warning }]}>
            {card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => onShowToast(`Card limit: ${account.currency} 2,500 / day`)}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Ionicons name="options-outline" size={16} color={colors.text} />
          <Text style={styles.controlText}>Limits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => onShowToast('PIN: **** (Sent via SMS)')}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Ionicons name="key-outline" size={16} color={colors.text} />
          <Text style={styles.controlText}>View PIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  cardContainer: {
    borderRadius: 22,
    padding: 22,
    height: 220,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0px 14px 30px rgba(0, 0, 0, 0.55)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 8,
      },
    }),
  },
  cardFrozen: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankTag: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagText: {
    fontSize: 26,
  },
  bankTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  countrySub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
  contactlessWrap: {
    opacity: 0.85,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  chipGraphic: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E5C07B',
    borderWidth: 1,
    borderColor: '#C6A55B',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  chipLine1: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginVertical: 4,
  },
  chipLine2: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    left: '50%',
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 4,
  },
  revealText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  valText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
  },
  cardTypeWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  frozenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 8,
  },
  frozenSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 12,
  },
  controlBtnActive: {
    borderColor: colors.warning,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  controlText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
