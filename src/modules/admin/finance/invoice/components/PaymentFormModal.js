import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function PaymentFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}) {
  const blank = {
    projectId: '',
    clientId: '',
    currency: 'USD',
    amount: '',
    transactionId: '',
    invoiceId: '',
    paymentGatewayId: '',
    notes: '',
  };
  const [form, setForm] = useState(initial || blank);
  const [file, setFile] = useState(null); // { uri, name, type }
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Add Payment</Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
        {Object.entries(form).map(([k, v]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{k}</Text>
            <TextInput
              value={String(v ?? '')}
              onChangeText={t => change(k, t)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 6 }}>File (URI)</Text>
          <TextInput
            value={file?.uri || ''}
            onChangeText={t =>
              setFile(
                t ? { uri: t, name: 'payment.png', type: 'image/png' } : null,
              )
            }
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 10,
              padding: 10,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            onSubmit({
              payment: {
                ...form,
                amount: Number(form.amount) || 0,
                paymentGatewayId: Number(form.paymentGatewayId) || 1,
              },
              file,
            })
          }
          style={{ backgroundColor: '#111827', padding: 14, borderRadius: 10 }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
