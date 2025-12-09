// src/modules/admin/work/receipts/ReceiptFormModal.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';

// adjust these import paths to match your repo layout
import { selectAWPList } from '../../../work/projects/store/selectors';
import * as ProjectsActions from '../../../work/projects/store/actions';

export default function ReceiptFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}) {
  const dispatch = useDispatch();
  const projects = useSelector(selectAWPList) || [];

  const blank = {
    invoiceId: '',
    issueDate: '',
    currency: 'USD',
    projectId: '', // added project selector
    sellerCompanyName: '',
    sellerCompanyAddress: '',
    sellerCompanyCode: '',
    sellerCompanyTaxNumber: '',
    sellerCompanyEmail: '',
    sellerCompanyPhoneNumber: '',
    sellerCompanyBankName: '',
    sellerCompanyBankAccountNumber: '',
    buyerCompanyName: '',
    buyerCompanyAddress: '',
    buyerCompanyCode: '',
    buyerCompanyTaxNumber: '',
    buyerCleintName: '',
    buyerCompanyEmail: '',
    buyerCompanyPhoneNumber: '',
    buyerCompanyBankName: '',
    buyerCompanyBankAccountNumber: '',
    productName: '',
    tax: '',
    priceWithOutTax: '',
    quantity: '',
    description: '',
  };

  const [form, setForm] = useState(initial || blank);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(initial || blank);
      // ensure projects loaded
      if (!projects || projects.length === 0)
        dispatch(ProjectsActions.fetchAll());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (visible && initial) setForm(initial);
  }, [initial, visible]);

  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // date helpers
  const formatDate = d => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toISOString().slice(0, 10);
  };

  const issueDateObj = useMemo(() => {
    if (!form.issueDate) return new Date();
    const d = new Date(form.issueDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [form.issueDate]);

  function onDateChange(event, selectedDate) {
    // on Android the picker closes automatically; on iOS we keep it open if needed
    if (Platform.OS !== 'ios') setShowPicker(false);
    if (event?.type === 'dismissed') return;
    if (selectedDate) change('issueDate', formatDate(selectedDate));
  }

  // map project value: prefer projectCode/project_code/shortCode then id
  const projectOptions = projects.map(p => {
    const value = p.projectCode ?? p.project_code ?? p.shortCode ?? p.id;
    const label = p.name ?? p.projectName ?? p.shortCode ?? `Project ${value}`;
    return { value: String(value), label };
  });

  function handleSave() {
    // basic validations (optional)
    if (!form.invoiceId) {
      return alert('Invoice ID is required');
    }
    if (!form.issueDate) {
      return alert('Issue date is required');
    }

    const payload = {
      ...form,
      tax: Number(form.tax) || 0,
      priceWithOutTax: Number(form.priceWithOutTax) || 0,
      quantity: Number(form.quantity) || 1,
      projectId: form.projectId ? String(form.projectId) : undefined,
      issueDate: form.issueDate || undefined,
    };

    onSubmit(payload);
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
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700' }}>
                {initial ? 'Edit Receipt' : 'Add Receipt'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>

            {/* invoiceId */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ marginBottom: 6 }}>Invoice ID</Text>
              <TextInput
                value={String(form.invoiceId ?? '')}
                onChangeText={t => change('invoiceId', t)}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            {/* Issue Date */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ marginBottom: 6 }}>Issue Date (YYYY-MM-DD)</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 12,
                  justifyContent: 'center',
                }}
              >
                <Text>{formatDate(form.issueDate) || 'Select date'}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={issueDateObj}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Project Picker */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ marginBottom: 6 }}>Project</Text>
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
                  <Picker.Item label="Select project (optional)" value="" />
                  {projectOptions.map(p => (
                    <Picker.Item
                      key={p.value}
                      label={p.label}
                      value={p.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* currency */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ marginBottom: 6 }}>Currency</Text>
              <TextInput
                value={String(form.currency ?? 'USD')}
                onChangeText={t => change('currency', t)}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            {/* Seller / Buyer / Product fields: render remaining fields in form order */}
            {Object.entries(form)
              .filter(
                ([k]) =>
                  !['invoiceId', 'issueDate', 'currency', 'projectId'].includes(
                    k,
                  ),
              )
              .map(([k, v]) => (
                <View key={k} style={{ marginBottom: 10 }}>
                  <Text style={{ marginBottom: 6 }}>{k}</Text>
                  <TextInput
                    value={String(v ?? '')}
                    onChangeText={t => change(k, t)}
                    keyboardType={
                      ['tax', 'priceWithOutTax', 'quantity'].includes(k)
                        ? 'numeric'
                        : 'default'
                    }
                    multiline={k === 'description'}
                    style={{
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 10,
                      padding: 10,
                      minHeight: k === 'description' ? 80 : undefined,
                      textAlignVertical: k === 'description' ? 'top' : 'center',
                    }}
                  />
                </View>
              ))}

            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: '#111827',
                padding: 14,
                borderRadius: 10,
                marginTop: 8,
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
