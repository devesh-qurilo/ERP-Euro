import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function InvoiceViewModal({ visible, onClose, data }) {
  if (!visible) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            marginTop: 70,
            borderBottomWidth: 1,
            borderColor: '#e5e7eb',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Invoice: {data?.invoiceNumber}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Client</Text>
          <Text>
            {data?.client?.name} ({data?.client?.email})
          </Text>

          <View style={{ height: 12 }} />

          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Project</Text>
          <Text>
            {data?.project?.projectName} — {data?.project?.projectCode}
          </Text>

          <View style={{ height: 12 }} />

          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Amounts</Text>
          <Text>Amount: {data?.amount}</Text>
          <Text>Tax: {data?.tax}%</Text>
          <Text>Discount: {data?.discount}%</Text>
          <Text>Total: {data?.total}</Text>
          <Text>Paid: {data?.paidAmount}</Text>
          <Text>Unpaid: {data?.unpaidAmount}</Text>

          <View style={{ height: 12 }} />

          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Meta</Text>
          <Text>Invoice Date: {data?.invoiceDate}</Text>
          <Text>Status: {data?.status}</Text>
          <Text>Notes: {data?.notes || '—'}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
