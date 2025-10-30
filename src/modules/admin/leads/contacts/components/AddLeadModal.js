// src/modules/admin/leads/contacts/components/AddLeadModal.tsx
import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';

const Field = ({ label, required, children }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>
      {label} {required ? <Text style={{ color: '#ef4444' }}>*</Text> : null}
    </Text>
    {children}
  </View>
);

export default function AddLeadModal({
  visible,
  onClose,
  onSave,
  currentUserId, // e.g. EMP-009 for addedBy default
  defaultOwnerId, // e.g. EMP-010
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    clientCategory: 'Corporate',
    addedBy: currentUserId || '',
    leadOwner: defaultOwnerId || '',
    createDeal: false,
    autoConvertToClient: false,
    deal: {
      title: '',
      pipeline: 'Default Pipeline',
      dealStage: 'Win',
      dealCategory: 'Enterprise',
      value: '',
      expectedCloseDate: '',
      dealAgent: defaultOwnerId || '',
      dealWatchers: [defaultOwnerId || ''],
    },
  });
  const [saving, setSaving] = useState(false);
  const valid = useMemo(
    () =>
      form.name.trim() &&
      (form.email.trim() || form.mobileNumber.trim()) &&
      form.leadOwner &&
      form.addedBy,
    [form],
  );

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
  const setDeal = (k, v) =>
    setForm(s => ({ ...s, deal: { ...s.deal, [k]: v } }));

  const submit = async () => {
    if (!valid || saving) return;
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        clientCategory: form.clientCategory,
        addedBy: form.addedBy,
        leadOwner: form.leadOwner,
        createDeal: !!form.createDeal,
        autoConvertToClient: !!form.autoConvertToClient,
        ...(form.createDeal
          ? {
              deal: {
                title: form.deal.title.trim(),
                pipeline: form.deal.pipeline,
                dealStage: form.deal.dealStage,
                dealCategory: form.deal.dealCategory,
                value: Number(form.deal.value || 0),
                expectedCloseDate: form.deal.expectedCloseDate,
                dealAgent: form.deal.dealAgent,
                dealWatchers: form.deal.dealWatchers?.filter(Boolean) || [],
              },
            }
          : {}),
      };
      console.log('[LEADS][MODAL] will save ->', payload);
      await onSave?.(payload);
      dispatch(createLeadRequest(payload));
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add Lead</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
            <Field label="Lead Name" required>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={v => set('name', v)}
              />
            </Field>
            <Field label="Email">
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={v => set('email', v)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Field>
            <Field label="Mobile">
              <TextInput
                style={styles.input}
                value={form.mobileNumber}
                onChangeText={v => set('mobileNumber', v)}
                keyboardType="phone-pad"
              />
            </Field>
            <Field label="Client Category">
              <TextInput
                style={styles.input}
                value={form.clientCategory}
                onChangeText={v => set('clientCategory', v)}
              />
            </Field>
            <Field label="Lead Owner (Employee ID)" required>
              <TextInput
                style={styles.input}
                value={form.leadOwner}
                onChangeText={v => set('leadOwner', v)}
                autoCapitalize="characters"
              />
            </Field>
            <Field label="Added By (Employee ID)" required>
              <TextInput
                style={styles.input}
                value={form.addedBy}
                onChangeText={v => set('addedBy', v)}
                autoCapitalize="characters"
              />
            </Field>

            <View style={styles.row}>
              <Text style={styles.label}>Create Deal</Text>
              <Switch
                value={form.createDeal}
                onValueChange={v => set('createDeal', v)}
              />
            </View>
            <View style={[styles.row, { marginBottom: 12 }]}>
              <Text style={styles.label}>Auto Convert To Client</Text>
              <Switch
                value={form.autoConvertToClient}
                onValueChange={v => set('autoConvertToClient', v)}
              />
            </View>

            {form.createDeal && (
              <View style={styles.block}>
                <Text style={styles.subTitle}>Deal Details</Text>
                <Field label="Title">
                  <TextInput
                    style={styles.input}
                    value={form.deal.title}
                    onChangeText={v => setDeal('title', v)}
                  />
                </Field>
                <Field label="Pipeline">
                  <TextInput
                    style={styles.input}
                    value={form.deal.pipeline}
                    onChangeText={v => setDeal('pipeline', v)}
                  />
                </Field>
                <Field label="Stage">
                  <TextInput
                    style={styles.input}
                    value={form.deal.dealStage}
                    onChangeText={v => setDeal('dealStage', v)}
                  />
                </Field>
                <Field label="Category">
                  <TextInput
                    style={styles.input}
                    value={form.deal.dealCategory}
                    onChangeText={v => setDeal('dealCategory', v)}
                  />
                </Field>
                <Field label="Value (number)">
                  <TextInput
                    style={styles.input}
                    value={String(form.deal.value)}
                    onChangeText={v => setDeal('value', v)}
                    keyboardType="numeric"
                  />
                </Field>
                <Field label="Expected Close Date (YYYY-MM-DD)">
                  <TextInput
                    style={styles.input}
                    value={form.deal.expectedCloseDate}
                    onChangeText={v => setDeal('expectedCloseDate', v)}
                  />
                </Field>
                <Field label="Deal Agent (Employee ID)">
                  <TextInput
                    style={styles.input}
                    value={form.deal.dealAgent}
                    onChangeText={v => setDeal('dealAgent', v)}
                    autoCapitalize="characters"
                  />
                </Field>
                <Field label="Deal Watchers (comma-sep Employee IDs)">
                  <TextInput
                    style={styles.input}
                    value={(form.deal.dealWatchers || []).join(',')}
                    onChangeText={v =>
                      setDeal(
                        'dealWatchers',
                        v.split(',').map(s => s.trim()),
                      )
                    }
                    autoCapitalize="characters"
                  />
                </Field>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.btnTxtDark}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, valid ? styles.save : styles.saveDisabled]}
              onPress={submit}
              disabled={!valid || saving}
            >
              <Text style={styles.btnTxtLight}>
                {saving ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '90%',
    padding: 14,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  block: { paddingVertical: 8 },
  subTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  cancel: { borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  save: { backgroundColor: '#111827' },
  saveDisabled: { backgroundColor: '#9ca3af' },
  btnTxtLight: { color: '#fff', fontWeight: '900' },
  btnTxtDark: { color: '#111827', fontWeight: '900' },
});
