const root = s => s.admin?.hr?.leaves || {};

export const selectLeaves = s => root(s).list || [];
export const selectLeavesLoading = s => !!root(s).loading;
export const selectLeavesError = s => root(s).error;

export const selectLeavesFilters = s =>
  root(s).filters || { q: '', type: 'All', status: 'All' };
export const selectLeavesMode = s => root(s).mode || 'list';

export const selectLeaveModalOpen = s => !!root(s).modalOpen;
export const selectLeavesApplying = s => !!root(s).applying;
export const selectLeavesBusyIds = s => root(s).busyIds || [];

export const selectLeaveQuota = s => root(s).quota || [];
export const selectLeaveQuotaLoading = s => !!root(s).quotaLoading;
