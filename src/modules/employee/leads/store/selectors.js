export const selectLeads = s => s.employee?.leads?.list || [];
export const selectLeadsLoading = s => s.employee?.leads?.loading || false;
export const selectLeadsError = s => s.employee?.leads?.error || null;

export const selectLeadCreateLoading = s =>
  s.employee?.leads?.create?.loading || false;
export const selectLeadCreateError = s =>
  s.employee?.leads?.create?.error || null;
