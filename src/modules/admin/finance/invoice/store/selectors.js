const root = s => s.admin.finance.invoice;

export const selectInvoiceList = s => root(s).list.items;
export const selectInvoiceListBusy = s => root(s).list.loading;
export const selectInvoicePaging = s => {
  const { page, size, total } = root(s).list;
  return { page, size, total };
};
export const selectInvoiceFilters = s => root(s).list.filters;

export const selectCurrentInvoice = s => root(s).current.data;
export const selectCurrentBusy = s => root(s).current.loading;

export const selectCrudBusy = s => {
  const { creating, updating } = root(s).crud;
  return creating || updating;
};

export const selectFilesBusy = s => root(s).files.working;

export const selectReceipts = s => root(s).receipts.items;
export const selectReceiptsBusy = s => root(s).receipts.loading;

export const selectPayments = s => root(s).payments.items;
export const selectPaymentsBusy = s => root(s).payments.loading;

export const selectCreditNotes = s => s.admin.finance.invoice.creditNotes.items;
export const selectCreditNotesBusy = s =>
  s.admin.finance.invoice.creditNotes.loading;
