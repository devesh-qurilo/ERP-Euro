import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import * as A from '../store/actions';
import { selectCNItems, selectCNBusy } from '../store/selectors';

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
const Cell = ({ children, bold, muted }) => (
  <Text
    style={{
      fontWeight: bold ? '700' : '400',
      color: muted ? '#6b7280' : '#111827',
    }}
  >
    {children}
  </Text>
);

// ---------- Action Sheet (modal overlay so it never clips) ----------
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

// ---------- View Modal ----------
function ViewCNModal({ visible, onClose, data }) {
  if (!visible) return null;
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
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Credit Note {data?.creditNoteNumber}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
        <Text>Client: {data?.client?.name || '—'}</Text>
        <Text>
          Project: {data?.project?.projectName} ({data?.project?.projectCode})
        </Text>
        <Text>Currency: {data?.currency}</Text>
        <Text>
          Amount:{' '}
          {Number(data?.totalAmount ?? data?.amount ?? 0).toLocaleString(
            undefined,
            { minimumFractionDigits: 2 },
          )}
        </Text>
        <Text>Tax: {data?.tax}%</Text>
        <Text>
          Adjustment: {data?.adjustmentPositive ? '+' : '-'} {data?.adjustment}
        </Text>
        <Text>Date: {data?.creditNoteDate}</Text>
        <Text>Notes: {data?.notes || '—'}</Text>
        <Text>Created: {String(data?.createdAt ?? '').slice(0, 19)}</Text>
      </ScrollView>
    </Modal>
  );
}

// ---------- Edit Modal ----------
function EditCNModal({ visible, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    creditNoteDate: '',
    adjustment: '',
    adjustmentPositive: true,
    notes: '',
  });

  useEffect(() => {
    if (visible) {
      setForm({
        creditNoteDate: String(initial?.creditNoteDate || ''),
        adjustment: String(initial?.adjustment ?? ''),
        adjustmentPositive: !!initial?.adjustmentPositive,
        notes: String(initial?.notes || ''),
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
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Edit Credit Note
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        {[
          ['creditNoteDate', 'Credit Note Date (YYYY-MM-DD)', 'default'],
          ['adjustment', 'Adjustment', 'numeric'],
          ['notes', 'Notes', 'default'],
        ].map(([k, label, kb]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(form[k] ?? '')}
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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ marginRight: 10 }}>Adjustment Positive?</Text>
          <TouchableOpacity
            onPress={() => F('adjustmentPositive', !form.adjustmentPositive)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
            }}
          >
            <Text>{form.adjustmentPositive ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            onSubmit({
              creditNoteDate: form.creditNoteDate,
              adjustment: Number(form.adjustment) || 0,
              adjustmentPositive: !!form.adjustmentPositive,
              notes: form.notes,
            })
          }
          style={{ backgroundColor: '#1d4ed8', padding: 14, borderRadius: 10 }}
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

// ---------- Screen ----------
export default function AdminFinanceCreditNotes() {
  const dispatch = useDispatch();
  const rows = useSelector(selectCNItems);
  const loading = useSelector(selectCNBusy);

  const [sheet, setSheet] = useState({ open: false, row: null });
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // always refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(A.list());
    }, [dispatch]),
  );
  useEffect(() => {
    dispatch(A.list());
  }, [dispatch]);

  // ---- UI ----
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <View
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10 }}
      >
        {/* ✅ Put header + rows in the SAME horizontal ScrollView */}
        <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator>
          <View style={{ minWidth: 1360 }}>
            {/* header */}
            <Row
              style={{
                backgroundColor: '#f9fafb',
                borderBottomWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Col w={140}>
                <Cell bold>Code</Cell>
              </Col>
              <Col w={200}>
                <Cell bold>Project</Cell>
              </Col>
              <Col w={180}>
                <Cell bold>Credit Note #</Cell>
              </Col>
              <Col w={220}>
                <Cell bold>Client</Cell>
              </Col>
              <Col w={160}>
                <Cell bold>±Adjustment</Cell>
              </Col>
              <Col w={160}>
                <Cell bold>Amount</Cell>
              </Col>
              <Col w={160}>
                <Cell bold>Date</Cell>
              </Col>
              <Col w={120}>
                <Cell bold>Action</Cell>
              </Col>
            </Row>

            {/* rows */}
            {(loading ? [] : rows).map((r, i) => (
              <Row
                key={r.id || i}
                style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
              >
                <Col w={140}>
                  <Cell>{r.project?.projectCode || '—'}</Cell>
                </Col>
                <Col w={200}>
                  <Cell>{r.project?.projectName || '—'}</Cell>
                </Col>
                <Col w={180}>
                  <Cell>{r.creditNoteNumber}</Cell>
                </Col>
                <Col w={220}>
                  <Cell>{r.client?.name || '—'}</Cell>
                </Col>
                <Col w={160}>
                  <Cell>{`${r.adjustmentPositive ? '+' : '-'} ${Number(
                    r.adjustment || 0,
                  )}`}</Cell>
                </Col>
                <Col w={160}>
                  <Cell>{`${r.currency} ${Number(
                    r.totalAmount ?? r.amount ?? 0,
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`}</Cell>
                </Col>
                <Col w={160}>
                  <Cell>{r.creditNoteDate}</Cell>
                </Col>
                <Col w={120}>
                  <TouchableOpacity
                    onPress={() => setSheet({ open: true, row: r })}
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
        </ScrollView>
      </View>

      {/* Action sheet */}
      <ActionSheet
        visible={sheet.open}
        onClose={() => setSheet({ open: false, row: null })}
        onView={() => {
          setViewOpen(true);
        }}
        onEdit={() => {
          setEditOpen(true);
        }}
        onDelete={() => {
          if (sheet.row?.id) dispatch(A.remove(sheet.row.id));
          setSheet({ open: false, row: null });
        }}
      />

      {/* Modals */}
      <ViewCNModal
        visible={viewOpen}
        onClose={() => {
          setViewOpen(false);
        }}
        data={sheet.row}
      />

      <EditCNModal
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        initial={sheet.row}
        onSubmit={payload => {
          if (sheet.row?.id) dispatch(A.update(sheet.row.id, payload));
          setEditOpen(false);
          setSheet({ open: false, row: null });
        }}
      />
    </View>
  );
}
