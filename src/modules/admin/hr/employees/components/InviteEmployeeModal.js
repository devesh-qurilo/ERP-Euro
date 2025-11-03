import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';

export default function InviteEmployeeModal({
  visible,
  onClose,
  onSend, // ({ to, message }) => void
  loading = false,
  lastSuccess = false, // optional: to show “sent” and auto close
}) {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState(
    "Welcome to the team! We're excited to have you onboard.",
  );

  useEffect(() => {
    if (!visible) {
      setTo('');
      setMessage("Welcome to the team! We're excited to have you onboard.");
    }
  }, [visible]);

  useEffect(() => {
    if (visible && lastSuccess && !loading) {
      // auto-close after success
      setTimeout(onClose, 600);
    }
  }, [lastSuccess, loading, visible, onClose]);

  const submit = () => {
    if (!to.trim()) return;
    onSend({ to: to.trim(), message: message.trim() });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Invite Employee</Text>

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={to}
            onChangeText={setTo}
            placeholder="jane.doe@company.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, { height: 110 }]}
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <View style={styles.btnRow}>
            <Pressable
              style={styles.secondaryBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.secondaryTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.primaryTxt, { color: '#fff' }]}>
                  Send Invite
                </Text>
              )}
            </Pressable>
          </View>

          {lastSuccess && !loading ? (
            <Text style={styles.success}>Invite email sent</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 8 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryTxt: { fontWeight: '900' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  secondaryTxt: { fontWeight: '800', color: '#111827' },
  success: { marginTop: 10, color: '#059669', fontWeight: '700' },
});
