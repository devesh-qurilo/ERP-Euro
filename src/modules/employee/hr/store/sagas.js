// src/modules/employee/hr/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { attendanceAPI, hrAPI } from '../../../../services/api';
import {
  FETCH_MY_LEAVES_REQUEST,
  FETCH_MY_LEAVES_SUCCESS,
  FETCH_MY_LEAVES_FAILURE,
  APPLY_LEAVE_REQUEST,
  APPLY_LEAVE_SUCCESS,
  APPLY_LEAVE_FAILURE,
  FETCH_MY_ATTENDANCE_REQUEST,
  FETCH_MY_ATTENDANCE_SUCCESS,
  FETCH_MY_ATTENDANCE_FAILURE,
  FETCH_APPRECIATIONS_REQUEST,
  FETCH_APPRECIATIONS_SUCCESS,
  FETCH_APPRECIATIONS_FAILURE,
  FETCH_HOLIDAYS_REQUEST,
  FETCH_HOLIDAYS_SUCCESS,
  FETCH_HOLIDAYS_FAILURE,
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

function* applyLeaveSaga(action) {
  try {
    const { leaveData, documents = [] } = action.payload || {};
    const fd = new FormData();
    fd.append('leaveData', JSON.stringify(leaveData));
    (documents || []).forEach((file, i) => {
      // DocumentPicker file shape: { uri, name, type, size }
      fd.append('documents', {
        uri: file.uri,
        name: file.name || `document-${i + 1}`,
        type: file.type || 'application/octet-stream',
      });
    });

    const created = yield call(hrAPI.applyLeave, fd);
    yield put({ type: APPLY_LEAVE_SUCCESS, payload: created });

    // refresh list after creating
    yield put({ type: FETCH_MY_LEAVES_REQUEST });
  } catch (err) {
    yield put({
      type: APPLY_LEAVE_FAILURE,
      error: err?.message || 'Failed to apply leave',
    });
  }
}

function* fetchMyAttendanceSaga() {
  try {
    const data = yield call(attendanceAPI.getMyAttendance);
    yield put({ type: FETCH_MY_ATTENDANCE_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_MY_ATTENDANCE_FAILURE,
      error: err?.message || 'Failed to load attendance',
    });
  }
}

function* fetchAppreciationsSaga() {
  try {
    const data = yield call(hrAPI.getAppreciations);
    yield put({ type: FETCH_APPRECIATIONS_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_APPRECIATIONS_FAILURE,
      error: err?.message || 'Failed to load appreciations',
    });
  }
}

function* fetchHolidaysSaga() {
  try {
    const data = yield call(hrAPI.getHolidays);
    yield put({ type: FETCH_HOLIDAYS_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_HOLIDAYS_FAILURE,
      error: err?.message || 'Failed to load holidays',
    });
  }
}

export function* employeeHRWatcher() {
  yield all([
    takeLatest(FETCH_MY_LEAVES_REQUEST, fetchMyLeavesSaga),
    takeLatest(APPLY_LEAVE_REQUEST, applyLeaveSaga),

    takeLatest(FETCH_MY_ATTENDANCE_REQUEST, fetchMyAttendanceSaga),

    takeLatest(FETCH_APPRECIATIONS_REQUEST, fetchAppreciationsSaga),
    takeLatest(FETCH_HOLIDAYS_REQUEST, fetchHolidaysSaga),
  ]);
}
