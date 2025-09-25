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

export const selectCreateECLoading = s =>
  s.employee?.settings?.emergencyContacts?.creating || false;
export const selectCreateECError = s =>
  s.employee?.settings?.emergencyContacts?.createError || null;

export const selectEmergencyContacts = s =>
  s.employee?.settings?.emergencyContacts?.data || [];
export const selectEmergencyContactsLoading = s =>
  s.employee?.settings?.emergencyContacts?.loading || false;
export const selectEmergencyContactsError = s =>
  s.employee?.settings?.emergencyContacts?.error || null;
