// src/modules/admin/hr/attendance/store/sagas.js
import { put, call, takeLatest, all } from 'redux-saga/effects';
import {
  ATT_FETCH_LIST,
  ATT_FETCH_LIST_SUCCESS,
  ATT_FETCH_LIST_ERROR,
  ATT_FETCH_MEMBER,
  ATT_FETCH_MEMBER_SUCCESS,
  ATT_FETCH_MEMBER_ERROR,
  ATT_MARK_DATES,
  ATT_MARK_MONTH,
  ATT_MARK_SUCCESS,
  ATT_MARK_ERROR,
  fetchAttList,
} from './actions';
import {
  //   apiGetAllAttendance,
  //   apiGetAttendanceByEmployee,
  //   apiMarkAttendanceByDates,
  //   apiMarkAttendanceByMonth,
  adminAttendanceAPI,
} from '../../../../../services/api';

function* fetchList() {
  try {
    const data = yield call(adminAttendanceAPI.listAll);
    yield put({ type: ATT_FETCH_LIST_SUCCESS, items: data || [] });
  } catch (e) {
    yield put({ type: ATT_FETCH_LIST_ERROR, error: e.message });
  }
}

function* fetchMember({ employeeId }) {
  try {
    const data = yield call(adminAttendanceAPI.byEmployee, employeeId);
    yield put({ type: ATT_FETCH_MEMBER_SUCCESS, items: data || [] });
  } catch (e) {
    yield put({ type: ATT_FETCH_MEMBER_ERROR, error: e.message });
  }
}

function* markByDates({ payload }) {
  try {
    yield call(adminAttendanceAPI.markByDates, payload);
    yield put({ type: ATT_MARK_SUCCESS });
    // refresh list after save
    yield put(fetchAttList());
  } catch (e) {
    yield put({ type: ATT_MARK_ERROR, error: e.message });
  }
}
function* markByMonth({ payload }) {
  try {
    yield call(adminAttendanceAPI.markByMonth, payload);
    yield put({ type: ATT_MARK_SUCCESS });
    yield put(fetchAttList());
  } catch (e) {
    yield put({ type: ATT_MARK_ERROR, error: e.message });
  }
}

export function* adminAttendanceWatcher() {
  yield all([
    takeLatest(ATT_FETCH_LIST, fetchList),
    takeLatest(ATT_FETCH_MEMBER, fetchMember),
    takeLatest(ATT_MARK_DATES, markByDates),
    takeLatest(ATT_MARK_MONTH, markByMonth),
  ]);
}
