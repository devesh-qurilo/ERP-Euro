import * as T from './types';

export const fetchPriorities = () => ({
  type: T.FETCH_REQ,
});

export const createPriority = payload => ({
  type: T.CREATE_REQ,
  payload,
});

export const updatePriority = (id, payload) => ({
  type: T.UPDATE_REQ,
  id,
  payload,
});

export const deletePriority = id => ({
  type: T.DELETE_REQ,
  id,
});

export const assignDealPriority = (dealId, priorityId, hasExisting) => ({
  type: T.ASSIGN_DEAL_PRIORITY_REQ,
  dealId,
  priorityId,
  hasExisting,
});

export const removeDealPriority = dealId => ({
  type: T.REMOVE_DEAL_PRIORITY_REQ,
  dealId,
});
