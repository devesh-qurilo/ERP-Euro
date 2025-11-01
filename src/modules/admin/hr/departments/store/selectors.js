const root = s => s.admin?.hr?.departments || {};

export const selectDepartments = s => root(s).list || [];
export const selectDepartmentsLoading = s => !!root(s).loading;
export const selectDepartmentsError = s => root(s).error;
export const selectDepartmentsBusyIds = s => root(s).busyIds || [];
export const selectDepartmentModalOpen = s => !!root(s).modalOpen;
export const selectDepartmentEditing = s => root(s).editing;
export const selectDepartmentsMode = s => root(s).mode || 'list';
