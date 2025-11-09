import * as T from './types';

export const listByClient = clientId => ({
  type: T.LIST_REQ,
  payload: { clientId },
});

export const createOne = (clientId, payload) => ({
  type: T.CREATE_REQ,
  payload: { clientId, payload },
});

export const updateOne = (clientId, noteId, payload) => ({
  type: T.UPDATE_REQ,
  payload: { clientId, noteId, payload },
});

export const deleteOne = (clientId, noteId) => ({
  type: T.DELETE_REQ,
  payload: { clientId, noteId },
});

export const openForm = (editing = null) => ({
  type: T.OPEN_FORM,
  payload: editing,
});
export const closeForm = () => ({ type: T.CLOSE_FORM });

export const openView = item => ({ type: T.OPEN_VIEW, payload: item });
export const closeView = () => ({ type: T.CLOSE_VIEW });
