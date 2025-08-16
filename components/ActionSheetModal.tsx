import { useEffect, useRef, useState } from 'react';
import { colors, commonStyles } from '../styles/commonStyles';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: (payload: { amount: string; note: string }) => void;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

const ActionSheetModal = ({ visible, title, confirmText = 'Confirm', onClose, onConfirm }: Props) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const handleConfirm = () => {
    onConfirm({ amount, note });
    setAmount('');
    setNote('');
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
            <TouchableOpacity onPress={(e) => e.stopPropagation()}>
              <Text style={styles.title}>{title}</Text>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <TextInput style={styles.input} placeholder="Note" value={note} onChangeText={setNote} />
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default ActionSheetModal;
