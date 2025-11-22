// src/modules/admin/wfh/store/selectors.js
export const selectWfhState = state => state.admin?.wfh || {};
export const selectWfhLoading = state => selectWfhState(state).loading;
export const selectWfhError = state => selectWfhState(state).error;
export const selectWfhDate = state => selectWfhState(state).date;
export const selectWfhEntries = state => selectWfhState(state).entries || [];
