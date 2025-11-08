import * as T from './types';
export const list = (filters = {}) => ({
  type: T.LIST_REQUEST,
  payload: { filters },
});
export const create = payload => ({ type: T.CREATE_REQUEST, payload });
export const update = (id, payload) => ({
  type: T.UPDATE_REQUEST,
  payload: { id, ...payload },
});
export const remove = id => ({ type: T.DELETE_REQUEST, payload: { id } });
