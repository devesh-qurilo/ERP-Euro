import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import PaymentsTable from './components/PaymentsTable';
import PaymentViewModal from './components/PaymentViewModal';
import PaymentEditModal from './components/PaymentEditModal';

import {
  listByClient,
  openView,
  closeView,
  openEdit,
  closeEdit,
  updatePayment,
  deletePayment,
} from './store/actions';

import {
  selectClientPayments,
  selectClientPaymentsBusy,
  selectClientPaymentsError,
  selectClientPaymentsViewOpen,
  selectClientPaymentsViewing,
  selectClientPaymentsEditOpen,
  selectClientPaymentsEditing,
  selectClientPaymentsSaving,
  selectClientPaymentsBusyIds,
} from './store/selectors';

export default function ClientPaymentsTab() {
  const route = useRoute();
  const dispatch = useDispatch();

  const clientId =
    route?.params?.clientId ||
    route?.params?.client?.clientId ||
    route?.params?.id;

  const rows = useSelector(selectClientPayments);
  const loading = useSelector(selectClientPaymentsBusy);
  const error = useSelector(selectClientPaymentsError);
  const viewOpen = useSelector(selectClientPaymentsViewOpen);
  const viewing = useSelector(selectClientPaymentsViewing);
  const editOpen = useSelector(selectClientPaymentsEditOpen);
  const editing = useSelector(selectClientPaymentsEditing);
  const saving = useSelector(selectClientPaymentsSaving);
  const busyIds = useSelector(selectClientPaymentsBusyIds);

  const [q, setQ] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (clientId) dispatch(listByClient(clientId));
    }, [dispatch, clientId]),
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      `${r.transactionId} ${r.status} ${r.project?.projectName || ''} ${
        r.invoice?.invoiceNumber || ''
      }`
        .toLowerCase()
        .includes(s),
    );
  }, [rows, q]);

  const onView = row => dispatch(openView(row));
  const onEdit = row => dispatch(openEdit(row));
  const onDelete = row =>
    Alert.alert('Delete Payment?', `Txn ${row.transactionId}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deletePayment(row.id, clientId)),
      },
    ]);

  const onDownload = row => {
    if (row?.receiptFileUrl) Linking.openURL(row.receiptFileUrl);
  };

  const onSaveEdit = payload => {
    if (!editing?.id) return;
    dispatch(updatePayment(editing.id, payload, clientId));
  };

  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* Filters */}
      <View style={s.card}>
        <Text style={s.title}>Filters</Text>
        <Text style={s.label}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="transaction id, status, project, invoice…"
          placeholderTextColor="#9ca3af"
          style={s.input}
        />
        {!!error && (
          <Text style={{ color: '#b91c1c', marginTop: 8 }}>
            {String(error)}
          </Text>
        )}
      </View>

      {/* Table */}
      <PaymentsTable
        data={filtered}
        loading={loading}
        busyIds={busyIds}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onDownload={onDownload}
      />

      {/* View Modal */}
      <PaymentViewModal
        visible={viewOpen}
        payment={viewing}
        onClose={() => dispatch(closeView())}
      />

      {/* Edit Modal */}
      <PaymentEditModal
        visible={editOpen}
        payment={editing}
        busy={saving}
        onClose={() => dispatch(closeEdit())}
        onSave={onSaveEdit}
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
});
