import { call, put, takeEvery } from 'redux-saga/effects';
import {
  FETCH_EMPLOYEE_PROFILE_REQUEST,
  fetchEmployeeProfileSuccess,
  fetchEmployeeProfileFailure,
  UPDATE_EMPLOYEE_PROFILE_REQUEST,
  updateEmployeeProfileSuccess,
  updateEmployeeProfileFailure,
} from './action';
import { employeeAPI } from '../../../../services/api';

// export function* fetchEmployeeProfileSaga() {
//   try {
//     const profile = yield call(employeeAPI.getProfile);
//     // console.log('fetching profile.   bhaijaan', profile);
//     yield put(fetchEmployeeProfileSuccess(profile));
//   } catch (error) {
//     yield put(fetchEmployeeProfileFailure(error.message));
//   }
// }

export function* fetchEmployeeProfileSaga() {
  try {
    const profile = yield call(employeeAPI.getProfile);

    if (profile && profile.employeeId) {
      yield put(fetchEmployeeProfileSuccess(profile));
    } else {
      yield put(fetchEmployeeProfileFailure('Profile data missing'));
    }
  } catch (error) {
    console.error('Saga error while fetching profile:', error);

    // Axios-specific error handling
    if (error.response) {
      // Server responded with non-2xx
      yield put(
        fetchEmployeeProfileFailure(
          `Server error ${error.response.status}: ${
            error.response.data?.message || 'Something went wrong'
          }`,
        ),
      );
    } else if (error.request) {
      // Request made but no response
      yield put(
        fetchEmployeeProfileFailure(
          'No response from server. Please try again later.',
        ),
      );
    } else {
      // Something else
      yield put(fetchEmployeeProfileFailure(error.message));
    }
  }
}

function* updateEmployeeProfileSaga(action) {
  try {
    const updatedProfile = yield call(
      employeeAPI.updateProfile,
      action.payload,
    );
    yield put(updateEmployeeProfileSuccess(updatedProfile));
  } catch (error) {
    yield put(updateEmployeeProfileFailure(error.message));
  }
}

export function* employeeProfileSaga() {
  yield takeEvery(FETCH_EMPLOYEE_PROFILE_REQUEST, fetchEmployeeProfileSaga);
  yield takeEvery(UPDATE_EMPLOYEE_PROFILE_REQUEST, updateEmployeeProfileSaga);
}
