export const rahul = s => s?.admin || [];
export const selectProjectPayments = s =>
  s?.admin?.projectViewPayments?.items || [];
export const selectProjectPaymentsBusy = s =>
  !!s?.admin?.projectViewPayments?.loading;
export const selectProjectPaymentsError = s =>
  s?.admin?.projectViewPayments?.error;

export const selectProjectPaymentsViewOpen = s =>
  !!s?.admin?.projectViewPayments?.viewOpen;
export const selectProjectPaymentsViewing = s =>
  s?.admin?.projectViewPayments?.viewing;

export const selectProjectPaymentsEditOpen = s =>
  !!s?.admin?.projectViewPayments?.editOpen;
export const selectProjectPaymentsEditing = s =>
  s?.admin?.projectViewPayments?.editing;

export const selectProjectPaymentsSaving = s =>
  !!s?.admin?.projectViewPayments?.busy;
export const selectProjectPaymentsBusyIds = s =>
  s?.admin?.projectViewPayments?.busyIds || [];

export const selectProjectPaymentsCreateOpen = s =>
  !!s?.admin?.projectViewPayments?.createOpen;
export const selectProjectPaymentsCreatingPreset = s =>
  s?.admin?.projectViewPayments?.creatingPreset || {};
export const selectProjectPaymentsCreateBusy = s =>
  !!s?.admin?.projectViewPayments?.createBusy;
