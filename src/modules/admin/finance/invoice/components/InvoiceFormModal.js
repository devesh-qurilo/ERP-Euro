import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function InvoiceFormModal({
  visible,
  onClose,
  initial,
  onSubmit,
}) {
  const blank = {
    invoiceNumber: '',
    invoiceDate: '',
    currency: 'USD',
    projectId: '',
    clientId: '',
    amount: '',
    tax: '',
    discount: '',
    amountInWords: '',
    notes: '',
  };
  const [form, setForm] = useState(blank);
  useEffect(() => {
    if (visible) setForm(initial || blank);
  }, [visible, initial]);
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {initial ? 'Edit Invoice' : 'Add Invoice'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          {[
            ['invoiceNumber', 'Invoice Number'],
            ['invoiceDate', 'Invoice Date (YYYY-MM-DD)'],
            ['currency', 'Currency'],
            ['projectId', 'Project ID'],
            ['clientId', 'Client ID'],
            ['amount', 'Amount'],
            ['tax', 'Tax %'],
            ['discount', 'Discount %'],
            ['amountInWords', 'Amount In Words'],
            ['notes', 'Notes'],
          ].map(([k, label]) => (
            <View key={k} style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6, color: '#374151' }}>{label}</Text>
              <TextInput
                value={String(form[k] ?? '')}
                onChangeText={t => change(k, t)}
                placeholder={label}
                keyboardType={
                  ['amount', 'tax', 'discount'].includes(k)
                    ? 'numeric'
                    : 'default'
                }
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              const payload = {
                ...form,
                amount: Number(form.amount) || 0,
                tax: Number(form.tax) || 0,
                discount: Number(form.discount) || 0,
              };
              onSubmit(payload);
            }}
            style={{
              marginTop: 8,
              backgroundColor: '#111827',
              padding: 14,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
