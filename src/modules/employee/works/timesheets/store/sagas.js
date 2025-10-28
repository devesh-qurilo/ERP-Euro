import { call, put, takeLatest } from 'redux-saga/effects';
import { myTimesheetsAPI } from '../../../../../services/api';
import {
  FETCH_MY_TIMESHEETS_REQUEST,
  FETCH_MY_TIMESHEETS_SUCCESS,
  FETCH_MY_TIMESHEETS_FAILURE,
} from './types';

function* fetchMineSaga({ params }) {
  try {
    const data = yield call(myTimesheetsAPI.listMine, params || {});
    // Optional: sort newest first
    data.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
    yield put({ type: FETCH_MY_TIMESHEETS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: FETCH_MY_TIMESHEETS_FAILURE,
      error: e?.message || 'Failed to load',
    });
  }
}

export function* employeeTimesheetsWatcher() {
  yield takeLatest(FETCH_MY_TIMESHEETS_REQUEST, fetchMineSaga);
}
