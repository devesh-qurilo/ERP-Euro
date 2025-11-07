import * as T from './types';

export const list = () => ({ type: T.LIST_REQUEST });
export const update = (id, payload) => ({
  type: T.UPDATE_REQUEST,
  payload: { id, payload },
});
export const remove = id => ({ type: T.DELETE_REQUEST, payload: { id } });
