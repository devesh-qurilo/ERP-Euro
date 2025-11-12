// src/modules/admin/work/projects/view/invoices/store/selectors.js
export const selectProjectInvoices = s =>
  s?.admin?.projectViewInvoices?.items || [];
export const selectProjectInvoicesBusy = s =>
  !!s?.admin?.projectViewInvoices?.loading;
export const selectProjectInvoicesErr = s =>
  s?.admin?.projectViewInvoices?.error;
