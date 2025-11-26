// src/modules/admin/finance/CreditNotesScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectCreditNotes, selectCreditNotesBusy } from '../store/selectors';

const Row = ({ children, style }) => (
  <View style={[styles.row, style]}>{children}</View>
);
const Col = ({ children, w, style }) => (
  <View
    style={[{ width: w, paddingVertical: 12, paddingHorizontal: 12 }, style]}
  >
    {children}
  </View>
);
const Cell = ({ children, bold, style }) => (
  <Text
    numberOfLines={1}
    ellipsizeMode="tail"
    style={[{ fontWeight: bold ? '700' : '400', color: '#111827' }, style]}
  >
    {children}
  </Text>
);

export default function CreditNotesScreen({ route }) {
  const { invoiceNumber } = route.params;
  const dispatch = useDispatch();
  const items = useSelector(selectCreditNotes) || [];
  const busy = useSelector(selectCreditNotesBusy);

  useEffect(() => {
    dispatch(A.listCreditNotes(invoiceNumber));
  }, [invoiceNumber, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Credit Notes
      </Text>

      <View style={styles.tableWrap}>
        {/* horizontal scroll contains header + a fixed-width content block */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ minWidth: 1200 }}
        >
          <View style={{ minWidth: 1200 }}>
            {/* Header (inside horizontal scroll so it moves with columns) */}
            <Row style={styles.headerRow}>
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

            {/* Body: vertical scroll inside the horizontal area. header stays above. */}
            <View style={styles.bodyContainer}>
              {busy ? (
                <View style={{ padding: 16 }}>
                  <Text>Loading…</Text>
                </View>
              ) : items.length === 0 ? (
                <View style={{ padding: 16 }}>
                  <Text>No credit notes found.</Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator>
                  {items.map((x, i) => (
                    <Row
                      key={x.id ?? `row-${i}`}
                      style={[
                        styles.row,
                        i % 2 === 0 ? styles.rowEven : styles.rowOdd,
                        { borderBottomWidth: 1, borderColor: '#e5e7eb' },
                      ]}
                    >
                      <Col w={160}>
                        <Cell style={styles.cellText}>
                          {x.creditNoteNumber}
                        </Cell>
                      </Col>
                      <Col w={220}>
                        <Cell style={styles.cellText}>
                          {x.project?.projectName || '—'}
                        </Cell>
                      </Col>
                      <Col w={200}>
                        <Cell style={styles.cellText}>
                          {x.client?.name || '—'}
                        </Cell>
                      </Col>
                      <Col w={160}>
                        <Cell style={styles.cellText}>
                          {`${x.currency || ''} ${Number(
                            x.totalAmount ?? x.amount ?? 0,
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}`}
                        </Cell>
                      </Col>
                      <Col w={140}>
                        <Cell style={styles.cellText}>
                          {Number(x.tax || 0)}
                        </Cell>
                      </Col>
                      <Col w={160}>
                        <Cell style={styles.cellText}>
                          {`${x.adjustmentPositive ? '+' : '-'} ${Number(
                            x.adjustment || 0,
                          )}`}
                        </Cell>
                      </Col>
                      <Col w={160}>
                        <Cell style={styles.cellText}>{x.creditNoteDate}</Cell>
                      </Col>
                    </Row>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableWrap: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    flex: 1,
  },
  headerRow: {
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#fafafa',
  },
  bodyContainer: {
    // control vertical scrolling height of body (adjust to taste)
    maxHeight: 420,
    backgroundColor: '#fff',
  },
  cellText: {
    color: '#111827',
  },
});
