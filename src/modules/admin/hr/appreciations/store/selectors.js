const root = s => s.admin?.hr?.appreciations || {};

export const selectApprecs = s => root(s).list || [];
export const selectApprecsFilters = s => root(s).filters || {};
export const selectApprecBusyIds = s => root(s).busyIds || [];
export const selectApprecModalOpen = s => !!root(s).modalOpen;
export const selectApprecEditing = s => root(s).editing;

export const selectAwards = s => root(s).awards || [];
export const selectAwardModalOpen = s => !!root(s).awardModalOpen;
export const selectAwardEditing = s => root(s).awardEditing;
export const selectApprecMode = s => root(s).mode || 'list';
