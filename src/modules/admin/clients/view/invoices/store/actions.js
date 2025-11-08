import * as T from './types';

export const listByClient = clientId => ({
  type: T.LIST_BY_CLIENT_REQUEST,
  payload: { clientId },
});
