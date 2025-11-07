import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

export default function ReceiptFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}) {
  const blank = {
    invoiceId: '',
    issueDate: '',
    currency: 'USD',
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
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
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
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Add Receipt</Text>
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
        <TouchableOpacity
          onPress={() =>
            onSubmit({
              ...form,
              tax: Number(form.tax) || 0,
              priceWithOutTax: Number(form.priceWithOutTax) || 0,
              quantity: Number(form.quantity) || 1,
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
      </ScrollView>
    </Modal>
  );
}
