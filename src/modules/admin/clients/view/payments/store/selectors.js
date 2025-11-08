export const selectClientPayments = s =>
  s?.admin?.clientsViewPayments?.items || [];
export const selectClientPaymentsBusy = s =>
  !!s?.admin?.clientsViewPayments?.loading;
export const selectClientPaymentsError = s =>
  s?.admin?.clientsViewPayments?.error;

export const selectClientPaymentsViewOpen = s =>
  !!s?.admin?.clientsViewPayments?.viewOpen;
export const selectClientPaymentsViewing = s =>
  s?.admin?.clientsViewPayments?.viewing;

export const selectClientPaymentsEditOpen = s =>
  !!s?.admin?.clientsViewPayments?.editOpen;
export const selectClientPaymentsEditing = s =>
  s?.admin?.clientsViewPayments?.editing;

export const selectClientPaymentsSaving = s =>
  !!s?.admin?.clientsViewPayments?.busy;
export const selectClientPaymentsBusyIds = s =>
  s?.admin?.clientsViewPayments?.busyIds || [];

export const selectClientPaymentsCreateOpen = s =>
  !!s?.admin?.clientsViewPayments?.createOpen;
export const selectClientPaymentsCreatingPreset = s =>
  s?.admin?.clientsViewPayments?.creatingPreset || {};
export const selectClientPaymentsCreateBusy = s =>
  !!s?.admin?.clientsViewPayments?.createBusy;
