import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';

import { selectPaymentGateways } from '../../../../finance/paymentGateways/selectors';
import * as GatewaysActions from '../../../../finance/paymentGateways/actions';

/* ================= FIELD ================= */
function Field({ label, value, onChangeText, kbType }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={kbType || 'default'}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#9ca3af"
        style={s.input}
      />
    </View>
  );
}

/* ================= MAIN ================= */
export default function PaymentEditModal({
  visible,
  payment,
  busy,
  onClose,
  onSave,
}) {
  const dispatch = useDispatch();
  const gateways = useSelector(selectPaymentGateways) || [];

  const p = payment || {};

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentGatewayId, setPaymentGatewayId] = useState('');
  const [status, setStatus] = useState('COMPLETED');
  const [notes, setNotes] = useState('');

  /* ===== LOAD GATEWAYS ===== */
  useEffect(() => {
    dispatch(GatewaysActions.list());
  }, []);

  /* ===== PREFILL ===== */
  useEffect(() => {
    if (!visible) return;

    setAmount(String(p.amount ?? ''));
    setCurrency(p.currency || '');
    setTransactionId(p.transactionId || '');
    setPaymentGatewayId(String(p.paymentGateway?.id ?? ''));
    setStatus(p.status || 'COMPLETED');
    setNotes(p.notes || p.note || '');
  }, [p, visible]);

  if (!visible) return null;

  /* ===== SAVE ===== */
  const save = () =>
    onSave?.({
      amount: Number(amount || 0),
      currency,
      transactionId,
      paymentGatewayId: Number(paymentGatewayId),
      status,
      notes,
    });

  return (
    <Modal visible transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <View style={s.card}>
              <Text style={s.ttl}>Edit Payment</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* AMOUNT */}
                <Field
                  label="Amount"
                  value={amount}
                  onChangeText={setAmount}
                  kbType="numeric"
                />

                {/* CURRENCY */}
                <Field
                  label="Currency"
                  value={currency}
                  onChangeText={setCurrency}
                />

                {/* TRANSACTION */}
                <Field
                  label="Transaction ID"
                  value={transactionId}
                  onChangeText={setTransactionId}
                />

                {/* GATEWAY PICKER */}
                <Text style={s.label}>Payment Gateway</Text>
                <View style={s.pickerWrap}>
                  <Picker
                    selectedValue={paymentGatewayId}
                    onValueChange={val => setPaymentGatewayId(val)}
                    itemStyle={{ height: 110 }}
                  >
                    <Picker.Item label="Select Gateway" value="" />
                    {gateways.map(g => (
                      <Picker.Item
                        key={g.id}
                        label={g.name}
                        value={String(g.id)}
                      />
                    ))}
                  </Picker>
                </View>

                {/* STATUS PICKER */}
                <Text style={s.label}>Status</Text>
                <View style={s.pickerWrap}>
                  <Picker
                    selectedValue={status}
                    onValueChange={val => setStatus(val)}
                    itemStyle={{ height: 110 }}
                  >
                    <Picker.Item label="Completed" value="COMPLETED" />
                    <Picker.Item label="Pending" value="PENDING" />
                    <Picker.Item label="Failed" value="FAILED" />
                  </Picker>
                </View>

                {/* NOTES */}
                <Field label="Notes" value={notes} onChangeText={setNotes} />
              </ScrollView>

              {/* BUTTONS */}
              <View style={s.footer}>
                <Pressable
                  disabled={busy}
                  style={[s.btn, s.primary]}
                  onPress={save}
                >
                  <Text style={s.btnWhite}>{busy ? 'Saving…' : 'Update'}</Text>
                </Pressable>

                <Pressable style={s.btn} onPress={onClose}>
                  <Text style={s.btnTxt}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* ================= STYLES ================= */

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '95%',
  },

  ttl: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },

  field: { marginBottom: 12 },

  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    marginTop: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginBottom: 12,
  },

  footer: {
    marginTop: 10,
    gap: 10,
  },

  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  btnTxt: {
    color: '#1d4ed8',
    fontWeight: '600',
  },

  btnWhite: {
    color: '#fff',
    fontWeight: '700',
  },

  primary: {
    backgroundColor: '#1d4ed8',
  },
});
