import * as T from './types';

export const fetchEmployees = opts => ({ type: T.FETCH_EMP_REQ, opts });
export const setEmpPage = (page, size = 20) => ({
  type: T.SET_EMP_PAGE,
  page,
  size,
});
export const setEmpFilters = patch => ({ type: T.SET_EMP_FILTERS, patch });

export const openEmpModal = (record = null) => ({
  type: T.OPEN_EMP_MODAL,
  record,
});
export const closeEmpModal = () => ({ type: T.CLOSE_EMP_MODAL });

export const openInviteModal = () => ({ type: T.OPEN_INVITE_MODAL });
export const closeInviteModal = () => ({ type: T.CLOSE_INVITE_MODAL });

export const createEmployee = payload => ({ type: T.CREATE_EMP_REQ, payload });
export const updateEmployee = (employeeId, payload) => ({
  type: T.UPDATE_EMP_REQ,
  employeeId,
  payload,
});
export const deleteEmployee = employeeId => ({
  type: T.DELETE_EMP_REQ,
  employeeId,
});

export const patchEmployeeRole = (employeeId, role) => ({
  type: T.PATCH_ROLE_REQ,
  employeeId,
  role,
});

export const inviteEmployee = payload => ({
  type: T.INVITE_EMPLOYEE_REQUEST,
  payload, // { to, message }
});

export const clearInviteState = () => ({ type: T.INVITE_EMPLOYEE_CLEAR });

export const fetchEmployeeAttendanceCalendar = payload => ({
  type: T.FETCH_EMP_ATT_CAL_REQ,
  payload, // { employeeId, from, to }
});

export const fetchEmployeeLeaveQuota = employeeId => ({
  type: T.FETCH_EMP_LEAVE_QUOTA_REQ,
  employeeId,
});
