import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  myTimesheetsAPI,
  weeklyTimesheetsAPI,
} from '../../../../../services/api';
import * as T from './types';

function* fetchMine({ params }) {
  try {
    const data = yield call(myTimesheetsAPI.list, params || {});
    yield put({ type: T.FETCH_MY_TIMESHEETS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_MY_TIMESHEETS_FAILURE,
      error: e?.message || 'Failed to load',
    });
  }
}

function* createTimesheetSaga({ payload }) {
  try {
    const created = yield call(myTimesheetsAPI.create, payload);
    // console.log('bholuuuuuu', created);
    yield put({ type: T.CREATE_TIMESHEET_SUCCESS, payload: created });
    // optionally re-fetch full list (commented; we already prepend in reducer)
    const list = yield call(myTimesheetsAPI.list, {});
    yield put({ type: T.FETCH_MY_TIMESHEETS_SUCCESS, payload: list });
  } catch (e) {
    yield put({
      type: T.CREATE_TIMESHEET_FAILURE,
      error: e?.message || 'Failed to save',
    });
  }
}

function* createWeekly({ payload }) {
  try {
    const res = yield call(weeklyTimesheetsAPI.create, payload);
    yield put({ type: T.CREATE_WEEKLY_TS_SUCCESS, payload: res });
    // refresh list after create (optional)
    yield put({ type: T.FETCH_MY_TIMESHEETS_REQUEST });
  } catch (e) {
    yield put({
      type: T.CREATE_WEEKLY_TS_FAILURE,
      error: e?.message || 'Create failed',
    });
  }
}

function* getWeekly({ weekStartDate }) {
  try {
    const data = yield call(weeklyTimesheetsAPI.getMine, weekStartDate);
    yield put({ type: T.GET_WEEKLY_TS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.GET_WEEKLY_TS_FAILURE,
      error: e?.message || 'Fetch failed',
    });
  }
}

function* createWeeklySaga({ payload }) {
  try {
    const res = yield call(weeklyTimesheetsAPI.create, payload);
    yield put({ type: T.CREATE_WEEKLY_TIMESHEET_SUCCESS, payload: res });
  } catch (e) {
    yield put({
      type: T.CREATE_WEEKLY_TIMESHEET_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

// GET /weekly-timesheets/me?weekStartDate=YYYY-MM-DD
function* getWeeklySaga({ weekStartDate }) {
  try {
    const res = yield call(weeklyTimesheetsAPI.getMine, weekStartDate);
    yield put({ type: T.GET_WEEKLY_TIMESHEET_SUCCESS, payload: res });
  } catch (e) {
    yield put({
      type: T.GET_WEEKLY_TIMESHEET_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

export function* employeeTimesheetsWatcher() {
  yield all([
    takeLatest(T.FETCH_MY_TIMESHEETS_REQUEST, fetchMine),
    takeLatest(T.CREATE_TIMESHEET_REQUEST, createTimesheetSaga),
    takeLatest(T.CREATE_WEEKLY_TS_REQUEST, createWeekly),
    takeLatest(T.GET_WEEKLY_TS_REQUEST, getWeekly),

    takeLatest(T.CREATE_WEEKLY_TIMESHEET_REQUEST, createWeeklySaga),
    takeLatest(T.GET_WEEKLY_TIMESHEET_REQUEST, getWeeklySaga),
  ]);
}
