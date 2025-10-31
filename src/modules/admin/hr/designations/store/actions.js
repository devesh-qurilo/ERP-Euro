import * as T from './types';

export const fetchDesignations = () => ({ type: T.FETCH_DESIG_REQ });

export const createDesignation = payload => ({
  type: T.CREATE_DESIG_REQ,
  payload,
});
export const updateDesignation = (id, payload) => ({
  type: T.UPDATE_DESIG_REQ,
  id,
  payload,
});
export const deleteDesignation = id => ({ type: T.DELETE_DESIG_REQ, id });

export const openDesignationModal = (record = null) => ({
  type: T.OPEN_MODAL,
  record,
});
export const closeDesignationModal = () => ({ type: T.CLOSE_MODAL });

export const setDesignationsMode = mode => ({ type: T.SET_MODE, mode });
