// src/modules/admin/work/projects/view/invoices/ProjectInvoicesTab.js

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';

// actions
import { listByProject } from './store/actions';
import {
  create,
  update,
  deleteInvoice,
  markPaid,
  sendReminder,
  uploadFile,
  addPayment,
  duplicateInvoice,
  listCreditNotes,
  addCreditNote,
  addReceipt,
} from '../../../../finance/invoice/store/actions';

// selectors
import {
  selectProjectInvoices,
  selectProjectInvoicesBusy,
  selectProjectInvoicesErr,
} from './store/selectors';

// components
import InvoicesTable from '../../../../finance/invoice/components/InvoiceTable';
import InvoiceViewModal from '../../../../finance/invoice/components/InvoiceViewModal';
import ProjectInvoiceFormModal from '../../../../finance/invoice/components/ProjectInvoiceFormModal';
import PaymentFormModal from '../../../../finance/invoice/components/PaymentFormModal';
import UploadFileModal from '../../../../finance/invoice/components/UploadFileModal';
import CreditNoteFormModal from '../../../../finance/invoice/components/CreditNoteFormModal';
import ReceiptFormModal from '../../../../finance/invoice/components/ReceiptFormModal';
import ActionMenu from '../../../../finance/invoice/components/ActionMenu';

export default function ProjectInvoicesTab() {
  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();

  const project = route?.params?.project;
  const projectId = project?.id;

  const rows = useSelector(selectProjectInvoices);
  const loading = useSelector(selectProjectInvoicesBusy);
  const error = useSelector(selectProjectInvoicesErr);

  const [search, setSearch] = useState('');

  // ===== MODAL STATES =====
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [uploadFor, setUploadFor] = useState(null);
  const [creditNoteOpen, setCreditNoteOpen] = useState(false);
  const [creditFor, setCreditFor] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuRow, setMenuRow] = useState(null);

  // ===== FETCH =====
  useFocusEffect(
    useCallback(() => {
      if (projectId) dispatch(listByProject(projectId));
    }, [projectId]),
  );

  const refresh = () => dispatch(listByProject(projectId));

  // ===== FILTER =====
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;

    return rows.filter(inv =>
      `${inv.invoiceNumber} ${inv.status} ${inv.client?.name || ''}`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  // ===== ACTION MENU =====
  const openMenu = row => {
    setMenuRow(row);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setMenuRow(null);
  };

  const handleAction = (action, row) => {
    closeMenu();

    switch (action) {
      case 'View':
        setViewing(row);
        setViewOpen(true);
        break;

      case 'Edit':
        setEditing(row);
        setFormOpen(true);
        break;

      case 'Delete':
        dispatch(deleteInvoice(row.invoiceNumber));
        setTimeout(refresh, 300);
        break;

      case 'Mark as paid':
        dispatch(markPaid(row.invoiceNumber));
        setTimeout(refresh, 300);
        break;

      case 'Add payment':
        setMenuRow(row);
        setPaymentOpen(true);
        break;

      case 'View payment':
        nav.navigate('Finance', {
          screen: 'InvoicePaymentsScreen',
          params: { invoiceNumber: row.invoiceNumber },
        });
        break;

      case 'Payment reminder':
        dispatch(sendReminder(row.invoiceNumber));
        break;

      case 'Upload file':
        setUploadFor(row);
        break;

      case 'Add credit notes':
        setCreditFor(row);
        setCreditNoteOpen(true);
        break;

      case 'View credit note':
        dispatch(listCreditNotes(row.invoiceNumber));
        break;

      case 'Add receipt':
        setReceiptOpen(true);
        break;

      case 'View receipt':
        nav.navigate('InvoiceReceiptsScreen', {
          invoiceId: row.invoiceNumber,
        });
        break;

      case 'Create duplicate':
        dispatch(duplicateInvoice(row.invoiceNumber));
        setTimeout(refresh, 300);
        break;

      default:
        break;
    }
  };

  // ===== SAVE =====
  const onSave = payload => {
    if (editing) {
      dispatch(update(editing.invoiceNumber, payload));
    } else {
      dispatch(create({ ...payload, projectId }));
    }
    setFormOpen(false);
    setEditing(null);
    setTimeout(refresh, 300);
  };

  return (
    <View style={{ padding: 12, gap: 12 }}>
      {/* FILTER */}
      <View style={styles.card}>
        <Text style={styles.title}>Filters</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search invoice..."
          style={styles.input}
        />
        {!!error && <Text style={{ color: 'red' }}>{error}</Text>}
      </View>

      {/* ACTION */}
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={() => setFormOpen(true)}>
          <Text style={styles.btnTxt}>+ Add Invoice</Text>
        </Pressable>
      </View>

      {/* TABLE */}
      <InvoicesTable
        items={filtered}
        loading={loading}
        showClientColumn={false}
        onOpenActions={openMenu}
      />

      {/* ACTION MENU */}
      <ActionMenu
        visible={menuVisible}
        row={menuRow}
        onClose={closeMenu}
        onSelect={handleAction}
      />

      {/* ===== MODALS ===== */}

      <InvoiceViewModal
        visible={viewOpen}
        invoice={viewing}
        onClose={() => setViewOpen(false)}
      />

      <ProjectInvoiceFormModal
        visible={formOpen}
        editing={editing}
        project={project}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
      />

      <PaymentFormModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={({ payment, file }) => {
          dispatch(addPayment({ payment, file }));
          setPaymentOpen(false);
          setTimeout(refresh, 300);
        }}
      />

      <UploadFileModal
        visible={!!uploadFor}
        onClose={() => setUploadFor(null)}
        onSubmit={file => {
          dispatch(uploadFile(uploadFor.invoiceNumber, file));
          setUploadFor(null);
          setTimeout(refresh, 300);
        }}
      />

      <CreditNoteFormModal
        visible={creditNoteOpen}
        onClose={() => {
          setCreditNoteOpen(false);
          setCreditFor(null);
        }}
        invoiceNumber={creditFor?.invoiceNumber}
        onSubmit={(invoiceNumber, payload, file) => {
          dispatch(addCreditNote(invoiceNumber, payload, file));
          setCreditNoteOpen(false);
          setCreditFor(null);
          setTimeout(refresh, 300);
        }}
      />

      <ReceiptFormModal
        visible={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        onSubmit={payload => {
          dispatch(addReceipt(payload));
          setReceiptOpen(false);
          setTimeout(refresh, 300);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontWeight: '700', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    backgroundColor: '#1d4ed8',
    padding: 10,
    borderRadius: 8,
  },
  btnTxt: {
    color: '#fff',
    fontWeight: '600',
  },
});
