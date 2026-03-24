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

import { selectClientProjects } from '../../../../clients/view/projects/store/selectors';
import { selectProjectInvoices } from '../../../../work/projects/view/invoices/store/selectors';
import { selectPaymentGateways } from '../../../../finance/paymentGateways/selectors';

import { listByProject } from '../../../../work/projects/view/invoices/store/actions';
import * as GatewaysActions from '../../../../finance/paymentGateways/actions';
import { listByClient } from '../store/actions';

/* ================= FIELD ================= */
function Field({ label, value, onChangeText, kbType, editable = true }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        keyboardType={kbType || 'default'}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#9ca3af"
        style={[s.input, !editable && { backgroundColor: '#f1f5f9' }]}
      />
    </View>
  );
}

/* ================= MAIN ================= */
export default function PaymentEditModal({
  visible,
  preset = {},
  busy,
  onClose,
  onSave,
}) {
  const dispatch = useDispatch();
  const p = preset || {};

  /* ===== STATES ===== */
  const [projectId, setProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [gatewayId, setGatewayId] = useState('');
  const [clientId, setClientId] = useState('');

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [status, setStatus] = useState('COMPLETED');
  const [notes, setNotes] = useState('');

  /* ===== STORE ===== */
  const projects = useSelector(selectClientProjects) || [];
  const invoices = useSelector(selectProjectInvoices) || [];
  const gateways = useSelector(selectPaymentGateways) || [];

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    dispatch(GatewaysActions.list());
  }, []);

  useEffect(() => {
    if (clientId) dispatch(listByClient(clientId));
  }, [clientId]);

  useEffect(() => {
    if (projectId) {
      dispatch(listByProject(Number(projectId)));
    }
  }, [projectId]);

  /* ===== PREFILL ===== */
  useEffect(() => {
    if (!visible) return;

    setClientId(String(p.clientId ?? ''));
    setAmount(String(p.amount ?? ''));
    setCurrency(p.currency || '');
    setTransactionId(p.transactionId || '');
    setGatewayId(String(p.paymentGateway?.id ?? ''));
    setStatus(p.status || 'COMPLETED');
    setNotes(p.notes || '');

    setProjectId(String(p.project?.projectId ?? ''));
    setInvoiceNumber(p.invoice?.invoiceNumber ?? '');
  }, [visible]);

  /* ===== AUTO FILL ===== */
  useEffect(() => {
    const selected = invoices.find(i => i.invoiceNumber === invoiceNumber);
    if (selected) {
      setAmount(String(selected.total || 0));
      setCurrency(selected.currency || '');
    }
  }, [invoiceNumber]);

  if (!visible) return null;

  const save = () =>
    onSave?.({
      projectId: Number(projectId),
      clientId,
      invoiceNumber,
      paymentGatewayId: Number(gatewayId),
      amount: Number(amount || 0),
      currency,
      transactionId,
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
              <Text style={s.ttl}>Add Payment</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Field label="Client ID" value={clientId} editable={false} />

                {/* PROJECT */}
                <Text style={s.label}>Project</Text>
                <View style={s.pickerWrap}>
                  <Picker
                    selectedValue={projectId}
                    onValueChange={val => setProjectId(val)}
                    itemStyle={{ height: 120 }}
                  >
                    <Picker.Item label="Select Project" value="" />
                    {projects.map(p => (
                      <Picker.Item
                        key={p.id}
                        label={p.name}
                        value={String(p.id)}
                      />
                    ))}
                  </Picker>
                </View>

                {/* INVOICE */}
                <Text style={s.label}>Invoice</Text>
                <View style={s.pickerWrap}>
                  <Picker
                    selectedValue={invoiceNumber}
                    onValueChange={val => setInvoiceNumber(val)}
                    enabled={!!projectId}
                    itemStyle={{ height: 120 }}
                  >
                    <Picker.Item label="Select Invoice" value="" />
                    {invoices.map(inv => (
                      <Picker.Item
                        key={inv.id}
                        label={inv.invoiceNumber}
                        value={inv.invoiceNumber}
                      />
                    ))}
                  </Picker>
                </View>

                {/* GATEWAY */}
                <Text style={s.label}>Payment Gateway</Text>
                <View style={s.pickerWrap}>
                  <Picker
                    selectedValue={gatewayId}
                    onValueChange={val => setGatewayId(val)}
                    itemStyle={{ height: 120 }}
                  >
                    <Picker.Item label="Select Gateway" value="" />
                    {gateways.map(g => (
                      <Picker.Item key={g.id} label={g.name} value={g.id} />
                    ))}
                  </Picker>
                </View>

                {/* FIELDS */}
                <Field
                  label="Amount"
                  value={amount}
                  onChangeText={setAmount}
                  kbType="numeric"
                />
                <Field
                  label="Currency"
                  value={currency}
                  onChangeText={setCurrency}
                />
                <Field
                  label="Transaction ID"
                  value={transactionId}
                  onChangeText={setTransactionId}
                />
                <Field label="Status" value={status} onChangeText={setStatus} />
                <Field label="Notes" value={notes} onChangeText={setNotes} />
              </ScrollView>

              {/* BUTTONS */}
              <View style={s.footer}>
                <Pressable
                  disabled={busy}
                  style={[s.btn, s.primary]}
                  onPress={save}
                >
                  <Text style={s.btnWhite}>{busy ? 'Saving…' : 'Save'}</Text>
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
