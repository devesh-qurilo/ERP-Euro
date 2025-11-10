const base = root => root.admin?.work?.tasks;

export const selectBusy = root => !!base(root)?.busy;
export const selectError = root => base(root)?.error;
export const selectList = root => base(root)?.list || [];
export const selectFilters = root => base(root)?.filters || {};
export const selectSearch = root => base(root)?.q || '';
export const selectView = root => base(root)?.view || 'list';
export const selectPage = root => base(root)?.page ?? 0;
export const selectSize = root => base(root)?.size ?? 20;
export const selectTotal = root => base(root)?.total ?? 0;
export const selectModal = root => base(root)?.modal || { visible: false };
export const selectScope = root => base(root)?.scope || 'all';
