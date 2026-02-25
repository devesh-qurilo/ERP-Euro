// src/modules/admin/finance/CreditNoteFormModal.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(blank);
      setFile(null);
      setShowDatePicker(false);
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
      if (!(DocumentPicker.isCancel && DocumentPicker.isCancel(e))) {
        // console.log('[CreditNoteForm] picker error:', e?.message || e);
        Alert.alert('File pick failed');
      }
    }
  }

  // Date helpers
  const formatDate = d => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toISOString().slice(0, 10);
  };

  const creditNoteDateObj = useMemo(() => {
    if (!form.creditNoteDate) return new Date();
    const d = new Date(form.creditNoteDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [form.creditNoteDate]);

  function onDateChange(event, selectedDate) {
    // Android: picker closes automatically (unless using showDialog)
    if (Platform.OS !== 'ios') setShowDatePicker(false);
    if (event?.type === 'dismissed') return;
    if (selectedDate) change('creditNoteDate', formatDate(selectedDate));
  }

  function save() {
    // basic validation
    if (!form.creditNoteNumber) {
      Alert.alert('Validation', 'Credit note number is required');
      return;
    }
    if (!form.creditNoteDate) {
      Alert.alert('Validation', 'Credit note date is required');
      return;
    }

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
    // keep modal open/close decision to parent; we don't auto-close here
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: '#fff' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              backgroundColor: '#fff',
              paddingBottom: 40,
              marginTop: 60,
            }}
            keyboardShouldPersistTaps="handled"
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

            {/* Credit Note Number */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Credit Note Number</Text>
              <TextInput
                value={String(form.creditNoteNumber ?? '')}
                onChangeText={t => change('creditNoteNumber', t)}
                placeholder="e.g. CN-2025-001"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            {/* Credit Note Date */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>
                Credit Note Date (YYYY-MM-DD)
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 12,
                  justifyContent: 'center',
                }}
                activeOpacity={0.8}
              >
                <Text>{formatDate(form.creditNoteDate) || 'Select date'}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={creditNoteDateObj}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Currency */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Currency</Text>
              <TextInput
                value={String(form.currency ?? 'USD')}
                onChangeText={t => change('currency', t)}
                placeholder="Currency"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            {/* Amount */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Amount</Text>
              <TextInput
                value={String(form.amount ?? '')}
                onChangeText={t => change('amount', t)}
                placeholder="Amount"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            {/* Tax */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Tax %</Text>
              <TextInput
                value={String(form.tax ?? '0')}
                onChangeText={t => change('tax', t)}
                placeholder="Tax %"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            {/* Adjustment */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Adjustment</Text>
              <TextInput
                value={String(form.adjustment ?? '0')}
                onChangeText={t => change('adjustment', t)}
                placeholder="Adjustment"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

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

            {/* Notes (multiline) */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Notes</Text>
              <TextInput
                value={String(form.notes ?? '')}
                onChangeText={t => change('notes', t)}
                placeholder="Notes (optional)"
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            {/* File picker */}
            <TouchableOpacity
              onPress={pickFile}
              style={{
                backgroundColor: '#111827',
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '700',
                }}
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

            {/* Save */}
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
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
