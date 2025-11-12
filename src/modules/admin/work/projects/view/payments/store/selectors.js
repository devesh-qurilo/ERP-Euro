export const rahul = s => s?.admin || [];

export const selectProjectPayments = s =>
  s?.admin?.projectsViewPayments?.items || [];
export const selectProjectPaymentsBusy = s =>
  !!s?.admin?.projectsViewPayments?.loading;
export const selectProjectPaymentsError = s =>
  s?.admin?.projectsViewPayments?.error;

export const selectProjectPaymentsViewOpen = s =>
  !!s?.admin?.projectsViewPayments?.viewOpen;
export const selectProjectPaymentsViewing = s =>
  s?.admin?.projectsViewPayments?.viewing;

export const selectProjectPaymentsEditOpen = s =>
  !!s?.admin?.projectsViewPayments?.editOpen;
export const selectProjectPaymentsEditing = s =>
  s?.admin?.projectsViewPayments?.editing;

export const selectProjectPaymentsSaving = s =>
  !!s?.admin?.projectsViewPayments?.busy;
export const selectProjectPaymentsBusyIds = s =>
  s?.admin?.projectsViewPayments?.busyIds || [];

export const selectProjectPaymentsCreateOpen = s =>
  !!s?.admin?.projectsViewPayments?.createOpen;
export const selectProjectPaymentsCreatingPreset = s =>
  s?.admin?.projectsViewPayments?.creatingPreset || {};
export const selectProjectPaymentsCreateBusy = s =>
  !!s?.admin?.projectsViewPayments?.createBusy;
