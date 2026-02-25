import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  AdminmyTimesheetsAPI,
  AdminWeeklyTimesheetsAPI,
  AdminweeklyTimesheetsAPI,
} from '../../../../../services/api';
import * as T from './types';

function* fetchMine({ params }) {
  try {
    const data = yield call(AdminmyTimesheetsAPI.list, params || {});
    // console.log('debvvvvv', data);
    yield put({ type: T.FETCH_MY_TIMESHEETS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_MY_TIMESHEETS_FAILURE,
      error: e?.message || 'Failed to load',
    });
  }
}

function* createTimesheetSaga({ payload }) {
  // console.log('bhoooo', payload);
  try {
    const created = yield call(AdminmyTimesheetsAPI.create, payload);
    // console.log('bholuuuuuu', created);
    yield put({ type: T.CREATE_TIMESHEET_SUCCESS, payload: created });
    // optionally re-fetch full list (commented; we already prepend in reducer)
    const list = yield call(AdminmyTimesheetsAPI.list, {});
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
    const res = yield call(AdminweeklyTimesheetsAPI.create, payload);
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
    const data = yield call(AdminweeklyTimesheetsAPI.getMine, weekStartDate);
    // console.log('weeklllly', data);
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
    const res = yield call(AdminweeklyTimesheetsAPI.create, payload);
    // console.log('weekly res', res);
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
    const res = yield call(AdminweeklyTimesheetsAPI.getMine, weekStartDate);
    yield put({ type: T.GET_WEEKLY_TIMESHEET_SUCCESS, payload: res });
  } catch (e) {
    yield put({
      type: T.GET_WEEKLY_TIMESHEET_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

// function* VcreateWeeklySaga({ payload }) {
//   // console.log('rammm jii', payload);
//   try {
//     const res = yield call(AdminWeeklyTimesheetsAPI.create, payload);
//     // console.log('devesh bhaiii weekly chalegaa kyaa ', res);
//     yield put({
//       type: T.VCREATE_WEEKLY_TIMESHEET_SUCCESS,
//       payload: res,
//     });
//   } catch (e) {
//     // console.log('rammm error');
//     yield put({
//       type: T.VCREATE_WEEKLY_TIMESHEET_FAILURE,
//       error: e?.message || 'Create weekly timesheet failed',
//     });
//   }
// }

function* VcreateWeeklySaga({ payload }) {
  // console.log('weekly payload =>', payload);
  try {
    // console.log('weekly payload =>', JSON.stringify(payload));

    const res = yield call(AdminWeeklyTimesheetsAPI.create, payload);
    yield put({ type: T.FETCH_MY_TIMESHEETS_REQUEST });

    // console.log('weekly create success =>', res);

    yield put({
      type: T.VCREATE_WEEKLY_TIMESHEET_SUCCESS,
      payload: res,
    });
  } catch (e) {
    console.error('weekly create failed =>', e?.response?.data || e);

    yield put({
      type: T.VCREATE_WEEKLY_TIMESHEET_FAILURE,
      error:
        e?.response?.data?.message ||
        e?.message ||
        'Create weekly timesheet failed',
    });
  }
}

function* VgetWeeklySaga({ weekStartDate }) {
  try {
    const res = yield call(AdminWeeklyTimesheetsAPI.getMine, weekStartDate);
    yield put({
      type: T.VGET_WEEKLY_TIMESHEET_SUCCESS,
      payload: res,
    });
  } catch (e) {
    yield put({
      type: T.VGET_WEEKLY_TIMESHEET_FAILURE,
      error: e?.message || 'Fetch weekly timesheet failed',
    });
  }
}

function* deleteTimesheetSaga({ id }) {
  try {
    yield call(AdminmyTimesheetsAPI.remove, id);

    // 🔥 refresh list
    yield put({ type: T.FETCH_MY_TIMESHEETS_REQUEST });

    yield put({ type: T.DELETE_TIMESHEET_SUCCESS });
  } catch (e) {
    yield put({
      type: T.DELETE_TIMESHEET_FAILURE,
      error: e?.message || 'Delete failed',
    });
  }
}

export function* AdminTimesheetsWatcher() {
  yield all([
    takeLatest(T.FETCH_MY_TIMESHEETS_REQUEST, fetchMine),
    takeLatest(T.CREATE_TIMESHEET_REQUEST, createTimesheetSaga),
    takeLatest(T.CREATE_WEEKLY_TS_REQUEST, createWeekly),
    takeLatest(T.GET_WEEKLY_TS_REQUEST, getWeekly),

    takeLatest(T.CREATE_WEEKLY_TIMESHEET_REQUEST, createWeeklySaga),
    takeLatest(T.GET_WEEKLY_TIMESHEET_REQUEST, getWeeklySaga),
    takeLatest(T.VCREATE_WEEKLY_TIMESHEET_REQUEST, VcreateWeeklySaga),
    takeLatest(T.VGET_WEEKLY_TIMESHEET_REQUEST, VgetWeeklySaga),
    takeLatest(T.DELETE_TIMESHEET_REQUEST, deleteTimesheetSaga),
  ]);
}
