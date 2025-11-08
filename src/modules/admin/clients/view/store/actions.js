import * as T from './types';
export const loadClient = id => ({ type: T.VIEW_REQUEST, payload: { id } });
