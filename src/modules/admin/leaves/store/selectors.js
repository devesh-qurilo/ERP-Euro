// src/modules/admin/leaves/store/selectors.js
export const selectLeavesState = state => state.admin?.leaves || {};
export const selectLeavesLoading = state => selectLeavesState(state).loading;
export const selectLeavesError = state => selectLeavesState(state).error;
export const selectLeavesDate = state => selectLeavesState(state).date;
export const selectLeavesEntries = state =>
  selectLeavesState(state).entries || [];
