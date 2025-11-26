// screens/AdminFinanceInvoice.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as A from '../store/actions';
import {
  selectInvoiceList,
  selectInvoiceListBusy,
  selectInvoiceFilters,
  selectCurrentInvoice,
  selectCurrentBusy,
} from '../store/selectors';

import InvoiceFilters from '../components/InvoiceFilters';
import InvoiceToolbar from '../components/InvoiceToolbar';
import InvoiceTable from '../components/InvoiceTable';
import ActionMenu from '../components/ActionMenu';
import InvoiceFormModal from '../components/InvoiceFormModal';
import InvoiceViewModal from '../components/InvoiceViewModal';
import UploadFileModal from '../components/UploadFileModal';
import ReceiptFormModal from '../components/ReceiptFormModal';
import PaymentFormModal from '../components/PaymentFormModal';
import CreditNoteFormModal from '../components/CreditNoteFormModal';

// helper: parse date string safely (yyyy-mm-dd or ISO)
const parseDate = d => {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const matchStatus = (rowStatus = '', filterStatus = '') => {
  if (!filterStatus || filterStatus === 'All') return true;
  if (!rowStatus) return false;
  return String(rowStatus)
    .toUpperCase()
    .includes(String(filterStatus).toUpperCase());
};

const shallowEqualFilters = (a = {}, b = {}) =>
  (a.fromDate || '') === (b.fromDate || '') &&
  (a.toDate || '') === (b.toDate || '') &&
  (a.status || '') === (b.status || '') &&
  (a.project || '') === (b.project || '');

export default function AdminFinanceInvoice({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector(selectInvoiceList);
  const loading = useSelector(selectInvoiceListBusy);
  const filters = useSelector(selectInvoiceFilters) || {};
  const current = useSelector(selectCurrentInvoice);
  const currentBusy = useSelector(selectCurrentBusy);

  // UI state
  const [creditNoteOpen, setCreditNoteOpen] = useState(false);
  const [creditFor, setCreditFor] = useState(null);
  const [actionState, setActionState] = useState({ open: false, row: null });
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [uploadFor, setUploadFor] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // initial load once using existing store filters
  useEffect(() => {
    dispatch(A.list(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filters change (auto-apply from InvoiceFilters), update store.
  // We do client-side filtering (no dispatch(A.list)) by default to avoid unnecessary network calls.
  const onFilterChange = useCallback(
    next => {
      const normalized = {
        fromDate: next.fromDate || '',
        toDate: next.toDate || '',
        status: next.status || '',
        project: next.project || '',
      };

      if (shallowEqualFilters(normalized, filters)) return;

      dispatch(A.setFilters(normalized));

      // If you prefer server-side filtering, uncomment this line:
      // dispatch(A.list(normalized));
    },
    [dispatch, filters],
  );

  // Client-side filtered items (date range, status, project)
  const filteredItems = useMemo(() => {
    if (!items || !items.length) return [];

    const from = parseDate(filters?.fromDate);
    const to = parseDate(filters?.toDate);
    const toEnd = to
      ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999)
      : null;
    const statusFilter = filters?.status || '';
    const projectFilter = (filters?.project || '').trim().toLowerCase();

    return items.filter(inv => {
      // date
      if (from || toEnd) {
        const invDate = parseDate(inv.invoiceDate || inv.createdAt);
        if (!invDate) return false;
        if (from && invDate < from) return false;
        if (toEnd && invDate > toEnd) return false;
      }

      // status
      if (!matchStatus(inv.status, statusFilter)) return false;

      // project (match name or code)
      if (projectFilter) {
        const pName = (inv.project?.projectName || '').toLowerCase();
        const pCode = (inv.project?.projectCode || '').toLowerCase();
        if (!pName.includes(projectFilter) && !pCode.includes(projectFilter))
          return false;
      }

      return true;
    });
  }, [items, filters]);

  // create/update handlers
  const onCreate = payload => {
    dispatch(A.create(payload));
    setAddOpen(false);
  };
  const onUpdate = payload => {
    dispatch(A.update(editRow.invoiceNumber, payload));
    setEditRow(null);
  };

  // action selection
  const handleAction = (action, row) => {
    const invNo = row.invoiceNumber;
    switch (action) {
      case 'Delete':
        dispatch(A.deleteInvoice(invNo));
        break;
      case 'Add credit notes':
        setCreditFor(row);
        setCreditNoteOpen(true);
        break;
      case 'View credit note':
        if (navigation)
          navigation.navigate('CreditNotesScreen', { invoiceNumber: invNo });
        else dispatch(A.listCreditNotes(invNo));
        break;
      case 'Add payment':
        setPaymentOpen(true);
        break;
      case 'View':
        dispatch(A.getOne(invNo));
        setViewOpen(true);
        break;
      case 'Edit':
        setEditRow(row);
        break;
      case 'Upload file':
        setUploadFor(row);
        break;
      case 'Add receipt':
        setReceiptOpen(true);
        break;
      case 'View receipt':
        if (navigation)
          navigation.navigate('InvoiceReceiptsScreen', { invoiceId: invNo });
        else dispatch(A.listReceipts(invNo));
        break;
      case 'View payment':
        if (navigation)
          navigation.navigate('InvoicePaymentsScreen', {
            invoiceNumber: invNo,
          });
        else dispatch(A.listPayments(invNo));
        break;
      case 'Payment reminder':
        dispatch(A.sendReminder(invNo));
        break;
      case 'Mark as paid':
        dispatch(A.markPaid(invNo));
        break;
      case 'Create duplicate':
        setAddOpen(true);
        break;
      default:
        break;
    }
    setActionState({ open: false, row: null });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      <InvoiceFilters onChange={onFilterChange} initialFilters={filters} />
      <InvoiceToolbar onAdd={() => setAddOpen(true)} />

      <InvoiceTable
        items={filteredItems}
        loading={loading}
        onOpenActions={row => setActionState({ open: true, row })}
      />

      <ActionMenu
        visible={actionState.open}
        row={actionState.row}
        onSelect={handleAction}
        onClose={() => setActionState({ open: false, row: null })}
      />

      <InvoiceFormModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={onCreate}
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

      <InvoiceViewModal
        visible={viewOpen}
        onClose={() => setViewOpen(false)}
        data={current}
        busy={currentBusy}
      />

      <UploadFileModal
        visible={!!uploadFor}
        onClose={() => setUploadFor(null)}
        onSubmit={file =>
          uploadFor && dispatch(A.uploadFile(uploadFor.invoiceNumber, file))
        }
      />

      <ReceiptFormModal
        visible={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        onSubmit={payload => {
          dispatch(A.addReceipt(payload));
          setReceiptOpen(false);
        }}
      />

      <PaymentFormModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={({ payment, file }) => {
          dispatch(A.addPayment({ payment, file }));
          setPaymentOpen(false);
        }}
      />

      <CreditNoteFormModal
        visible={creditNoteOpen}
        onClose={() => {
          setCreditNoteOpen(false);
          setCreditFor(null);
        }}
        invoiceNumber={creditFor?.invoiceNumber}
        onSubmit={(invoiceNumber, notePayload, file) => {
          dispatch(A.addCreditNote(invoiceNumber, notePayload, file));
          setCreditNoteOpen(false);
          setCreditFor(null);
        }}
      />
    </View>
  );
}
