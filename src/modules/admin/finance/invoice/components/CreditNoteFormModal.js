import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import * as DocumentPicker from '@react-native-documents/picker';

const toRNFile = d => ({
  uri: d.fileCopyUri || d.uri,
  name: d.name || 'credit-note.bin',
  type: d.type || 'application/octet-stream',
});

export default function CreditNoteFormModal({
  visible,
  onClose,
  onSubmit,
  invoiceNumber,
}) {
  const blank = {
    creditNoteNumber: '',
    creditNoteDate: '',
    currency: 'USD',
    adjustment: '0',
    adjustmentPositive: true,
    tax: '0',
    amount: '',
    notes: '',
  };
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (visible) {
      setForm(blank);
      setFile(null);
    }
  }, [visible]);

  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function pickFile() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      const doc = Array.isArray(res) ? res[0] : res;
      setFile(toRNFile(doc));
    } catch (e) {
      if (!(DocumentPicker.isCancel && DocumentPicker.isCancel(e)))
        console.log('[CreditNoteForm] picker error:', e?.message);
    }
  }

  function save() {
    const payload = {
      creditNoteNumber: form.creditNoteNumber,
      creditNoteDate: form.creditNoteDate,
      currency: form.currency,
      adjustment: Number(form.adjustment) || 0,
      adjustmentPositive: !!form.adjustmentPositive,
      tax: Number(form.tax) || 0,
      amount: Number(form.amount) || 0,
      notes: form.notes,
    };
    onSubmit(invoiceNumber, payload, file);
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Add Credit Note
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        {[
          ['creditNoteNumber', 'Credit Note Number'],
          ['creditNoteDate', 'Credit Note Date (YYYY-MM-DD)'],
          ['currency', 'Currency'],
          ['amount', 'Amount'],
          ['tax', 'Tax %'],
          ['adjustment', 'Adjustment'],
          ['notes', 'Notes'],
        ].map(([k, label]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(form[k] ?? '')}
              onChangeText={t => change(k, t)}
              keyboardType={
                ['amount', 'tax', 'adjustment'].includes(k)
                  ? 'numeric'
                  : 'default'
              }
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ marginRight: 10 }}>Adjustment Positive?</Text>
          <Switch
            value={!!form.adjustmentPositive}
            onValueChange={v => change('adjustmentPositive', v)}
          />
        </View>

        <TouchableOpacity
          onPress={pickFile}
          style={{ backgroundColor: '#111827', padding: 12, borderRadius: 10 }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose document / image (optional)
          </Text>
        </TouchableOpacity>

        {file ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 10,
              padding: 12,
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: '600' }}>Attached:</Text>
            <Text numberOfLines={1}>Name: {file.name}</Text>
            <Text numberOfLines={1}>Type: {file.type}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={save}
          style={{
            backgroundColor: '#111827',
            padding: 14,
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}
