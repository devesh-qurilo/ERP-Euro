// src/modules/employee/hr/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { hrAPI } from '../../../../services/api';
import {
  FETCH_MY_LEAVES_REQUEST,
  FETCH_MY_LEAVES_SUCCESS,
  FETCH_MY_LEAVES_FAILURE,
} from './actions';

function* fetchMyLeavesSaga() {
  try {
    const data = yield call(hrAPI.getMyLeaves);
    yield put({ type: FETCH_MY_LEAVES_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_MY_LEAVES_FAILURE,
      error: err?.message || 'Failed to load leaves',
    });
  }
}

export function* employeeHRWatcher() {
  yield takeLatest(FETCH_MY_LEAVES_REQUEST, fetchMyLeavesSaga);
}
