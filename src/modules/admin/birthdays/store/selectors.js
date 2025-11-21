// src/modules/admin/birthdays/store/selectors.js
export const selectBirthdaysState = state => state.admin?.birthdays || {};
export const selectBirthdaysLoading = state =>
  selectBirthdaysState(state).loading;
export const selectBirthdaysError = state => selectBirthdaysState(state).error;
export const selectBirthdays = state =>
  selectBirthdaysState(state).birthdays || [];
