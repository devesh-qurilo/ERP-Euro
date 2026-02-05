// src/modules/admin/work/invoices/InvoiceFormModal.js
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
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

// adjust these imports to match your project paths
import { selectClients } from '../../../clients/store/selectors';
import * as ClientsActions from '../../../clients/store/actions';
import { selectAWPList } from '../../../work/projects/store/selectors';
import * as ProjectsActions from '../../../work/projects/store/actions';

export default function InvoiceFormModal({
  visible,
  onClose,
  initial,
  onSubmit,
}) {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients) || [];
  const projects = useSelector(selectAWPList) || [];

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      // initialize form
      setForm(initial || blank);

      // ensure clients / projects loaded
      if (!clients || clients.length === 0) dispatch(ClientsActions.list({}));
      if (!projects || projects.length === 0)
        dispatch(ProjectsActions.fetchAll());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    // when initial changes while open, sync
    if (visible && initial) setForm(initial);
  }, [initial, visible]);

  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // format date string YYYY-MM-DD
  const formatDate = d => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toISOString().slice(0, 10);
  };

  // parse invoiceDate string to Date for the picker
  const invoiceDateObj = useMemo(() => {
    if (!form.invoiceDate) return new Date();
    const d = new Date(form.invoiceDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [form.invoiceDate]);

  // Optionally filter projects by selected client (if your projects have clientId)
  const filteredProjects = useMemo(() => {
    if (!form.clientId) return projects;
    return projects.filter(p => {
      // support multiple possible fields
      const pid =
        p.clientId ??
        p.client_id ??
        p.client?.clientId ??
        p.client?.id ??
        p.clientId;
      return String(pid) === String(form.clientId);
    });
  }, [projects, form.clientId]);

  function onDateChange(event, selected) {
    // On Android the picker closes automatically and provides a value or dismiss.
    setShowDatePicker(Platform.OS === 'ios'); // keep open on iOS, close on Android
    if (event?.type === 'dismissed') return;
    if (selected) {
      change('invoiceDate', formatDate(selected));
    }
  }

  function handleSave() {
    // basic validation
    if (!form.invoiceNumber) {
      Alert.alert('Validation', 'Invoice Number is required');
      return;
    }
    if (!form.invoiceDate) {
      Alert.alert('Validation', 'Invoice Date is required');
      return;
    }
    if (!form.clientId) {
      Alert.alert('Validation', 'Select client');
      return;
    }
    if (!form.projectId) {
      Alert.alert('Validation', 'Select project');
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount) || 0,
      tax: Number(form.tax) || 0,
      discount: Number(form.discount) || 0,
      invoiceDate: formatDate(form.invoiceDate),
      clientId: form.clientId ? String(form.clientId) : undefined,
      projectId: form.projectId ? String(form.projectId) : undefined,
    };
    console.log('bhahhhhhh', payload);
    onSubmit(payload);
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            backgroundColor: '#fff',
            marginTop: 50,
          }}
          keyboardShouldPersistTaps="handled"
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

          {/* Invoice Number */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>
              Invoice Number
            </Text>
            <TextInput
              value={String(form.invoiceNumber ?? '')}
              onChangeText={t => change('invoiceNumber', t)}
              placeholder="Invoice Number"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          {/* Invoice Date picker */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>
              Invoice Date (YYYY-MM-DD)
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 12,
                justifyContent: 'center',
              }}
            >
              <Text>{formatDate(form.invoiceDate) || 'Select date'}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={invoiceDateObj}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Currency */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>Currency</Text>
            <TextInput
              value={String(form.currency ?? 'USD')}
              onChangeText={t => change('currency', t)}
              placeholder="Currency"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          {/* Client Picker */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>Client</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={form.clientId || ''}
                onValueChange={val => {
                  change('clientId', val);
                  // optionally reset project if it doesn't belong to client
                  change('projectId', '');
                }}
              >
                <Picker.Item label="Select client" value="" />
                {clients.map(c => {
                  const label =
                    c.name || c.company?.companyName || c.clientName;
                  const value = c.clientId ? String(c.clientId) : String(c.id);
                  return (
                    <Picker.Item key={value} label={label} value={value} />
                  );
                })}
              </Picker>
            </View>
          </View>

          {/* Project Picker */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>Project</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={form.projectId || ''}
                onValueChange={val => change('projectId', val)}
              >
                <Picker.Item label="Select project" value="" />
                {filteredProjects.map(p => {
                  const label =
                    p.name || p.projectName || p.title || `#${p.id}`;
                  const value =
                    p.id ?? p.projectId ?? p.shortCode ?? String(p.id);
                  return (
                    <Picker.Item
                      key={String(value)}
                      label={label}
                      value={String(value)}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>

          {/* Amount, Tax, Discount */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>Amount</Text>
            <TextInput
              value={String(form.amount ?? '')}
              onChangeText={t => change('amount', t)}
              placeholder="Amount"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>Tax %</Text>
            <TextInput
              value={String(form.tax ?? '')}
              onChangeText={t => change('tax', t)}
              placeholder="Tax %"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>
              Discount %
            </Text>
            <TextInput
              value={String(form.discount ?? '')}
              onChangeText={t => change('discount', t)}
              placeholder="Discount %"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          {/* Amount in words */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>
              Amount In Words
            </Text>
            <TextInput
              value={String(form.amountInWords ?? '')}
              onChangeText={t => change('amountInWords', t)}
              placeholder="Amount In Words"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          {/* Notes */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, color: '#374151' }}>Notes</Text>
            <TextInput
              value={String(form.notes ?? '')}
              onChangeText={t => change('notes', t)}
              placeholder="Notes"
              multiline
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
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
