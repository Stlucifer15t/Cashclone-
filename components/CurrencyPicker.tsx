
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';

const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'INR', 'JPY', 'CAD', 'AUD'];

interface Props {
  visible: boolean;
  current: string;
  onClose: () => void;
  onSelect: (currency: string) => void;
}

export default function CurrencyPicker({ visible, current, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} accessibilityRole="button">
        <View style={styles.sheet}>
          <Text style={styles.title}>Choose currency</Text>
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
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 360,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontWeight: '900',
    color: colors.text,
    fontSize: 18,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  itemActive: {
    backgroundColor: '#E8EEF9',
    borderColor: '#D3E1FF',
  },
  itemText: {
    color: colors.text,
    fontWeight: '700',
  },
  itemTextActive: {
    color: '#1A73E8',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  closeText: {
    color: '#fff',
    fontWeight: '800',
  },
});
