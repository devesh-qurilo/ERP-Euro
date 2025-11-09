import * as T from './types';

export const fetchList = (params = {}) => ({
  type: T.FETCH_LIST_REQUEST,
  params,
});
export const fetchOne = id => ({ type: T.FETCH_ONE_REQUEST, id });

export const createDeal = payload => ({ type: T.CREATE_REQUEST, payload });
export const updateDeal = (id, payload) => ({
  type: T.UPDATE_REQUEST,
  id,
  payload,
});
export const deleteDeal = id => ({ type: T.DELETE_REQUEST, id });

export const createFollowup = (dealId, payload) => ({
  type: T.FOLLOWUP_CREATE_REQUEST,
  dealId,
  payload,
});

export const setBusy = busy => ({ type: T.SET_BUSY, busy });
export const setParams = params => ({ type: T.SET_PARAMS, params });
export const setFormOpen = open => ({ type: T.SET_FORM_OPEN, open });
export const setEditing = deal => ({ type: T.SET_EDITING, deal });
export const setFollowupOpen = (open, dealId = null) => ({
  type: T.SET_FOLLOWUP_OPEN,
  open,
  dealId,
});
