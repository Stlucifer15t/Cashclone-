import { StyleSheet, Platform } from 'react-native';

export const colors = {
  // Brand palette
  primary: '#00D632',        // Cash App Electric Green
  primaryDark: '#00A827',
  primaryMuted: '#10381F',
  secondary: '#3B82F6',      // Royal Blue
  accent: '#8B5CF6',         // Purple
  warning: '#F59E0B',        // Amber
  danger: '#EF4444',         // Red
  success: '#10B981',        // Emerald

  // Base background & surfaces
  background: '#0D0F12',     // Ultra dark slate
  surface: '#16191E',        // Card background
  surfaceElevated: '#20242C',// Elevated cards/modals
  surfaceHighlight: '#2A303C',

  // Borders & Dividers
  border: '#272B35',
  borderLight: '#353B47',
  divider: '#1F242D',

  // Typography
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Utility colors referenced in components
  white: '#FFFFFF',
  black: '#000000',
  green: '#00D632',
  darkGray: '#16191E',
  lightGray: '#272B35',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  contentMaxWidth: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  cardElevated: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    marginVertical: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  pillActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  pillTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
