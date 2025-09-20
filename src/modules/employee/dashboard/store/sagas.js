// src/modules/employee/dashboard/store/sagas.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { leavesAPI, appreciationsAPI } from '../../../../services/api';
import {
  FETCH_LEAVE_QUOTA_REQUEST,
  FETCH_LEAVE_QUOTA_SUCCESS,
  FETCH_LEAVE_QUOTA_FAILURE,

  // appreciation
  FETCH_APPRECIATIONS_REQUEST,
  FETCH_APPRECIATIONS_SUCCESS,
  FETCH_APPRECIATIONS_FAILURE,
} from './actions';

function* fetchLeaveQuotaSaga() {
  try {
    const data = yield call(leavesAPI.getMyQuota); // GET /employee/leave-quota/me
    yield put({ type: FETCH_LEAVE_QUOTA_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_LEAVE_QUOTA_FAILURE,
      error: err?.message || 'Failed to load leave quota',
    });
  }
}

// --- appreciations (new) ---
function* fetchAppreciationsSaga() {
  try {
    const data = yield call(appreciationsAPI.getAllappreciation);
    yield put({ type: FETCH_APPRECIATIONS_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_APPRECIATIONS_FAILURE,
      error: err?.message || 'Failed to load appreciations',
    });
  }
}

export function* employeeDashboardWatcher() {
  yield all([
    takeLatest(FETCH_LEAVE_QUOTA_REQUEST, fetchLeaveQuotaSaga),
    takeLatest(FETCH_APPRECIATIONS_REQUEST, fetchAppreciationsSaga),
  ]);
}
