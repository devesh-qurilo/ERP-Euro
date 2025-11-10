import * as T from './types';

export const setSource = source => ({ type: T.SET_SOURCE, source }); // {kind,id?}
export const setFilters = (filters = {}) => ({ type: T.SET_FILTERS, filters });
export const setSearch = (q = '') => ({ type: T.SET_SEARCH, q });
export const setView = view => ({ type: T.SET_VIEW, view });
export const setBusy = busy => ({ type: T.SET_BUSY, busy });
export const setModal = modal => ({ type: T.SET_MODAL, modal });

export const fetchTasks = params => ({ type: T.FETCH_REQ, params });
export const fetchOk = data => ({ type: T.FETCH_OK, data });
export const fetchFail = error => ({ type: T.FETCH_FAIL, error });

export const createTask = payload => ({ type: T.CREATE_REQ, payload });
export const createOk = created => ({ type: T.CREATE_OK, created });
export const createFail = error => ({ type: T.CREATE_FAIL, error });

export const updateTask = (taskId, payload) => ({
  type: T.UPDATE_REQ,
  taskId,
  payload,
});
export const updateOk = updated => ({ type: T.UPDATE_OK, updated });
export const updateFail = error => ({ type: T.UPDATE_FAIL, error });

export const deleteTask = taskId => ({ type: T.DELETE_REQ, taskId });
export const deleteOk = taskId => ({ type: T.DELETE_OK, taskId });
export const deleteFail = error => ({ type: T.DELETE_FAIL, error });

export const pinTask = taskId => ({ type: T.PIN_REQ, taskId });
export const pinOk = taskId => ({ type: T.PIN_OK, taskId });
export const pinFail = error => ({ type: T.PIN_FAIL, error });

export const unpinTask = taskId => ({ type: T.UNPIN_REQ, taskId });
export const unpinOk = taskId => ({ type: T.UNPIN_OK, taskId });
export const unpinFail = error => ({ type: T.UNPIN_FAIL, error });
