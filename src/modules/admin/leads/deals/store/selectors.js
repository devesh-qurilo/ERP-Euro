export const selectDealsState = s => s.admin?.deals;
export const selectDeals = s => selectDealsState(s)?.list || [];
export const selectDealsBusy = s => !!selectDealsState(s)?.busy;
export const selectDealsParams = s => selectDealsState(s)?.params || {};
export const selectDealOne = s => selectDealsState(s)?.one;
export const selectFormOpen = s => !!selectDealsState(s)?.formOpen;
export const selectEditing = s => selectDealsState(s)?.editing;
export const selectFollowupOpen = s => !!selectDealsState(s)?.followupOpen;
export const selectFollowupDealId = s => selectDealsState(s)?.followupDealId;
