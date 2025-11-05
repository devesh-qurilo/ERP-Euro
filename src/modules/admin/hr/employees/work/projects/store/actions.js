import * as T from './types';

export const fetchEmpProjects = employeeId => ({
  type: T.EMP_PROJ_FETCH_REQUEST,
  employeeId,
});
export const openEmpProjModal = (editing = null) => ({
  type: T.EMP_PROJ_OPEN_MODAL,
  editing,
});
export const closeEmpProjModal = () => ({ type: T.EMP_PROJ_CLOSE_MODAL });

export const createEmpProject = (payload, employeeIdForRefresh) => ({
  type: T.EMP_PROJ_CREATE_REQUEST,
  payload,
  employeeIdForRefresh,
});
export const updateEmpProject = (projectId, payload, employeeIdForRefresh) => ({
  type: T.EMP_PROJ_UPDATE_REQUEST,
  projectId,
  payload,
  employeeIdForRefresh,
});
export const deleteEmpProject = (projectId, employeeIdForRefresh) => ({
  type: T.EMP_PROJ_DELETE_REQUEST,
  projectId,
  employeeIdForRefresh,
});
export const patchEmpProjectStatus = (
  projectId,
  status,
  employeeIdForRefresh,
) => ({
  type: T.EMP_PROJ_STATUS_REQUEST,
  projectId,
  status,
  employeeIdForRefresh,
});
