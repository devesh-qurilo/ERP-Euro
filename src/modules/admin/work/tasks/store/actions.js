import * as T from './types';

export const setBusy = busy => ({ type: T.SET_BUSY, busy });
export const setFilters = (filters = {}) => ({ type: T.SET_FILTERS, filters });
export const setSearch = (q = '') => ({ type: T.SET_SEARCH, q });
export const setPagination = (page = 0, size = 20) => ({
  type: T.SET_PAGINATION,
  page,
  size,
});
export const setViewMode = (view = 'list') => ({ type: T.SET_VIEW_MODE, view });
export const setModal = modal => ({ type: T.SET_MODAL, modal });

export const fetchTasks = params => ({ type: T.FETCH_REQUEST, params });
export const fetchSuccess = data => ({ type: T.FETCH_SUCCESS, data });
export const fetchFailure = error => ({ type: T.FETCH_FAILURE, error });

export const createTask = payload => ({ type: T.CREATE_REQUEST, payload });
export const createSuccess = created => ({ type: T.CREATE_SUCCESS, created });
export const createFailure = error => ({ type: T.CREATE_FAILURE, error });

export const updateTask = (taskId, payload) => ({
  type: T.UPDATE_REQUEST,
  taskId,
  payload,
});
export const updateSuccess = updated => ({ type: T.UPDATE_SUCCESS, updated });
export const updateFailure = error => ({ type: T.UPDATE_FAILURE, error });

export const deleteTask = taskId => ({ type: T.DELETE_REQUEST, taskId });
export const deleteSuccess = taskId => ({ type: T.DELETE_SUCCESS, taskId });
export const deleteFailure = error => ({ type: T.DELETE_FAILURE, error });

export const pinTask = taskId => ({ type: T.PIN_REQUEST, taskId });
export const pinSuccess = taskId => ({ type: T.PIN_SUCCESS, taskId });
export const pinFailure = error => ({ type: T.PIN_FAILURE, error });

export const unpinTask = taskId => ({ type: T.UNPIN_REQUEST, taskId });
export const unpinSuccess = taskId => ({ type: T.UNPIN_SUCCESS, taskId });
export const unpinFailure = error => ({ type: T.UNPIN_FAILURE, error });

export const setScope = (scope /* 'all' | 'my' */) => ({
  type: T.SET_SCOPE,
  scope,
});
