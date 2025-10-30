// src/modules/admin/leads/store/actions.js
import * as T from './types';

export const fetchAdminLeads = params => ({
  type: T.FETCH_ADMIN_LEADS_REQUEST,
  params,
});
export const deleteAdminLead = id => ({
  type: T.DELETE_ADMIN_LEAD_REQUEST,
  id,
});
export const updateAdminLead = (id, payload) => ({
  type: T.UPDATE_LEAD_REQUEST,
  id,
  payload,
});
export const setAdminLeadsFilters = filters => ({
  type: T.SET_ADMIN_LEADS_FILTERS,
  filters,
});
