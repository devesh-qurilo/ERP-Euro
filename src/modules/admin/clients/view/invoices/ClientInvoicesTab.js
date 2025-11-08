import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

// local list-by-client slice
import { listByClient } from './store/actions';
import {
  selectClientInvoices,
  selectClientInvoicesBusy,
  selectClientInvoicesErr,
} from './store/selectors';

// reuse finance UI
import InvoicesTable from '../../../finance/invoice/components/InvoiceTableClient';
import InvoiceFormModal from '../../../finance/invoice/components/InvoiceFormModal';
import InvoiceViewModal from '../../../finance/invoice/components/InvoiceViewModal';

// finance actions (Wohi jo AdminFinanceInvoice me use ho rahe hain)
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
} from '../../../finance/invoice/store/actions';

// NOTE: agar aapke selector names/paths different hain to yahan inline safe paths use kar rahe hain
const selectFinanceBusy = s => !!s?.admin?.work?.projects?.loading || false; // fallback
// ^ replace if you have a proper invoice busy selector, e.g. s.admin.finance.invoices.busy

export default function ClientInvoicesTab() {
  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();

  // clientId resolve (AdminClientViewScreen se aata hai)
  const clientId =
    route?.params?.clientId ||
    route?.params?.client?.clientId ||
    route?.params?.id;

  // list state
  const rows = useSelector(selectClientInvoices);
  const loading = useSelector(selectClientInvoicesBusy);
  const error = useSelector(selectClientInvoicesErr);

  // generic busy (replace with proper finance busy if you have)
  const saving = useSelector(selectFinanceBusy);

  // local modal state (simple & decoupled from Finance screen)
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // filters
  const [search, setSearch] = useState('');

  // load on focus
  useFocusEffect(
    useCallback(() => {
      if (clientId) dispatch(listByClient(clientId));
    }, [dispatch, clientId]),
  );

  // filter client invoices
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(inv =>
      `${inv.invoiceNumber} ${inv.project?.projectName || ''} ${
        inv.status || ''
      }`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  // —— handlers ——
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
    if (editing) {
      dispatch(updateInvoice(editing.invoiceNumber, payload));
    } else {
      dispatch(createInvoice({ ...payload, clientId })); // lock clientId
    }
    setFormOpen(false);
  };

  const onDeleteRow = row => dispatch(deleteInvoice(row.invoiceNumber));
  const onMarkPaid = row => dispatch(markInvoicePaid(row.id));
  const onReminder = row => dispatch(sendPaymentReminder(row.invoiceNumber));

  // Files
  const onUploadFile = (row, file) =>
    dispatch(uploadInvoiceFile(row.invoiceNumber, file));
  const onDeleteFile = (row, fileUrl) =>
    dispatch(deleteInvoiceFile(row.invoiceNumber, fileUrl));

  // Payments / Receipts navigations (Finance stack ke andar screens)
  const goPayments = invoiceNumber =>
    nav.navigate('Finance', {
      screen: 'InvoicePaymentsScreen',
      params: { invoiceNumber },
    });

  const goReceipts = invoiceId =>
    nav.navigate('Finance', {
      screen: 'InvoiceReceiptsScreen',
      params: { invoiceId },
    });

  const onAddPayment = row =>
    dispatch(addPayment({ invoiceNumber: row.invoiceNumber })); // aapka saga formdata open karke kare to better

  const onDuplicate = row => dispatch(duplicateInvoice(row.invoiceNumber)); // agar aapne action/saga banaya hai

  // UI
  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* Section 1: Filters */}
      <View style={styles.card}>
        <Text style={styles.title}>Filters</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="invoice no, project, status…"
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

      {/* Section 2: Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable style={[styles.btn, styles.primary]} onPress={onAdd}>
          <Text style={[styles.btnTxt, { color: '#fff' }]}>+ Add Invoice</Text>
        </Pressable>
      </View>

      {/* Section 3: Table (Client column hidden here) */}
      <InvoicesTable
        data={filtered}
        loading={loading}
        showClientColumn={false}
        // ACTIONS — keep names consistent with your existing InvoicesTable props:
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

      {/* View modal */}
      <InvoiceViewModal
        visible={viewOpen}
        invoice={viewing}
        onClose={() => setViewOpen(false)}
      />

      {/* Add/Edit modal (lock clientId) */}
      <InvoiceFormModal
        visible={formOpen}
        editing={editing}
        presetClientId={clientId}
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
