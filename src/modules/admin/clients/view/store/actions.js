import * as T from './types';
export const loadClient = id => ({ type: T.VIEW_REQUEST, payload: { id } });

export const loadClientStats = id => ({
  type: T.STATS_REQUEST,
  payload: { id },
});
