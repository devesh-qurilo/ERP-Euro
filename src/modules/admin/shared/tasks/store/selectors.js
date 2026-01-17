const base = s => s.shared?.tasks || s.admin?.work?.tasks || s.employee?.tasks;

export const selectSource = s => base(s)?.source || { kind: 'all', id: null };
export const selectList = s => base(s)?.list || [];
export const selectBusy = s => !!base(s)?.busy;
export const selectError = s => base(s)?.error;
export const selectFilters = s => base(s)?.filters || {};
export const selectSearch = s => base(s)?.q || '';
export const selectView = s => base(s)?.view || 'list';
export const selectModal = s => base(s)?.modal || { visible: false };
export const selectTotal = s => base(s)?.total ?? 0;
export const selectMyTasks = s => base(s).myList;
