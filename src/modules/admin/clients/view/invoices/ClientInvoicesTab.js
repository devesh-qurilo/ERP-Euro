import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { listByClient } from './store/actions';
import {
  selectClientInvoices,
  selectClientInvoicesBusy,
  selectClientInvoicesErr,
} from './store/selectors';

import InvoicesTableClient from '../../../finance/invoice/components/InvoicesTableClientTab';
import InvoiceFormModal from '../../../finance/invoice/components/InvoiceFormModal';
import InvoiceViewModal from '../../../finance/invoice/components/InvoiceViewModal';
import PaymentFormModal from '../../../finance/invoice/components/PaymentFormModal';
import ActionMenu from '../../../finance/invoice/components/ActionMenu';

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
} from '../../../finance/invoice/store/actions';
import UploadFileModal from '../../../finance/invoice/components/UploadFileModal';
import CreditNoteFormModal from '../../../finance/invoice/components/CreditNoteFormModal';
import ReceiptFormModal from '../../../finance/invoice/components/ReceiptFormModal';

export default function ClientInvoicesTab() {
  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();

  const clientId =
    route?.params?.clientId ||
    route?.params?.client?.clientId ||
    route?.params?.id;

  const rows = useSelector(selectClientInvoices);
  const loading = useSelector(selectClientInvoicesBusy);
  const error = useSelector(selectClientInvoicesErr);

  const [search, setSearch] = useState('');

  const [receiptOpen, setReceiptOpen] = useState(false);

  const [editRow, setEditRow] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [creditNoteOpen, setCreditNoteOpen] = useState(false);
  const [creditFor, setCreditFor] = useState(null);

  const [uploadFor, setUploadFor] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuRow, setMenuRow] = useState(null);

  const openMenu = row => {
    setMenuRow(row);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setMenuRow(null);
  };

  useFocusEffect(
    useCallback(() => {
      if (clientId) dispatch(listByClient(clientId));
    }, [dispatch, clientId]),
  );
  const refreshList = () => {
    dispatch(listByClient(clientId));
  };
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

  // ===== ACTION HANDLER =====
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

      case 'Add credit notes':
        setCreditFor(row);
        setCreditNoteOpen(true);
        break;
      case 'View credit note':
        if (nav)
          nav.navigate('CreditNotesScreen', {
            invoiceNumber: row.invoiceNumber,
          });
        else dispatch(listCreditNotes(row.invoiceNumber));
        break;

      case 'Delete':
        dispatch(deleteInvoice(row.invoiceNumber));
        setTimeout(refreshList, 300);
        break;

      case 'Mark as paid':
        dispatch(markPaid(row.invoiceNumber));
        break;

      case 'Add receipt':
        setReceiptOpen(true);
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

      case 'View receipt':
        nav.navigate('InvoiceReceiptsScreen', {
          invoiceId: row.invoiceNumber,
        });
        break;

      case 'Upload file':
        setUploadFor(row);
        break;

      // case 'Create duplicate':
      //   dispatch(duplicateInvoice(row.invoiceNumber));
      //   break;

      default:
        break;
    }
  };

  const onUpdate = payload => {
    dispatch(update(editRow.invoiceNumber, payload));
    setEditRow(null);
  };

  const onSave = payload => {
    if (editing) {
      dispatch(update(editing.invoiceNumber, payload));
    } else {
      dispatch(create({ ...payload, clientId }));
    }

    setFormOpen(false);
    setTimeout(() => dispatch(listByClient(clientId)), 300);
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

        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>

      {/* ACTION */}
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={() => setFormOpen(true)}>
          <Text style={styles.btnTxt}>+ Add Invoice</Text>
        </Pressable>
      </View>

      {/* TABLE */}
      <InvoicesTableClient
        data={filtered}
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

      {/* VIEW */}
      <InvoiceViewModal
        visible={viewOpen}
        invoice={viewing}
        onClose={() => setViewOpen(false)}
      />

      {/* FORM */}
      <InvoiceFormModal
        visible={formOpen}
        editing={editing}
        presetClientId={clientId}
        onClose={() => setFormOpen(false)}
        onSubmit={onSave}
      />

      {/* PAYMENT */}
      <PaymentFormModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={({ payment, file }) => {
          dispatch(addPayment({ payment, file }));
          setPaymentOpen(false);
        }}
      />
      <UploadFileModal
        visible={!!uploadFor}
        onClose={() => setUploadFor(null)}
        onSubmit={file =>
          uploadFor && dispatch(uploadFile(uploadFor.invoiceNumber, file))
        }
      />
      <CreditNoteFormModal
        visible={creditNoteOpen}
        onClose={() => {
          setCreditNoteOpen(false);
          setCreditFor(null);
        }}
        invoiceNumber={creditFor?.invoiceNumber}
        onSubmit={(invoiceNumber, notePayload, file) => {
          dispatch(addCreditNote(invoiceNumber, notePayload, file));
          setCreditNoteOpen(false);
          setCreditFor(null);
        }}
      />

      <ReceiptFormModal
        visible={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        onSubmit={payload => {
          dispatch(addReceipt(payload));
          setReceiptOpen(false);
        }}
      />
      <InvoiceFormModal
        visible={!!editRow}
        onClose={() => setEditRow(null)}
        initial={
          editRow && {
            invoiceNumber: editRow.invoiceNumber,
            invoiceDate: editRow.invoiceDate,
            currency: editRow.currency,
            projectId: String(editRow.projectId || ''),
            clientId: String(editRow.client?.clientId || ''),
            amount: String(editRow.amount ?? ''),
            tax: String(editRow.tax ?? ''),
            discount: String(editRow.discount ?? ''),
            amountInWords: String(editRow.amountInWords ?? ''),
            notes: String(editRow.notes ?? ''),
          }
        }
        onSubmit={onUpdate}
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

  title: {
    fontWeight: '700',
    marginBottom: 8,
  },

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

  error: {
    color: 'red',
    marginTop: 8,
  },
});
