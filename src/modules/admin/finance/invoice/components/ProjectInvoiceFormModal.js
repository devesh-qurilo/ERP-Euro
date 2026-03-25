// ProjectInvoiceFormModal.js

import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProjectInvoiceFormModal({
  visible,
  onClose,
  onSave,
  initial,
  project, // ✅ full project object
  client, // ✅ full client object
}) {
  const blank = {
    invoiceNumber: '',
    invoiceDate: '',
    currency: 'INR',
    amount: '',
    tax: '',
    discount: '',
    amountInWords: '',
    notes: '',
  };

  const [form, setForm] = useState(blank);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ✅ Prefill when modal opens
  useEffect(() => {
    if (!visible) return;
    setForm({ ...blank, ...(initial || {}) });
  }, [visible]);

  const formatDate = d => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toISOString().slice(0, 10);
  };

  const invoiceDateObj = useMemo(() => {
    if (!form.invoiceDate) return new Date();
    return new Date(form.invoiceDate);
  }, [form.invoiceDate]);

  function onDateChange(e, d) {
    setShowDatePicker(false);
    if (d) change('invoiceDate', formatDate(d));
  }

  function handleSave() {
    if (!form.invoiceNumber) return Alert.alert('Invoice number required');

    if (!form.invoiceDate) return Alert.alert('Invoice date required');

    if (!project?.id) return Alert.alert('Project missing');

    if (!client?.clientId) return Alert.alert('Client missing');

    const payload = {
      ...form,
      projectId: project.id, // ✅ PRJ002
      clientId: client.clientId, // ✅ CLI010
      amount: Number(form.amount) || 0,
      tax: Number(form.tax) || 0,
      discount: Number(form.discount) || 0,
    };
    onSave(payload);
  }

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={{ padding: 16, marginTop: 50 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>Add Invoice</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 16, color: '#000000' }}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Locked Project */}
          <Text style={{ marginTop: 16 }}>Project</Text>
          <TextInput
            value={project?.name || ''}
            editable={false}
            style={styles.locked}
          />

          {/* ✅ Locked Project Code */}
          <Text style={{ marginTop: 8 }}>Project Code</Text>
          <TextInput
            value={project?.id || ''}
            editable={false}
            style={styles.locked}
          />

          {/* ✅ Locked Client */}
          <Text style={{ marginTop: 16 }}>Client</Text>
          <TextInput
            value={client?.name || ''}
            editable={false}
            style={styles.locked}
          />

          {/* Invoice Number */}
          <TextInput
            placeholder="Invoice Number"
            value={form.invoiceNumber}
            onChangeText={t => change('invoiceNumber', t)}
            style={styles.input}
          />

          {/* Date */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{form.invoiceDate || 'Select Date'}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={invoiceDateObj}
              mode="date"
              onChange={onDateChange}
            />
          )}

          {/* Amount */}
          <TextInput
            placeholder="Amount"
            keyboardType="numeric"
            value={form.amount}
            onChangeText={t => change('amount', t)}
            style={styles.input}
          />

          {/* Tax */}
          <TextInput
            placeholder="Tax %"
            keyboardType="numeric"
            value={form.tax}
            onChangeText={t => change('tax', t)}
            style={styles.input}
          />

          {/* Discount */}
          <TextInput
            placeholder="Discount %"
            keyboardType="numeric"
            value={form.discount}
            onChangeText={t => change('discount', t)}
            style={styles.input}
          />

          {/* Notes */}
          <TextInput
            placeholder="Notes"
            multiline
            value={form.notes}
            onChangeText={t => change('notes', t)}
            style={[styles.input, { height: 100 }]}
          />

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              Save Invoice
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  locked: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
  },
  btn: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
};
