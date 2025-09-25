// src/modules/employee/settings/components/EmergencyContactCreate.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createEmergencyContact } from '../store/actions';
import { selectCreateECLoading, selectCreateECError } from '../store/selectors';

export default function EmergencyContactCreate({ employeeId, onCreated }) {
  const dispatch = useDispatch();
  const creating = useSelector(selectCreateECLoading);
  const createErr = useSelector(selectCreateECError);

  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    relationship: '',
  });

  useEffect(() => {
    if (!creating && open && !createErr) {
      // close when creation finished successfully
      // (we rely on parent saga refreshing the list)
    }
  }, [creating, createErr, open]);

  const submit = () => {
    if (!f.name.trim() || !f.mobile.trim() || !f.relationship.trim()) {
      Alert.alert(
        'Missing fields',
        'Name, Mobile and Relationship are required.',
      );
      return;
    }
    dispatch(createEmergencyContact({ employeeId, contact: f }));
    setOpen(false);
    setF({ name: '', email: '', mobile: '', address: '', relationship: '' });
    onCreated?.();
  };

  return (
    <View>
      <Pressable style={styles.primaryBtn} onPress={() => setOpen(true)}>
        <Text style={styles.primaryTxt}>+ Create New</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Emergency Contact</Text>

            {createErr ? (
              <Text style={styles.err}>Error: {String(createErr)}</Text>
            ) : null}

            <Field
              label="Name *"
              value={f.name}
              onChangeText={v => setF({ ...f, name: v })}
            />
            <Field
              label="Email"
              value={f.email}
              onChangeText={v => setF({ ...f, email: v })}
              keyboardType="email-address"
            />
            <Field
              label="Mob. Number *"
              value={f.mobile}
              onChangeText={v => setF({ ...f, mobile: v })}
              keyboardType="phone-pad"
            />
            <Field
              label="Relationship *"
              value={f.relationship}
              onChangeText={v => setF({ ...f, relationship: v })}
            />
            <Field
              label="Address"
              value={f.address}
              onChangeText={v => setF({ ...f, address: v })}
              multiline
            />

            <View style={styles.modalActions}>
              <Pressable onPress={() => setOpen(false)} style={styles.ghostBtn}>
                <Text style={styles.ghostTxt}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={submit}
                style={[styles.primaryBtn, { paddingHorizontal: 16 }]}
              >
                {creating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryTxt}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: '#2c7be5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
  ghostBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  ghostTxt: { color: '#111827', fontWeight: '800' },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    color: '#111827',
  },
  label: { color: '#374151', fontWeight: '800', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  err: { color: '#b00020', marginBottom: 6 },
});
