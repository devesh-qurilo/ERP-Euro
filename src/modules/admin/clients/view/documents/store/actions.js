import * as T from './types';

export const listByClient = clientId => ({
  type: T.LIST_BY_CLIENT_REQUEST,
  payload: { clientId },
});

export const uploadOne = (clientId, file) => ({
  type: T.UPLOAD_REQUEST,
  payload: { clientId, file },
});

export const deleteOne = (clientId, docId) => ({
  type: T.DELETE_REQUEST,
  payload: { clientId, docId },
});
