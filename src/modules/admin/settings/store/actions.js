import * as T from './types';

// Profile
export const adminProfileUpdateRequest = payload => ({
  type: T.ADMIN_PROFILE_UPDATE_REQUEST,
  payload,
});
export const adminProfileUpdateSuccess = payload => ({
  type: T.ADMIN_PROFILE_UPDATE_SUCCESS,
  payload,
});
export const adminProfileUpdateFailure = error => ({
  type: T.ADMIN_PROFILE_UPDATE_FAILURE,
  error,
});

// Company
export const adminCompanyFetchRequest = () => ({
  type: T.ADMIN_COMPANY_FETCH_REQUEST,
});
export const adminCompanyFetchSuccess = payload => ({
  type: T.ADMIN_COMPANY_FETCH_SUCCESS,
  payload,
});
export const adminCompanyFetchFailure = error => ({
  type: T.ADMIN_COMPANY_FETCH_FAILURE,
  error,
});

export const adminCompanySaveRequest = payload => ({
  type: T.ADMIN_COMPANY_SAVE_REQUEST,
  payload,
});
export const adminCompanySaveSuccess = payload => ({
  type: T.ADMIN_COMPANY_SAVE_SUCCESS,
  payload,
});
export const adminCompanySaveFailure = error => ({
  type: T.ADMIN_COMPANY_SAVE_FAILURE,
  error,
});
