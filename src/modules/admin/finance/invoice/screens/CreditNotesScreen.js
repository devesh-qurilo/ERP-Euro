import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectCreditNotes, selectCreditNotesBusy } from '../store/selectors';

const Row = ({ children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    {children}
  </View>
);
const Col = ({ children, w }) => (
  <View style={{ width: w, paddingVertical: 14, paddingHorizontal: 12 }}>
    {children}
  </View>
);
const Cell = ({ children, bold }) => (
  <Text style={{ fontWeight: bold ? '700' : '400', color: '#111827' }}>
    {children}
  </Text>
);

export default function CreditNotesScreen({ route }) {
  const { invoiceNumber } = route.params;
  const dispatch = useDispatch();
  const items = useSelector(selectCreditNotes);
  const busy = useSelector(selectCreditNotesBusy);

  useEffect(() => {
    dispatch(A.listCreditNotes(invoiceNumber));
  }, [invoiceNumber, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <View
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10 }}
      >
        <Row
          style={{
            backgroundColor: '#f9fafb',
            borderBottomWidth: 1,
            borderColor: '#e5e7eb',
          }}
        >
          <Col w={160}>
            <Cell bold>Credit Note #</Cell>
          </Col>
          <Col w={220}>
            <Cell bold>Project</Cell>
          </Col>
          <Col w={200}>
            <Cell bold>Client</Cell>
          </Col>
          <Col w={160}>
            <Cell bold>Amount</Cell>
          </Col>
          <Col w={140}>
            <Cell bold>Tax %</Cell>
          </Col>
          <Col w={160}>
            <Cell bold>Adjustment</Cell>
          </Col>
          <Col w={160}>
            <Cell bold>Date</Cell>
          </Col>
        </Row>

        {busy ? (
          <Text style={{ padding: 16 }}>Loading…</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={{ minWidth: 1200 }}>
              {items.map((x, i) => (
                <Row
                  key={x.id || i}
                  style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
                >
                  <Col w={160}>
                    <Cell>{x.creditNoteNumber}</Cell>
                  </Col>
                  <Col w={220}>
                    <Cell>{x.project?.projectName || '—'}</Cell>
                  </Col>
                  <Col w={200}>
                    <Cell>{x.client?.name || '—'}</Cell>
                  </Col>
                  <Col w={160}>
                    <Cell>{`${x.currency} ${Number(
                      x.totalAmount ?? x.amount ?? 0,
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`}</Cell>
                  </Col>
                  <Col w={140}>
                    <Cell>{Number(x.tax || 0)}</Cell>
                  </Col>
                  <Col w={160}>
                    <Cell>{`${x.adjustmentPositive ? '+' : '-'} ${Number(
                      x.adjustment || 0,
                    )}`}</Cell>
                  </Col>
                  <Col w={160}>
                    <Cell>{x.creditNoteDate}</Cell>
                  </Col>
                </Row>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
