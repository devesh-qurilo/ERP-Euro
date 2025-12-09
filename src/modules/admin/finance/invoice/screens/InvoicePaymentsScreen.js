// src/modules/admin/work/payments/InvoicePaymentsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import { selectPayments, selectPaymentsBusy } from '../store/selectors';

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
const CellText = ({ children, bold, muted }) => (
  <Text
    style={{
      fontWeight: bold ? '700' : '400',
      color: muted ? '#6b7280' : '#111827',
    }}
  >
    {children}
  </Text>
);
const Dot = ({ color = '#22c55e' }) => (
  <View
    style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }}
  />
);

function ActionSheet({ visible, onClose, onView, onEdit, onDelete }) {
  if (!visible) return null;
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          padding: 24,
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
          }}
          onStartShouldSetResponder={() => true}
        >
          {[
            { label: 'View', fn: onView },
            { label: 'Edit', fn: onEdit },
            { label: 'Delete', fn: onDelete, danger: true },
          ].map((x, i) => (
            <TouchableOpacity
              key={x.label}
              onPress={x.fn}
              style={{
                padding: 14,
                borderBottomWidth: i === 2 ? 0 : 1,
                borderColor: '#f1f5f9',
              }}
            >
              <Text style={{ color: x.danger ? '#ef4444' : '#111827' }}>
                {x.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={onClose}
            style={{ padding: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

function ViewPaymentModal({ visible, onClose, data }) {
  if (!visible) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: '#fff',
          marginTop: 60,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Payment {data?.transactionId}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
        <Text>Invoice: {data?.invoice?.invoiceNumber}</Text>
        <Text>
          Amount: {data?.currency} {data?.amount}
        </Text>
        <Text>Status: {data?.status}</Text>
        <Text>Paid On: {data?.paymentDate}</Text>
        <Text>Gateway: {data?.paymentGateway?.name}</Text>
        <Text>Note: {data?.note || '—'}</Text>
      </ScrollView>
    </Modal>
  );
}

function EditPaymentModal({ visible, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    amount: '',
    currency: '',
    transactionId: '',
    paymentGatewayId: '',
    status: '',
    notes: '',
  });
  useEffect(() => {
    if (visible) {
      setForm({
        amount: String(initial?.amount ?? ''),
        currency: String(initial?.currency ?? ''),
        transactionId: String(initial?.transactionId ?? ''),
        paymentGatewayId: String(initial?.paymentGateway?.id ?? ''),
        status: String(initial?.status ?? ''),
        notes: String(initial?.note ?? ''),
      });
    }
  }, [visible, initial]);

  const F = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
            marginTop: 60,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Edit Payment</Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
        {[
          ['amount', 'Amount', 'numeric'],
          ['currency', 'Currency', 'default'],
          ['transactionId', 'Transaction ID', 'default'],
          ['paymentGatewayId', 'Payment Gateway ID', 'numeric'],
          ['status', 'Status', 'default'],
          ['notes', 'Notes', 'default'],
        ].map(([k, label, kb]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={form[k]}
              onChangeText={t => F(k, t)}
              keyboardType={kb}
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
              amount: Number(form.amount) || 0,
              currency: form.currency,
              transactionId: form.transactionId,
              paymentGatewayId: Number(form.paymentGatewayId) || 1,
              status: form.status,
              notes: form.notes,
            })
          }
          style={{
            backgroundColor: '#111827',
            padding: 14,
            borderRadius: 10,
            marginTop: 6,
          }}
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

export default function InvoicePaymentsScreen({ route }) {
  const { invoiceNumber } = route.params;
  const dispatch = useDispatch();
  const items = useSelector(selectPayments);
  const loading = useSelector(selectPaymentsBusy);

  const [sheet, setSheet] = useState({ open: false, row: null });
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(A.listPayments(invoiceNumber));
  }, [invoiceNumber, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <View
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10 }}
      >
        {/* Put header + rows inside same horizontal ScrollView so they scroll together */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ paddingRight: 8 }}
        >
          <View style={{ minWidth: 1460 }}>
            {/* header */}
            <Row
              style={{
                backgroundColor: '#f9fafb',
                borderBottomWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Col w={120}>
                <CellText bold>Code</CellText>
              </Col>
              <Col w={180}>
                <CellText bold>Project</CellText>
              </Col>
              <Col w={140}>
                <CellText bold>Invoice</CellText>
              </Col>
              <Col w={220}>
                <CellText bold>Client</CellText>
              </Col>
              <Col w={120}>
                <CellText bold>Transaction Id</CellText>
              </Col>
              <Col w={160}>
                <CellText bold>Amount</CellText>
              </Col>
              <Col w={160}>
                <CellText bold>Paid On</CellText>
              </Col>
              <Col w={160}>
                <CellText bold>Payment Gateway</CellText>
              </Col>
              <Col w={140}>
                <CellText bold>Status</CellText>
              </Col>
              <Col w={120}>
                <CellText bold>Action</CellText>
              </Col>
            </Row>

            {/* rows */}
            <View>
              {(loading ? [] : items).map((p, i) => (
                <Row
                  key={p.id || i}
                  style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
                >
                  <Col w={120}>
                    <CellText>{p?.id || '—'}</CellText>
                  </Col>
                  <Col w={180}>
                    <CellText>{p?.projectId || '—'}</CellText>
                  </Col>
                  <Col w={140}>
                    <CellText>{p.invoice?.invoiceNumber || '—'}</CellText>
                  </Col>
                  <Col w={220}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {p.client?.profilePictureUrl ? (
                        <Image
                          source={{ uri: p.client.profilePictureUrl }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginRight: 8,
                          }}
                        />
                      ) : null}
                      <View>
                        <CellText>{p.client?.name || '—'}</CellText>
                        <CellText muted>Project</CellText>
                      </View>
                    </View>
                  </Col>
                  <Col w={120}>
                    <CellText>{p?.transactionId || '-'}</CellText>
                  </Col>
                  <Col w={160}>
                    <CellText>{`${p.currency} ${Number(
                      p.amount || 0,
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`}</CellText>
                  </Col>
                  <Col w={160}>
                    <CellText>{String(p.paymentDate).slice(0, 10)}</CellText>
                  </Col>
                  <Col w={160}>
                    <CellText>{p.paymentGateway?.name || '--'}</CellText>
                  </Col>
                  <Col w={140}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Dot
                        color={p.status === 'COMPLETED' ? '#22c55e' : '#f59e0b'}
                      />
                      <CellText>
                        {' '}
                        {p.status === 'COMPLETED' ? 'Complete' : p.status}
                      </CellText>
                    </View>
                  </Col>
                  <Col w={120}>
                    <TouchableOpacity
                      onPress={() => setSheet({ open: true, row: p })}
                      style={{
                        alignSelf: 'flex-start',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>⋮</Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* actions */}
      <ActionSheet
        visible={sheet.open}
        onClose={() => setSheet({ open: false, row: null })}
        onView={() => {
          setViewOpen(true);
          setSheet({ open: false, row: sheet.row });
        }}
        onEdit={() => {
          setEditOpen(true);
          setSheet({ open: false, row: sheet.row });
        }}
        onDelete={() => {
          const id = sheet.row?.id;
          dispatch(A.deletePayment(id, invoiceNumber));
          setSheet({ open: false, row: null });
        }}
      />

      <ViewPaymentModal
        visible={viewOpen}
        onClose={() => setViewOpen(false)}
        data={sheet.row}
      />
      <EditPaymentModal
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        initial={sheet.row}
        onSubmit={payload => {
          dispatch(A.editPayment(sheet.row.id, payload, invoiceNumber));
          setEditOpen(false);
        }}
      />
    </View>
  );
}
