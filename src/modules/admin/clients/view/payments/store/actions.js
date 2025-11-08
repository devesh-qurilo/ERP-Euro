import * as T from './types';

export const listByClient = clientId => ({
  type: T.LIST_BY_CLIENT_REQUEST,
  payload: { clientId },
});

export const openView = row => ({ type: T.VIEW_OPEN, payload: row });
export const closeView = () => ({ type: T.VIEW_CLOSE });

export const openEdit = row => ({ type: T.EDIT_OPEN, payload: row });
export const closeEdit = () => ({ type: T.EDIT_CLOSE });

export const updatePayment = (paymentId, payload, clientId) => ({
  type: T.UPDATE_REQUEST,
  payload: { paymentId, payload, clientId },
});

export const deletePayment = (paymentId, clientId) => ({
  type: T.DELETE_REQUEST,
  payload: { paymentId, clientId },
});
