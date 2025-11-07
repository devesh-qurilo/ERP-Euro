import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectReceipts, selectReceiptsBusy } from '../store/selectors';

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
const CellText = ({ children, bold }) => (
  <Text style={{ fontWeight: bold ? '700' : '400', color: '#111827' }}>
    {children}
  </Text>
);

function ActionDots({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
      }}
    >
      <Text style={{ fontSize: 18 }}>⋮</Text>
    </TouchableOpacity>
  );
}

function ActionMenu({ open, onClose, onDownload, onDelete }) {
  if (!open) return null;
  return (
    <View
      style={{
        position: 'absolute',
        right: 16,
        top: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
      }}
    >
      <TouchableOpacity
        onPress={onDownload}
        style={{ padding: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' }}
      >
        <Text>Download</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={{ padding: 12 }}>
        <Text style={{ color: '#ef4444' }}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onClose}
        style={{ padding: 10, alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '600' }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function InvoiceReceiptsScreen({ route }) {
  const { invoiceId } = route.params; // this is the numeric id you passed earlier
  const dispatch = useDispatch();
  const items = useSelector(selectReceipts);
  const busy = useSelector(selectReceiptsBusy);

  const [menuState, setMenuState] = useState({ open: false, createdId: null });

  useEffect(() => {
    dispatch(A.listReceipts(invoiceId));
  }, [invoiceId, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Receipts
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {/* header */}
        <Row
          style={{
            backgroundColor: '#f9fafb',
            borderBottomWidth: 1,
            borderColor: '#e5e7eb',
          }}
        >
          <Col w={180}>
            <CellText bold>Invoice No.</CellText>
          </Col>
          <Col w={220}>
            <CellText bold>Project</CellText>
          </Col>
          <Col w={200}>
            <CellText bold>Client</CellText>
          </Col>
          <Col w={60}>
            <CellText bold>•</CellText>
          </Col>
          <Col w={180}>
            <CellText bold>Amount</CellText>
          </Col>
          <Col w={180}>
            <CellText bold>Issue Date</CellText>
          </Col>
          <Col w={120}>
            <CellText bold>Action</CellText>
          </Col>
        </Row>

        {busy ? (
          <Row>
            <Col w={1240}>
              <Text style={{ padding: 16 }}>Loading…</Text>
            </Col>
          </Row>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={{ minWidth: 1240 }}>
              {items.map((r, idx) => (
                <Row
                  key={r.id || idx}
                  style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
                >
                  <Col w={180}>
                    <CellText>{r.invoiceId}</CellText>
                  </Col>
                  <Col w={220}>
                    <CellText>{r.productName || '—'}</CellText>
                  </Col>
                  <Col w={200}>
                    <CellText>
                      {r.buyerCleintName || r.buyerCompanyName || '—'}
                    </CellText>
                  </Col>
                  <Col w={60}>
                    <CellText>·</CellText>
                  </Col>
                  <Col w={180}>
                    <CellText>
                      {`${r.currency || ''} ${Number(
                        r.totalAmount ?? r.subtotal ?? 0,
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}`}
                    </CellText>
                  </Col>
                  <Col w={180}>
                    <CellText>{r.issueDate}</CellText>
                  </Col>
                  <Col w={120}>
                    <View>
                      <ActionDots
                        onPress={() =>
                          setMenuState({ open: true, createdId: r.id })
                        }
                      />
                      {menuState.open && menuState.createdId === r.id && (
                        <ActionMenu
                          open
                          onClose={() =>
                            setMenuState({ open: false, createdId: null })
                          }
                          onDownload={() => {
                            dispatch(A.downloadReceipt(r.id));
                            setMenuState({ open: false, createdId: null });
                          }}
                          onDelete={() => {
                            dispatch(A.deleteReceipt(r.id, invoiceId));
                            setMenuState({ open: false, createdId: null });
                          }}
                        />
                      )}
                    </View>
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
