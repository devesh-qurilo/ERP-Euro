// src/modules/admin/hr/attendance/store/selectors.js
const root = s => s.admin?.hr?.attendance || {};

export const selectAttList = s => root(s).list || [];
export const selectAttLoading = s => !!root(s).loading;
export const selectAttError = s => root(s).error;

export const selectAttMember = s => root(s).member || [];
export const selectAttMemberLoading = s => !!root(s).memberLoading;

export const selectAttModalOpen = s => !!root(s).modalOpen;
export const selectAttSaving = s => !!root(s).saving;

export const selectAttFilters = s =>
  root(s).filters || { q: '', month: '', year: '' };
export const selectAttMode = s => root(s).mode || 'list';
