// src/modules/admin/clients/view/invoices/ProjectInvoicesTab.js
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoicesByProject } from '../../../../../modules/admin/finance/invoice/store/actions';
import {
  selectInvoicesByProject,
  selectInvoicesBusy,
} from '../../../../../modules/admin/finance/invoice/store/selectors';
import InvoiceTable from '../../../../../modules/admin/finance/invoice/components/InvoiceTable';
import InvoiceViewModal from '../../../../../modules/admin/finance/invoice/components/InvoiceViewModal';
import InvoiceFormModal from '../../../../../modules/admin/finance/invoice/components/InvoiceFormModal';
// import AddPaymentModal from '../../../../../modules/admin/finance/invoice/components/AddPaymentModal';

export default function ProjectInvoicesTab({ project }) {
  const projectId =
    project?.id || route?.projectId || route?.params?.project?.id;
  const dispatch = useDispatch();

  const invoices = useSelector(s => selectInvoicesByProject(s, projectId));
  const busy = useSelector(selectInvoicesBusy);

  useEffect(() => {
    if (projectId) dispatch(fetchInvoicesByProject(projectId));
  }, [projectId, dispatch]);

  // Reuse the same action handlers you already use in ClientInvoicesTab:
  // onView, onEdit, onMarkPaid, onAddPayment, onReminder, onUploadFile, onDelete, etc.
  // If you export them as hooks/util from your invoice screen, import here and wire up.
  const handlers = {}; // <-- bring your existing ones (to keep snippet short)

  return (
    <View style={{ flex: 1 }}>
      <InvoiceTable
        data={invoices}
        loading={busy}
        // pass the same handlers you use on client invoices
        {...handlers}
      />

      {/* Keep your modals mounted here, same store flags as client screen */}
      <InvoiceViewModal />
      <InvoiceFormModal />
      {/* <AddPaymentModal /> */}
    </View>
  );
}
