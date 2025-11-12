// src/modules/admin/work/projects/view/invoices/ProjectInvoicesTab.js
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { listByProject } from './store/actions';
import {
  selectProjectInvoices,
  selectProjectInvoicesBusy,
  selectProjectInvoicesErr,
} from './store/selectors';

import InvoicesTable from '../../../../finance/invoice/components/InvoiceTable';
import InvoiceFormModal from '../../../../finance/invoice/components/InvoiceFormModal';
import InvoiceViewModal from '../../../../finance/invoice/components/InvoiceViewModal';

import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoicePaid,
  sendPaymentReminder,
  uploadInvoiceFile,
  deleteInvoiceFile,
  addPayment,
  duplicateInvoice,
} from '../../../../finance/invoice/store/actions';

const selectFinanceBusy = s => !!s?.admin?.work?.projects?.loading || false;

export default function ProjectInvoicesTab() {
  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();

  // Resolve projectId from multiple entry points safely
  const projectId =
    route?.params?.projectId ??
    route?.params?.project?.id ??
    route?.projectId ??
    route?.project?.id;

  const rows = useSelector(selectProjectInvoices);
  const loading = useSelector(selectProjectInvoicesBusy);
  const error = useSelector(selectProjectInvoicesErr);
  const saving = useSelector(selectFinanceBusy);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (projectId) dispatch(listByProject(projectId));
    }, [dispatch, projectId]),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(inv =>
      `${inv.invoiceNumber} ${inv.client?.name || ''} ${inv.status || ''}`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  // Handlers (reusing finance actions)
  const onAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const onEditRow = row => {
    setEditing(row);
    setFormOpen(true);
  };
  const onViewRow = row => {
    setViewing(row);
    setViewOpen(true);
  };
  const onSave = payload => {
    if (editing) dispatch(updateInvoice(editing.invoiceNumber, payload));
    else dispatch(createInvoice({ ...payload, projectId })); // lock projectId
    setFormOpen(false);
  };
  const onDeleteRow = row => dispatch(deleteInvoice(row.invoiceNumber));
  const onMarkPaid = row => dispatch(markInvoicePaid(row.id));
  const onReminder = row => dispatch(sendPaymentReminder(row.invoiceNumber));

  const onUploadFile = (row, file) =>
    dispatch(uploadInvoiceFile(row.invoiceNumber, file));
  const onDeleteFile = (row, fileUrl) =>
    dispatch(deleteInvoiceFile(row.invoiceNumber, fileUrl));

  const goPayments = invoiceNumber =>
    nav.navigate('Finance', {
      screen: 'InvoicePaymentsScreen',
      params: { invoiceNumber },
    });
  const goReceipts = invoiceIdOrNumber =>
    nav.navigate('Finance', {
      screen: 'InvoiceReceiptsScreen',
      params: { invoiceId: invoiceIdOrNumber },
    });

  const onAddPayment = row =>
    dispatch(addPayment({ invoiceNumber: row.invoiceNumber }));
  const onDuplicate = row => dispatch(duplicateInvoice(row.invoiceNumber));

  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* Filters */}
      <View style={styles.card}>
        <Text style={styles.title}>Filters</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="invoice no, client, status…"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
        </View>
        {!!error && (
          <Text style={{ color: '#b91c1c', marginTop: 8 }}>
            {String(error)}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable style={[styles.btn, styles.primary]} onPress={onAdd}>
          <Text style={[styles.btnTxt, { color: '#fff' }]}>+ Add Invoice</Text>
        </Pressable>
      </View>

      {/* Table (hide Client column since we’re already scoped by project) */}
      <InvoicesTable
        data={filtered || []}
        loading={loading}
        showClientColumn={false}
        onView={onViewRow}
        onEdit={onEditRow}
        onDelete={onDeleteRow}
        onMarkPaid={onMarkPaid}
        onPaymentReminder={onReminder}
        onAddPayment={onAddPayment}
        onViewPayments={row => goPayments(row.invoiceNumber)}
        onViewReceipts={row => goReceipts(row.invoiceId || row.invoiceNumber)}
        onUploadFile={onUploadFile}
        onDeleteFile={onDeleteFile}
        onDuplicate={onDuplicate}
      />

      {/* Modals */}
      <InvoiceViewModal
        visible={viewOpen}
        invoice={viewing}
        onClose={() => setViewOpen(false)}
      />
      <InvoiceFormModal
        visible={formOpen}
        editing={editing}
        presetProjectId={projectId}
        onClose={() => setFormOpen(false)}
        onSave={onSave}
        busy={!!saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '500', color: '#111827' },
});
