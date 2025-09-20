// src/modules/employee/dashboard/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { leavesAPI } from '../../../../services/api';
import {
  FETCH_LEAVE_QUOTA_REQUEST,
  FETCH_LEAVE_QUOTA_SUCCESS,
  FETCH_LEAVE_QUOTA_FAILURE,
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

export function* employeeDashboardWatcher() {
  yield takeLatest(FETCH_LEAVE_QUOTA_REQUEST, fetchLeaveQuotaSaga);
}
