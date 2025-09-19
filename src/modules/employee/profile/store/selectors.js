export const selectEmployeeProfile = state => state.employee.profile.profile;
export const selectEmployeeProfileLoading = state =>
  state.employee.profile.loading;
export const selectEmployeeProfileError = state => state.employee.profile.error;
export const selectEmployeeProfileUpdating = state =>
  state.employee.profile.updating;
