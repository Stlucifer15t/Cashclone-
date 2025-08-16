
import { StyleSheet } from 'react-native';

export const colors = {
  // Light theme palette
  primary: '#1A73E8',      // Blue
  secondary: '#0F9D58',     // Green accent
  accent: '#4285F4',        // Lighter blue
  background: '#F7F7FA',    // Light gray background
  backgroundAlt: '#FFFFFF', // Cards/background
  text: '#111111',          // Primary text
  mutedText: '#5F6368',     // Secondary text
  border: '#E0E3EB',        // Light border
  danger: '#D93025',        // Danger
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mutedText,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  muted: {
    color: colors.mutedText,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  between: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    marginVertical: 6,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.04)',
  },
  label: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 8,
    marginBottom: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
});
