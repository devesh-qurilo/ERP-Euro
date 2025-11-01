import * as T from './types';

export const fetchDepartments = () => ({ type: T.FETCH_DEPT_REQ });

export const createDepartment = payload => ({
  type: T.CREATE_DEPT_REQ,
  payload,
});
export const updateDepartment = (id, payload) => ({
  type: T.UPDATE_DEPT_REQ,
  id,
  payload,
});
export const deleteDepartment = id => ({ type: T.DELETE_DEPT_REQ, id });

export const openDepartmentModal = (record = null) => ({
  type: T.OPEN_DEPT_MODAL,
  record,
});
export const closeDepartmentModal = () => ({ type: T.CLOSE_DEPT_MODAL });

export const setDepartmentsMode = mode => ({ type: T.SET_DEPT_MODE, mode });
