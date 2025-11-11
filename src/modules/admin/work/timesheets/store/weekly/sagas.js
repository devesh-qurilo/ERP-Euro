// src/modules/employee/works/timesheets/store/weekly/sagas.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as T from './types';
import { AdminweeklyTimesheetsAPI } from '../../../../../../services/api';

function* fetchWeeklySaga({ weekStartDate }) {
  try {
    const data = yield call(AdminweeklyTimesheetsAPI.getMine, weekStartDate);
    console.log('devvvvv', data);
    yield put({ type: T.FETCH_WEEKLY_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.FETCH_WEEKLY_FAILURE, error: e?.message });
  }
}
function* createWeeklySaga({ payload }) {
  try {
    yield call(AdminweeklyTimesheetsAPI.create, payload);
    yield put({ type: T.CREATE_WEEKLY_SUCCESS });
  } catch (e) {
    yield put({ type: T.CREATE_WEEKLY_FAILURE, error: e?.message });
  }
}
export function* AdminweeklyWatcher() {
  yield all([
    takeLatest(T.FETCH_WEEKLY_REQUEST, fetchWeeklySaga),
    takeLatest(T.CREATE_WEEKLY_REQUEST, createWeeklySaga),
  ]);
}
