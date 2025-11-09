const base = s => s?.admin?.clientsViewNotes;

export const selectCVNList = s => base(s)?.list || [];
export const selectCVNLoading = s => !!base(s)?.loading;
export const selectCVNBusyIds = s => base(s)?.busyIds || [];
export const selectCVNFormOpen = s => !!base(s)?.formOpen;
export const selectCVNEditing = s => base(s)?.editing;
export const selectCVNSubmitting = s => !!base(s)?.submitting;
export const selectCVNViewOpen = s => !!base(s)?.viewOpen;
export const selectCVNViewItem = s => base(s)?.viewItem;
