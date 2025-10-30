// src/modules/admin/leads/store/selectors.js
export const selectAdminLeads = s => s.admin?.leads?.list || [];
export const selectAdminLeadsLoading = s => s.admin?.leads?.loading;
export const selectAdminLeadsError = s => s.admin?.leads?.error;
export const selectAdminLeadsFilters = s => s.admin?.leads?.filters || {};
export const selectAdminLeadsBusyIds = s => s.admin?.leads?.busyIds || {};
