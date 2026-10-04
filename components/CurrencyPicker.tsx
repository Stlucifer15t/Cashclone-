import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { CurrencyCode } from '../types';

const currencies: CurrencyCode[] = ['USD', 'CAD', 'EUR', 'GBP', 'NGN', 'JPY'];

interface Props {
  visible: boolean;
  current: CurrencyCode;
  onClose: () => void;
  onSelect: (currency: CurrencyCode) => void;
}

export default function CurrencyPicker({ visible, current, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
        accessibilityRole="button"
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>Choose Currency</Text>
          <ScrollView style={{ maxHeight: 320 }}>
            {currencies.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => onSelect(c)}
                style={[styles.item, c === current && styles.itemActive]}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={[styles.itemText, c === current && styles.itemTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 18,
    marginBottom: 14,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    marginBottom: 8,
  },
  itemActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  itemText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 15,
  },
  itemTextActive: {
    color: colors.primary,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  closeText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
});
