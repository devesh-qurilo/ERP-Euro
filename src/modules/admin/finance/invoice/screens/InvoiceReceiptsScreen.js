import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectReceipts, selectReceiptsBusy } from '../store/selectors';

// common layout
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

// 3 dots button
function ActionDots({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
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

// action menu box
function ActionMenu({ visible, onClose, onView, onDownload, onDelete }) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: 'absolute',
        right: 0,
        top: 35,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        overflow: 'hidden',
        zIndex: 50,
        elevation: 6,
      }}
    >
      <TouchableOpacity
        onPress={onView}
        style={{ padding: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' }}
      >
        <Text>View</Text>
      </TouchableOpacity>

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
        style={{ padding: 12, alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '600' }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================
// VIEW RECEIPT MODAL
// =========================
function ViewReceiptModal({ visible, onClose, data }) {
  if (!visible || !data) return null;

  const RowDetail = ({ label, value }) => (
    <View
      style={{
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
        paddingBottom: 8,
      }}
    >
      <Text style={{ fontSize: 13, color: '#6b7280' }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
        {value || '—'}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff', marginTop: 40 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Receipt Details
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        {/* All fields formatted nicely */}
        <RowDetail label="Invoice ID" value={data.invoiceId} />
        <RowDetail label="Project" value={data.productName} />
        <RowDetail
          label="Client"
          value={data.buyerCleintName || data.buyerCompanyName}
        />
        <RowDetail
          label="Amount"
          value={`${data.currency || ''} ${Number(
            data.totalAmount ?? data.subtotal ?? 0,
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
        />
        <RowDetail label="Issue Date" value={data.issueDate} />
        <RowDetail label="Tax" value={String(data.tax)} />
        <RowDetail label="Quantity" value={String(data.quantity)} />
        <RowDetail label="Description" value={data.description} />

        {/* Seller section */}
        <RowDetail label="Seller Company" value={data.sellerCompanyName} />
        <RowDetail label="Seller Address" value={data.sellerCompanyAddress} />
        <RowDetail label="Seller Email" value={data.sellerCompanyEmail} />
        <RowDetail label="Seller Phone" value={data.sellerCompanyPhoneNumber} />

        {/* Buyer section */}
        <RowDetail label="Buyer Company" value={data.buyerCompanyName} />
        <RowDetail label="Buyer Address" value={data.buyerCompanyAddress} />
        <RowDetail label="Buyer Email" value={data.buyerCompanyEmail} />
        <RowDetail label="Buyer Phone" value={data.buyerCompanyPhoneNumber} />
      </ScrollView>
    </Modal>
  );
}

// =========================
// MAIN SCREEN
// =========================
export default function InvoiceReceiptsScreen({ route }) {
  const { invoiceId } = route.params;
  const dispatch = useDispatch();
  const items = useSelector(selectReceipts);
  const loading = useSelector(selectReceiptsBusy);

  const [openMenu, setOpenMenu] = useState(null);
  const [viewData, setViewData] = useState(null); // stores row to view

  useEffect(() => {
    dispatch(A.listReceipts(invoiceId));
  }, [invoiceId, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Receipts
      </Text>

      {/* WHOLE TABLE SCROLLS TOGETHER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
        }}
      >
        <View style={{ minWidth: 1240 }}>
          {/* HEADER */}
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

          {/* ROWS */}
          {loading ? (
            <Row>
              <Col w={1240}>
                <Text style={{ padding: 16 }}>Loading…</Text>
              </Col>
            </Row>
          ) : (
            items.map((r, i) => (
              <Row
                key={i}
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#e5e7eb',
                  position: 'relative',
                }}
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
                  <CellText>•</CellText>
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
                  <View style={{ position: 'relative' }}>
                    <ActionDots
                      onPress={() =>
                        setOpenMenu(openMenu === r.id ? null : r.id)
                      }
                    />

                    <ActionMenu
                      visible={openMenu === r.id}
                      onClose={() => setOpenMenu(null)}
                      onView={() => {
                        setViewData(r);
                        setOpenMenu(null);
                      }}
                      onDownload={() => {
                        dispatch(A.downloadReceipt(r.id));
                        setOpenMenu(null);
                      }}
                      onDelete={() => {
                        dispatch(A.deleteReceipt(r.id, invoiceId));
                        setOpenMenu(null);
                      }}
                    />
                  </View>
                </Col>
              </Row>
            ))
          )}
        </View>
      </ScrollView>

      {/* VIEW RECEIPT MODAL */}
      <ViewReceiptModal
        visible={!!viewData}
        data={viewData}
        onClose={() => setViewData(null)}
      />
    </View>
  );
}
