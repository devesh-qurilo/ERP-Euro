import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import * as DocumentPicker from '@react-native-documents/picker';

function toRNFile(doc) {
  const uri = doc.fileCopyUri || doc.uri;
  return {
    uri,
    name: doc.name || 'payment.bin',
    type: doc.type || 'application/octet-stream',
  };
}

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
  const [file, setFile] = useState(null);

  function change(k, v) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function pickReceipt() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      const doc = Array.isArray(res) ? res[0] : res;
      setFile(toRNFile(doc));
    } catch (e) {
      if (DocumentPicker.isCancel && DocumentPicker.isCancel(e)) {
        // user cancelled
      } else {
        console.log('[PaymentFormModal] picker error:', e?.message);
      }
    }
  }

  function save() {
    const payload = {
      ...form,
      amount: Number(form.amount) || 0,
      paymentGatewayId: Number(form.paymentGatewayId) || 1,
    };
    onSubmit({ payment: payload, file }); // parent dispatches A.addPayment({ payment, file })
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{ flex: 1, backgroundColor: '#fff', padding: 16, marginTop: 50 }}
      >
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

        {Object.entries({
          projectId: form.projectId,
          clientId: form.clientId,
          currency: form.currency,
          amount: form.amount,
          transactionId: form.transactionId,
          invoiceId: form.invoiceId,
          paymentGatewayId: form.paymentGatewayId,
          notes: form.notes,
        }).map(([k, v]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{k}</Text>
            <TextInput
              value={String(v ?? '')}
              onChangeText={t => change(k, t)}
              keyboardType={
                ['amount', 'paymentGatewayId'].includes(k)
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

        <TouchableOpacity
          onPress={pickReceipt}
          style={{
            backgroundColor: '#111827',
            padding: 12,
            borderRadius: 10,
            marginTop: 4,
          }}
          activeOpacity={0.9}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose receipt (doc/image)
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
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
              Attached:
            </Text>
            <Text numberOfLines={1}>Name: {file.name}</Text>
            <Text numberOfLines={1}>Type: {file.type}</Text>
            <Text numberOfLines={1}>URI: {file.uri}</Text>
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
          activeOpacity={0.9}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Save Payment
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
