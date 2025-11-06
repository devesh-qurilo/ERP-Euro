const root = s => s.admin?.work?.projects || {};

export const selectAWPList = s => root(s).list || [];
export const selectAWPLoading = s => !!root(s).loading;
export const selectAWPError = s => root(s).error;
export const selectAWPBusyIds = s => root(s).busyIds || [];
export const selectAWPMode = s => root(s).mode || 'list';
export const selectAWPFilters = s =>
  root(s).filters || { q: '', status: 'All' };
export const selectAWPModalOpen = s => !!root(s).modalOpen;
export const selectAWPEditing = s => root(s).editing;
