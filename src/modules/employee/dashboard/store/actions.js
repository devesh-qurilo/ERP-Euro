export const FETCH_EMPLOYEE_PROFILE_REQUEST = 'EMPLOYEE/FETCH_PROFILE_REQUEST';
export const FETCH_EMPLOYEE_PROFILE_SUCCESS = 'EMPLOYEE/FETCH_PROFILE_SUCCESS';
export const FETCH_EMPLOYEE_PROFILE_FAILURE = 'EMPLOYEE/FETCH_PROFILE_FAILURE';

export const fetchEmployeeProfileRequest = employeeId => ({
  type: FETCH_EMPLOYEE_PROFILE_REQUEST,
  payload: employeeId,
});

export const fetchEmployeeProfileSuccess = employee => ({
  type: FETCH_EMPLOYEE_PROFILE_SUCCESS,
  payload: employee,
});

export const fetchEmployeeProfileFailure = error => ({
  type: FETCH_EMPLOYEE_PROFILE_FAILURE,
  payload: error,
});
