// src/modules/admin/work/projects/view/payments/ProjectPaymentsTab.js
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import PaymentsTable from '../../../../clients/view/payments/components/PaymentsTable';
import PaymentViewModal from '../../../../clients/view/payments/components/PaymentViewModal';
import PaymentEditModal from '../../../../clients/view/payments/components/PaymentEditModal';
import PaymentCreateModal from '../../../../clients/view/payments/components/PaymentCreateModal';

import {
  listByProject,
  openView,
  closeView,
  openEdit,
  closeEdit,
  updatePayment,
  deletePayment,
  openCreate,
  closeCreate,
  createPayment,
} from './store/actions';

import {
  selectProjectPayments,
  selectProjectPaymentsBusy,
  selectProjectPaymentsError,
  selectProjectPaymentsViewOpen,
  selectProjectPaymentsViewing,
  selectProjectPaymentsEditOpen,
  selectProjectPaymentsEditing,
  selectProjectPaymentsSaving,
  selectProjectPaymentsBusyIds,
  selectProjectPaymentsCreateOpen,
  selectProjectPaymentsCreatingPreset,
  selectProjectPaymentsCreateBusy,
  rahul,
} from './store/selectors';

export default function ProjectPaymentsTab() {
  const route = useRoute();
  const dispatch = useDispatch();

  const projectId =
    route?.params?.projectId || route?.params?.project?.id || route?.params?.id;
  const clientId = route?.params?.client?.clientId || route?.params?.clientId; // optional, useful for preset

  const rows = useSelector(selectProjectPayments);
  const loading = useSelector(selectProjectPaymentsBusy);
  const error = useSelector(selectProjectPaymentsError);
  const viewOpen = useSelector(selectProjectPaymentsViewOpen);
  const viewing = useSelector(selectProjectPaymentsViewing);
  const editOpen = useSelector(selectProjectPaymentsEditOpen);
  const editing = useSelector(selectProjectPaymentsEditing);
  const saving = useSelector(selectProjectPaymentsSaving);
  const busyIds = useSelector(selectProjectPaymentsBusyIds);

  const createOpen = useSelector(selectProjectPaymentsCreateOpen);
  const creatingPreset = useSelector(selectProjectPaymentsCreatingPreset);
  const createBusy = useSelector(selectProjectPaymentsCreateBusy);
  const raju = useSelector(rahul);
  const [q, setQ] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (projectId) dispatch(listByProject(projectId));
    }, [dispatch, projectId]),
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
        onPress: () => dispatch(deletePayment(row.id, projectId)),
      },
    ]);

  const onDownload = row => {
    if (row?.receiptFileUrl) Linking.openURL(row.receiptFileUrl);
  };

  const onSaveEdit = payload => {
    if (!editing?.id) return;
    dispatch(updatePayment(editing.id, payload, projectId));
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

      {/* View */}
      <PaymentViewModal
        visible={viewOpen}
        payment={viewing}
        onClose={() => dispatch(closeView())}
      />

      {/* Edit */}
      <PaymentEditModal
        visible={editOpen}
        payment={editing}
        busy={saving}
        onClose={() => dispatch(closeEdit())}
        onSave={onSaveEdit}
      />

      {/* Create (uses PROJECT createOpen) */}
      <PaymentCreateModal
        visible={createOpen}
        preset={creatingPreset} // { projectId, clientId? }
        busy={createBusy}
        onClose={() => dispatch(closeCreate())}
        onSave={payload => dispatch(createPayment(payload, projectId))}
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
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  btnTxt: { color: '#1d4ed8', fontWeight: '600' },
  primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
});
