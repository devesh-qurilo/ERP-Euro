import React, { useEffect, useState } from 'react';
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

// If using react-navigation, inject `navigation` prop
export default function AdminFinanceInvoice({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector(selectInvoiceList);
  const loading = useSelector(selectInvoiceListBusy);
  const filters = useSelector(selectInvoiceFilters);
  const current = useSelector(selectCurrentInvoice);
  const currentBusy = useSelector(selectCurrentBusy);

  const [actionState, setActionState] = useState({ open: false, row: null });
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [uploadFor, setUploadFor] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    dispatch(A.list());
  }, [dispatch]);

  // filters apply
  const onFilterChange = next => {
    dispatch(A.setFilters(next));
    dispatch(A.list(next));
  };

  // add / edit
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
    const invId = row.id;

    switch (action) {
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
      case 'Delete':
        // TODO: if backend provides delete invoice endpoint
        break;
      case 'Add receipt':
        setReceiptOpen(true);
        break;
      case 'View receipt':
        if (navigation)
          navigation.navigate('InvoiceReceiptsScreen', { invoiceId: invId });
        else dispatch(A.listReceipts(invId));
        break;
      case 'Add payment':
        setPaymentOpen(true);
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
        dispatch(A.markPaid(invId));
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
      <InvoiceFilters onChange={onFilterChange} />
      <InvoiceToolbar onAdd={() => setAddOpen(true)} />
      <InvoiceTable
        items={items}
        loading={loading}
        onOpenActions={row => setActionState({ open: true, row })}
      />

      <ActionMenu
        visible={actionState.open}
        row={actionState.row}
        onSelect={handleAction}
        onClose={() => setActionState({ open: false, row: null })}
      />

      {/* Add */}
      <InvoiceFormModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={onCreate}
      />

      {/* Edit */}
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

      {/* View */}
      <InvoiceViewModal
        visible={viewOpen}
        onClose={() => setViewOpen(false)}
        data={current}
        busy={currentBusy}
      />

      {/* Upload File */}
      <UploadFileModal
        visible={!!uploadFor}
        onClose={() => setUploadFor(null)}
        onSubmit={file =>
          uploadFor && dispatch(A.uploadFile(uploadFor.invoiceNumber, file))
        }
      />

      {/* Add Receipt */}
      <ReceiptFormModal
        visible={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        onSubmit={payload => {
          dispatch(A.addReceipt(payload));
          setReceiptOpen(false);
        }}
      />

      {/* Add Payment */}
      <PaymentFormModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={({ payment, file }) => {
          dispatch(A.addPayment({ payment, file }));
          setPaymentOpen(false);
        }}
      />
    </View>
  );
}
