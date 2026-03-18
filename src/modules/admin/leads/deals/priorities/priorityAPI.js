import api from '../../../../../services/api';

export const priorityAPI = {
  list: () => api.get('/deals/admin/priorities').then(r => r.data),

  create: payload =>
    api.post('/deals/admin/priorities', payload).then(r => r.data),

  update: (id, payload) =>
    api.put(`/deals/admin/priorities/${id}`, payload).then(r => r.data),

  remove: id => api.delete(`/deals/admin/priorities/${id}`).then(r => r.data),

  // 🔥 NEW (deal priority)
  assignToDeal: (dealId, priorityId) =>
    api.post(`/deals/${dealId}/priority/assign`, { priorityId }),

  updateDealPriority: (dealId, priorityId) =>
    api.put(`/deals/${dealId}/priority`, { priorityId }),

  deleteFromDeal: dealId => api.delete(`/deals/${dealId}/priority`),
};
