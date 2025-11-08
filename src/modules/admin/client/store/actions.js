import * as T from './types';

export const fetchClients = (params = {}) => ({
  type: T.FETCH_CLIENTS_REQUEST,
  params,
});
export const createClient = payload => ({
  type: T.CREATE_CLIENT_REQUEST,
  payload,
}); // {client, profilePicture?, companyLogo?}
export const updateClient = (id, payload) => ({
  type: T.UPDATE_CLIENT_REQUEST,
  id,
  payload,
});
export const deleteClient = id => ({ type: T.DELETE_CLIENT_REQUEST, id });

export const setClientQuery = query => ({ type: T.SET_CLIENT_QUERY, query });
export const setClientModal = (visible, mode = 'view') => ({
  type: T.SET_CLIENT_MODAL,
  visible,
  mode,
});
export const setSelectedClient = client => ({
  type: T.SET_SELECTED_CLIENT,
  client,
});
