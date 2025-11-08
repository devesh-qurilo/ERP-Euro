export const selectClientInvoices = s =>
  s?.admin?.clientsViewInvoices?.items || [];
export const selectClientInvoicesBusy = s =>
  !!s?.admin?.clientsViewInvoices?.loading;
export const selectClientInvoicesErr = s =>
  s?.admin?.clientsViewInvoices?.error;
