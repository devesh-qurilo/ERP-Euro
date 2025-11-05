const root = s => s.admin?.hr?.projects || {};

export const selectEmpProjects = s => root(s).list || [];
export const selectEmpProjectsLoading = s => !!root(s).loading;
export const selectEmpProjectsError = s => root(s).error;
export const selectEmpProjectsBusy = s => root(s).busyIds || [];
export const selectEmpProjModalOpen = s => !!root(s).modalOpen;
export const selectEmpProjEditing = s => root(s).editing;
