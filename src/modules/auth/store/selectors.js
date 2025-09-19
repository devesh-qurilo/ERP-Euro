export const selectAuthUser = state => state.auth.user;
export const selectAuthToken = state => state.auth.token;
export const selectRefreshToken = state => state.auth.refreshToken;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectUserRole = state => state.auth.userRole;
export const selectUserType = state => state.auth.userType;
