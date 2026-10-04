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

export default function NotificationsModal({ visible, onClose, onShowToast }: Props) {
  const { state, markAllNotificationsRead, clearNotifications } = useBank();

  const handleMarkAll = () => {
    markAllNotificationsRead();
    onShowToast('All notifications marked as read');
  };

  const handleClear = () => {
    clearNotifications();
    onShowToast('Cleared notification history');
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subtitle}>
                Security alerts, transaction receipts & dividends
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {state.notifications.length > 0 && (
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleMarkAll} style={styles.actionBtn}>
                <Ionicons name="checkmark-done" size={14} color={colors.primary} />
                <Text style={styles.actionText}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClear} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.actionText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {state.notifications.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="notifications-off-outline" size={38} color={colors.textMuted} />
                <Text style={styles.emptyText}>No recent alerts</Text>
              </View>
            ) : (
              state.notifications.map((n) => {
                const iconName =
                  n.type === 'security'
                    ? 'shield-checkmark'
                    : n.type === 'reward'
                    ? 'sparkles'
                    : 'card';
                const iconColor =
                  n.type === 'security'
                    ? colors.secondary
                    : n.type === 'reward'
                    ? colors.warning
                    : colors.primary;

                return (
                  <View key={n.id} style={[styles.notifCard, !n.read && styles.notifUnread]}>
                    <View style={[styles.iconCircle, { backgroundColor: `${iconColor}20` }]}>
                      <Ionicons name={iconName} size={18} color={iconColor} />
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.notifTitle}>{n.title}</Text>
                        {!n.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notifMessage}>{n.message}</Text>
                      <Text style={styles.notifTime}>
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
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
    maxHeight: '80%',
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
    marginBottom: 10,
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  list: {
    maxHeight: 380,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifUnread: {
    borderColor: colors.primary,
    backgroundColor: '#12261A',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notifMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
