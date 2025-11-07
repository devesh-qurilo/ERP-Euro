import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectReceipts, selectReceiptsBusy } from '../store/selectors';

export default function InvoiceReceiptsScreen({ route }) {
  const { invoiceId } = route.params;
  const dispatch = useDispatch();
  const items = useSelector(selectReceipts);
  const busy = useSelector(selectReceiptsBusy);

  useEffect(() => {
    dispatch(A.listReceipts(invoiceId));
  }, [invoiceId, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Receipts for {invoiceId}
      </Text>
      {busy ? (
        <Text>Loading…</Text>
      ) : (
        <ScrollView>
          {items.map(r => (
            <View
              key={r.id}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: '700' }}>
                {r.invoiceId} • {r.currency}
              </Text>
              <Text>
                {r.productName} × {r.quantity}
              </Text>
              <Text>Total: {r.totalAmount}</Text>
              <Text>Issued: {r.issueDate}</Text>
              <Text>By: {r.invoiceIssuedBy}</Text>
              <Text>Note: {r.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
