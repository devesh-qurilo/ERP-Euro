// src/modules/employee/settings/store/selectors.js
export const selectMe = s => s.employee?.settings?.profile?.data || null;
export const selectMeLoading = s =>
  s.employee?.settings?.profile?.loading || false;
export const selectMeError = s => s.employee?.settings?.profile?.error || null;

export const selectUpdateLoading = s =>
  s.employee?.settings?.update?.loading || false;
export const selectUpdateError = s =>
  s.employee?.settings?.update?.error || null;
export const selectLastSavedAt = s =>
  s.employee?.settings?.update?.lastSavedAt || null;
