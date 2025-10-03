// src/modules/employee/leads/components/AddLeadModal.js
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createLead } from '../store/actions';
import {
  selectLeadCreateLoading,
  selectLeadCreateError,
} from '../store/selectors';

export default function AddLeadModal({ visible, onClose, defaultEmployeeId }) {
  const dispatch = useDispatch();
  const saving = useSelector(selectLeadCreateLoading);
  const saveErr = useSelector(selectLeadCreateError);

  const [f, setF] = useState({
    name: '',
    email: '',
    clientCategory: 'Premium',
    leadSource: 'Referral',
    leadOwner: defaultEmployeeId || '',
    addedBy: defaultEmployeeId || '',
    createDeal: false,
    autoConvertToClient: false,
    companyName: '',
    officialWebsite: '',
    mobileNumber: '',
    officePhone: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    companyAddress: '',
  });

  useEffect(() => {
    if (visible)
      setF(prev => ({
        ...prev,
        leadOwner: defaultEmployeeId || prev.leadOwner,
        addedBy: defaultEmployeeId || prev.addedBy,
      }));
  }, [visible, defaultEmployeeId]);

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const onSubmit = () => {
    if (!f.name.trim() || !f.email.trim() || !f.companyName.trim()) {
      Alert.alert('Missing fields', 'Name, Email and Company are required.');
      return;
    }
    dispatch(
      createLead(f, (created, err) => {
        if (err) {
          Alert.alert('Create failed', String(err?.message || err));
          return;
        }
        onClose?.();
        // reset for next time
        setF(s => ({
          ...s,
          name: '',
          email: '',
          companyName: '',
          mobileNumber: '',
          officePhone: '',
        }));
      }),
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Add Lead</Text>
          {saveErr ? (
            <Text style={styles.err}>Error: {String(saveErr)}</Text>
          ) : null}

          <ScrollView
            style={{ maxHeight: 520 }}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <Row label="Name *">
              <Input value={f.name} onChangeText={v => set('name', v)} />
            </Row>
            <Row label="Email *">
              <Input
                value={f.email}
                onChangeText={v => set('email', v)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Row>

            <Row label="Client Category">
              <Input
                value={f.clientCategory}
                onChangeText={v => set('clientCategory', v)}
                placeholder="Premium / Corporate / ..."
              />
            </Row>
            <Row label="Lead Source">
              <Input
                value={f.leadSource}
                onChangeText={v => set('leadSource', v)}
                placeholder="Referral / Website / ..."
              />
            </Row>

            <Row label="Lead Owner">
              <Input
                value={f.leadOwner}
                onChangeText={v => set('leadOwner', v)}
                autoCapitalize="characters"
              />
            </Row>
            <Row label="Added By">
              <Input
                value={f.addedBy}
                onChangeText={v => set('addedBy', v)}
                autoCapitalize="characters"
              />
            </Row>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Create Deal</Text>
              <Switch
                value={f.createDeal}
                onValueChange={v => set('createDeal', v)}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Auto Convert To Client</Text>
              <Switch
                value={f.autoConvertToClient}
                onValueChange={v => set('autoConvertToClient', v)}
              />
            </View>

            <Row label="Company Name *">
              <Input
                value={f.companyName}
                onChangeText={v => set('companyName', v)}
              />
            </Row>
            <Row label="Official Website">
              <Input
                value={f.officialWebsite}
                onChangeText={v => set('officialWebsite', v)}
                autoCapitalize="none"
              />
            </Row>

            <Row label="Mobile Number">
              <Input
                value={f.mobileNumber}
                onChangeText={v => set('mobileNumber', v)}
                keyboardType="phone-pad"
              />
            </Row>
            <Row label="Office Phone">
              <Input
                value={f.officePhone}
                onChangeText={v => set('officePhone', v)}
                keyboardType="phone-pad"
              />
            </Row>

            <Row label="City">
              <Input value={f.city} onChangeText={v => set('city', v)} />
            </Row>
            <Row label="State">
              <Input value={f.state} onChangeText={v => set('state', v)} />
            </Row>
            <Row label="Postal Code">
              <Input
                value={f.postalCode}
                onChangeText={v => set('postalCode', v)}
                autoCapitalize="none"
              />
            </Row>
            <Row label="Country">
              <Input value={f.country} onChangeText={v => set('country', v)} />
            </Row>

            <Row label="Company Address">
              <Input
                value={f.companyAddress}
                onChangeText={v => set('companyAddress', v)}
                multiline
                style={{ height: 80, textAlignVertical: 'top' }}
              />
            </Row>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.ghostBtn}>
              <Text style={styles.ghostTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onSubmit}
              disabled={saving}
              style={[styles.primaryBtn, saving && { opacity: 0.6 }]}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryTxt}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, children }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}
function Input(props) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="#9ca3af"
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 8 },
  label: { color: '#374151', fontWeight: '800', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: { color: '#374151', fontWeight: '800' },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  ghostBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  ghostTxt: { color: '#111827', fontWeight: '800' },
  primaryBtn: {
    backgroundColor: '#2c7be5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
  err: { color: '#b00020', marginBottom: 6 },
});
