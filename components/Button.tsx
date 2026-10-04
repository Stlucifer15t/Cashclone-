import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  text,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      case 'ghost':
        return styles.btnGhost;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'danger':
        return styles.textDanger;
      case 'ghost':
        return styles.textGhost;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.base, getContainerStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#000000' : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={
                variant === 'primary'
                  ? '#000000'
                  : variant === 'outline'
                  ? colors.text
                  : variant === 'danger'
                  ? '#FFFFFF'
                  : colors.primary
              }
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  textPrimary: {
    color: '#000000',
    fontWeight: '800',
  },
  btnSecondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  textSecondary: {
    color: colors.text,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  textOutline: {
    color: colors.text,
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  textDanger: {
    color: '#FFFFFF',
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  textGhost: {
    color: colors.textSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
});
