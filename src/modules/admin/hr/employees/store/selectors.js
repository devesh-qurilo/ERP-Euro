const root = s => s.admin?.hr?.employees || {};

export const selectEmpList = s => root(s).list || [];
export const selectEmpLoading = s => !!root(s).loading;
export const selectEmpError = s => root(s).error;
export const selectEmpBusyIds = s => root(s).busyIds || [];

export const selectEmpPage = s => root(s).page || 0;
export const selectEmpSize = s => root(s).size || 20;
export const selectEmpTotalPages = s => root(s).totalPages || 0;
export const selectEmpTotalElements = s => root(s).totalElements || 0;

export const selectEmpFilters = s => root(s).filters || {};

export const selectEmpModalOpen = s => !!root(s).modalOpen;
export const selectEmpEditing = s => root(s).editing;

export const selectInviteOpen = s => !!root(s).inviteOpen;

/* ================= EMPLOYEE ATTENDANCE ================= */

export const selectEmpAttendanceCalendar = s =>
  root(s).attendanceCalendar || [];

export const selectEmpAttendanceLoading = s => !!root(s).attendanceLoading;

export const selectEmpAttendanceError = s => root(s).attendanceError;

export const selectEmpLeaveQuota = s => root(s).quota || [];
export const selectEmpLeaveQuotaLoading = s => root(s).quotaLoading;

export const selectEmployeeLeaves = s => root(s).employeeLeaves || [];

export const selectEmployeeLeavesLoading = s => root(s).employeeLeavesLoading;
