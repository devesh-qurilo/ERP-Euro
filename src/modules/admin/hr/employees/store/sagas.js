import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import {
  adminAttendanceAPI,
  adminEmployeesAPI as API,
} from '../../../../../services/api';
import { selectEmpPage, selectEmpSize } from './selectors';

function* fetchList({ opts }) {
  try {
    const page = opts?.page ?? (yield select(selectEmpPage));
    const size = opts?.size ?? (yield select(selectEmpSize));
    const data = yield call(API.list, { page, size });
    yield put({ type: T.FETCH_EMP_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_EMP_FAIL,
      error: e?.message || 'Failed to load employees',
    });
  }
}

function* createOne({ payload }) {
  try {
    yield call(API.create, payload);
    yield put({ type: T.CREATE_EMP_SUCCESS });
    yield put({ type: T.FETCH_EMP_REQ }); // refresh page
  } catch (e) {
    yield put({
      type: T.CREATE_EMP_FAIL,
      error: e?.message || 'Create failed',
    });
  }
}

function* updateOne({ employeeId, payload }) {
  try {
    const data = yield call(API.update, employeeId, payload);
    yield put({ type: T.UPDATE_EMP_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.UPDATE_EMP_FAIL,
      employeeId,
      error: e?.message || 'Update failed',
    });
  }
}

function* deleteOne({ employeeId }) {
  try {
    yield call(API.remove, employeeId);
    yield put({ type: T.DELETE_EMP_SUCCESS, employeeId });
  } catch (e) {
    yield put({
      type: T.DELETE_EMP_FAIL,
      employeeId,
      error: e?.message || 'Delete failed',
    });
  }
}

function* patchRole({ employeeId, role }) {
  try {
    const data = yield call(API.patchRole, employeeId, role);
    yield put({ type: T.PATCH_ROLE_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.PATCH_ROLE_FAIL,
      employeeId,
      error: e?.message || 'Role update failed',
    });
  }
}

function* inviteWorker({ payload }) {
  try {
    yield call(API.invite, payload); // { to, message }
    yield put({ type: T.INVITE_EMPLOYEE_SUCCESS });
  } catch (e) {
    yield put({
      type: T.INVITE_EMPLOYEE_FAILURE,
      error:
        e?.response?.data?.message || e?.message || 'Failed to send invite',
    });
  }
}

function* fetchEmployeeAttendanceCalendar({ payload }) {
  try {
    const { employeeId, from, to } = payload;

    const data = yield call(adminAttendanceAPI.calendar, employeeId, from, to);
    // backend object → array convert
    const items = Object.values(data || {});
    yield put({
      type: T.FETCH_EMP_ATT_CAL_SUCCESS,
      items,
    });
  } catch (e) {
    yield put({
      type: T.FETCH_EMP_ATT_CAL_FAIL,
      error: e?.message || 'Attendance fetch failed',
    });
  }
}

export function* adminEmployeesWatcher() {
  yield all([
    takeLatest(T.FETCH_EMP_REQ, fetchList),
    takeLatest(T.CREATE_EMP_REQ, createOne),
    takeLatest(T.UPDATE_EMP_REQ, updateOne),
    takeLatest(T.DELETE_EMP_REQ, deleteOne),
    takeLatest(T.PATCH_ROLE_REQ, patchRole),
    takeLatest(T.INVITE_EMPLOYEE_REQUEST, inviteWorker),
    takeLatest(T.FETCH_EMP_ATT_CAL_REQ, fetchEmployeeAttendanceCalendar),
  ]);
}
