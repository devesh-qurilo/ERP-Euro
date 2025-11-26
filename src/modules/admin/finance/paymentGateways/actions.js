import * as T from './types';

export const list = () => ({ type: T.LIST_REQUEST });
export const create = payload => ({ type: T.CREATE_REQUEST, payload });
export const remove = id => ({ type: T.DELETE_REQUEST, payload: { id } });
