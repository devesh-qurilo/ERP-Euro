import * as T from './types';

export const listByProject = projectId => ({
  type: T.LIST_BY_PROJECT_REQUEST,
  payload: { projectId },
});

export const openView = row => ({ type: T.VIEW_OPEN, payload: row });
export const closeView = () => ({ type: T.VIEW_CLOSE });

export const openEdit = row => ({ type: T.EDIT_OPEN, payload: row });
export const closeEdit = () => ({ type: T.EDIT_CLOSE });

export const updatePayment = (paymentId, payload, projectId) => ({
  type: T.UPDATE_REQUEST,
  payload: { paymentId, payload, projectId },
});

export const deletePayment = (paymentId, projectId) => ({
  type: T.DELETE_REQUEST,
  payload: { paymentId, projectId },
});

export const openCreate = (preset = {}) => ({
  type: T.CREATE_OPEN,
  payload: preset,
});
export const closeCreate = () => ({ type: T.CREATE_CLOSE });

export const createPayment = (payload, projectId) => ({
  type: T.CREATE_REQUEST,
  payload: { payload, projectId },
});
