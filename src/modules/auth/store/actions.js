// Authentication Actions
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE';
export const LOGOUT = 'AUTH/LOGOUT';
export const RESET_AUTH_ERROR = 'AUTH/RESET_ERROR';
export const SET_USER_TYPE = 'AUTH/SET_USER_TYPE';

export const loginRequest = credentials => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const loginSuccess = userData => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const resetAuthError = () => ({
  type: RESET_AUTH_ERROR,
});

export const setUserType = userType => ({
  type: SET_USER_TYPE,
  payload: userType,
});
