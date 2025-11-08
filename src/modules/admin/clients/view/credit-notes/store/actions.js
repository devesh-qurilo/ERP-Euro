import * as T from './types';

export const listByClient = clientId => ({
  type: T.LIST_BY_CLIENT_REQUEST,
  payload: { clientId },
});
export const setFilters = filters => ({
  type: T.SET_FILTERS,
  payload: filters,
});

export const openView = item => ({ type: T.OPEN_VIEW, payload: item });
export const closeView = () => ({ type: T.CLOSE_VIEW });

export const openEdit = item => ({ type: T.OPEN_EDIT, payload: item });
export const closeEdit = () => ({ type: T.CLOSE_EDIT });

export const updateCreditNote = (id, payload, clientId) => ({
  type: T.UPDATE_REQUEST,
  payload: { id, payload, clientId },
});

export const deleteCreditNote = (id, clientId) => ({
  type: T.DELETE_REQUEST,
  payload: { id, clientId },
});
