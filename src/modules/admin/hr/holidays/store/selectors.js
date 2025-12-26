const root = s => s.admin?.hr?.holidays || {};

export const selectHolidays = s => root(s).list || [];
export const selectHolidaysLoading = s => !!root(s).loading;
export const selectHolidaysError = s => root(s).error;
export const selectHolidayFilters = s =>
  root(s).filters || { q: '', start: '', end: '' };
export const selectHolidayModalOpen = s => !!root(s).modalOpen;
export const selectHolidayCreating = s => !!root(s).creating;
export const selectHolidayMode = s => root(s).mode || 'list';
export const selectEditingHoliday = s => root(s).editingHoliday || null;

// export const selectEditingHoliday = s =>
//   s.admin?.hr?.holidays?.editingHoliday || null;
