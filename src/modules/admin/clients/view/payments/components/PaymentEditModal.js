import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function PaymentEditModal({
  visible,
  payment,
  busy,
  onClose,
  onSave,
}) {
  const p = payment || {};
  const [amount, setAmount] = useState(String(p.amount ?? ''));
  const [currency, setCurrency] = useState(p.currency || '');
  const [transactionId, setTransactionId] = useState(p.transactionId || '');
  const [paymentGatewayId, setPaymentGatewayId] = useState(
    String(p.paymentGateway?.id ?? ''),
  );
  const [status, setStatus] = useState(p.status || 'COMPLETED');
  const [notes, setNotes] = useState(p.note || '');

  useEffect(() => {
    setAmount(String(p.amount ?? ''));
    setCurrency(p.currency || '');
    setTransactionId(p.transactionId || '');
    setPaymentGatewayId(String(p.paymentGateway?.id ?? ''));
    setStatus(p.status || 'COMPLETED');
    setNotes(p.note || '');
  }, [p?.id, visible]);

  if (!visible) return null;

  const save = () =>
    onSave?.({
      amount: Number(amount || 0),
      currency,
      transactionId,
      paymentGatewayId: Number(paymentGatewayId || 0),
      status,
      notes,
    });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.ttl}>Edit Payment</Text>

          <Field
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            kbType="numeric"
          />
          <Field label="Currency" value={currency} onChangeText={setCurrency} />
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
          <Field label="Status" value={status} onChangeText={setStatus} />
          <Field label="Notes" value={notes} onChangeText={setNotes} />

          <Pressable disabled={busy} style={[s.btn, s.primary]} onPress={save}>
            <Text style={[s.btnTxt, { color: '#fff' }]}>
              {busy ? 'Saving…' : 'Save'}
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
