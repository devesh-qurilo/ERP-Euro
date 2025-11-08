const S = s => s?.admin?.clientsViewCreditNotes;

export const selectCNCList = s => S(s)?.list || [];
export const selectCNCLoading = s => !!S(s)?.loading;
export const selectCNCError = s => S(s)?.error;
export const selectCNCFilters = s => S(s)?.filters || { q: '' };
export const selectCNCBusyIds = s => S(s)?.busyIds || [];

export const selectCNCViewOpen = s => !!S(s)?.viewOpen;
export const selectCNCViewing = s => S(s)?.viewing;

export const selectCNCEditOpen = s => !!S(s)?.editOpen;
export const selectCNCEditing = s => S(s)?.editing;
export const selectCNCEditBusy = s => !!S(s)?.editBusy;
