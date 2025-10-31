const root = s => s.admin?.hr?.designations || {};

export const selectDesignations = s => root(s).list || [];
export const selectDesignationsLoading = s => !!root(s).loading;
export const selectDesignationsError = s => root(s).error;
export const selectDesignationsBusyIds = s => root(s).busyIds || [];

export const selectDesignationModalOpen = s => !!root(s).modalOpen;
export const selectDesignationEditing = s => root(s).editing;

export const selectDesignationsMode = s => root(s).mode || 'list';
