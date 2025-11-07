import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectPayments, selectPaymentsBusy } from '../store/selectors';

export default function InvoicePaymentsScreen({ route }) {
  const { invoiceNumber } = route.params;
  const dispatch = useDispatch();
  const items = useSelector(selectPayments);
  const busy = useSelector(selectPaymentsBusy);

  useEffect(() => {
    dispatch(A.listPayments(invoiceNumber));
  }, [invoiceNumber, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Payments for {invoiceNumber}
      </Text>
      {busy ? (
        <Text>Loading…</Text>
      ) : (
        <ScrollView>
          {items.map(p => (
            <View
              key={p.id}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: '700' }}>
                {p.transactionId} • {p.currency} {p.amount}
              </Text>
              <Text>Status: {p.status}</Text>
              <Text>Gateway: {p.paymentGateway?.name}</Text>
              <Text>Date: {p.paymentDate}</Text>
              <Text>Note: {p.note}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
