// Employee Profile Action Types
export const FETCH_EMPLOYEE_PROFILE_REQUEST = 'EMPLOYEE_PROFILE/FETCH_REQUEST';
export const FETCH_EMPLOYEE_PROFILE_SUCCESS = 'EMPLOYEE_PROFILE/FETCH_SUCCESS';
export const FETCH_EMPLOYEE_PROFILE_FAILURE = 'EMPLOYEE_PROFILE/FETCH_FAILURE';
export const UPDATE_EMPLOYEE_PROFILE_REQUEST =
  'EMPLOYEE_PROFILE/UPDATE_REQUEST';
export const UPDATE_EMPLOYEE_PROFILE_SUCCESS =
  'EMPLOYEE_PROFILE/UPDATE_SUCCESS';
export const UPDATE_EMPLOYEE_PROFILE_FAILURE =
  'EMPLOYEE_PROFILE/UPDATE_FAILURE';
export const CLEAR_EMPLOYEE_PROFILE = 'EMPLOYEE_PROFILE/CLEAR';

// Action Creators
export const fetchEmployeeProfileRequest = () => ({
  type: FETCH_EMPLOYEE_PROFILE_REQUEST,
});

export const fetchEmployeeProfileSuccess = profile => ({
  type: FETCH_EMPLOYEE_PROFILE_SUCCESS,
  payload: profile,
});

console.log('fetchEmployeeProfileSuccess', fetchEmployeeProfileSuccess());

export const fetchEmployeeProfileFailure = error => ({
  type: FETCH_EMPLOYEE_PROFILE_FAILURE,
  payload: error,
});

export const updateEmployeeProfileRequest = profileData => ({
  type: UPDATE_EMPLOYEE_PROFILE_REQUEST,
  payload: profileData,
});

export const updateEmployeeProfileSuccess = profile => ({
  type: UPDATE_EMPLOYEE_PROFILE_SUCCESS,
  payload: profile,
});

export const updateEmployeeProfileFailure = error => ({
  type: UPDATE_EMPLOYEE_PROFILE_FAILURE,
  payload: error,
});

export const clearEmployeeProfile = () => ({
  type: CLEAR_EMPLOYEE_PROFILE,
});
