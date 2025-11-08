import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { pick } from '@react-native-documents/picker';

export default function PaymentCreateModal({
  visible,
  preset = {},
  busy = false,
  onClose,
  onSave,
}) {
  const [projectId, setProjectId] = useState(preset.projectId || '');
  const [clientId, setClientId] = useState(preset.clientId || '');
  const [invoiceId, setInvoiceId] = useState(preset.invoiceId || '');
  const [currency, setCurrency] = useState(preset.currency || 'USD');
  const [amount, setAmount] = useState(
    preset.amount ? String(preset.amount) : '',
  );
  const [transactionId, setTransactionId] = useState('');
  const [paymentGatewayId, setPaymentGatewayId] = useState('1'); // OFFLINE default?
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (visible) {
      setProjectId(preset.projectId || '');
      setClientId(preset.clientId || '');
      setInvoiceId(preset.invoiceId || '');
      setCurrency(preset.currency || 'USD');
      setAmount(preset.amount ? String(preset.amount) : '');
      setTransactionId('');
      setPaymentGatewayId('1');
      setNotes('');
      setFile(null);
    }
  }, [visible, preset]);

  if (!visible) return null;

  const pickFile = async () => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        type: ['*/*'], // PDFs, images, any doc
      });
      if (res && res[0]) {
        const f = res[0];
        setFile({
          uri: f.uri,
          name: f.name || 'upload.bin',
          type: f.type || 'application/octet-stream',
        });
      }
    } catch (e) {
      if (String(e)?.includes('USER_CANCELLED')) return;
      Alert.alert('Picker Error', e?.message || 'Failed to pick file');
    }
  };

  const save = () => {
    if (!clientId || !projectId || !currency || !amount || !invoiceId) {
      Alert.alert(
        'Missing fields',
        'Client, Project, Currency, Amount, Invoice are required.',
      );
      return;
    }
    onSave?.({
      payment: {
        projectId: String(projectId),
        clientId: String(clientId),
        currency,
        amount: Number(amount || 0),
        transactionId: transactionId || `TXN-${Date.now()}`,
        invoiceId: String(invoiceId),
        paymentGatewayId: Number(paymentGatewayId || 0),
        notes,
      },
      file,
    });
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.ttl}>Add Payment</Text>

          <Field
            label="Client ID"
            value={clientId}
            onChangeText={setClientId}
          />
          <Field
            label="Project ID"
            value={projectId}
            onChangeText={setProjectId}
          />
          <Field
            label="Invoice ID / Number"
            value={invoiceId}
            onChangeText={setInvoiceId}
          />
          <Field label="Currency" value={currency} onChangeText={setCurrency} />
          <Field
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            kbType="numeric"
          />
          <Field
            label="Transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
          />
          <Field
            label="Payment Gateway ID"
            value={paymentGatewayId}
            onChangeText={setPaymentGatewayId}
            kbType="numeric"
          />
          <Field label="Notes" value={notes} onChangeText={setNotes} />

          <Pressable style={s.btn} onPress={pickFile}>
            <Text style={s.btnTxt}>
              {file ? `File: ${file.name}` : 'Attach File (optional)'}
            </Text>
          </Pressable>

          <Pressable disabled={busy} style={[s.btn, s.primary]} onPress={save}>
            <Text style={[s.btnTxt, { color: '#fff' }]}>
              {busy ? 'Saving…' : 'Save Payment'}
            </Text>
          </Pressable>
          <Pressable disabled={busy} style={s.btn} onPress={onClose}>
            <Text style={s.btnTxt}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChangeText, kbType }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={kbType || 'default'}
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: '#0f172a',
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  ttl: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTxt: { color: '#1d4ed8', fontWeight: '600' },
  primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
});
