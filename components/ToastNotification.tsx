import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  message: string | null;
  onHide: () => void;
  type?: 'success' | 'info' | 'warning';
}

export default function ToastNotification({ message, onHide, type = 'success' }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  const iconName =
    type === 'warning'
      ? 'alert-circle'
      : type === 'info'
      ? 'information-circle'
      : 'checkmark-circle';

  const iconColor =
    type === 'warning'
      ? colors.warning
      : type === 'info'
      ? colors.secondary
      : colors.primary;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="none"
    >
      <Ionicons name={iconName} size={20} color={iconColor} style={{ marginRight: 8 }} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 32,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#1E232B',
    borderColor: colors.borderLight,
    borderWidth: 1.5,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.6)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
      },
    }),
  },
  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
