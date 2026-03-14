import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { AdminleavesAPI as leavesAPI } from '../../../../../services/api';
import { fetchEmployeeLeaves } from '../../employees/store/actions';

function* fetchLeaves() {
  try {
    const data = yield call(leavesAPI.list);
    yield put({ type: T.FETCH_LEAVES_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.FETCH_LEAVES_FAILURE, error: e?.message || 'Failed' });
  }
}

function* fetchQuota() {
  try {
    const data = yield call(leavesAPI.myQuota);
    yield put({ type: T.FETCH_QUOTA_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.FETCH_QUOTA_FAILURE, error: e?.message || 'Failed' });
  }
}

function* applyLeaves({ payload }) {
  try {
    // console.log('leaves', payload);
    const created = yield call(leavesAPI.apply, payload);
    yield put({ type: T.APPLY_LEAVES_SUCCESS, payload: created });
    // yield put(fetchEmployeeLeaves());
  } catch (e) {
    yield put({ type: T.APPLY_LEAVES_FAILURE, error: e?.message || 'Failed' });
  }
}

function* patchStatus({ leaveId, payload }) {
  try {
    const updated = yield call(leavesAPI.patchStatus, leaveId, payload);
    yield put({ type: T.PATCH_STATUS_SUCCESS, payload: updated });
  } catch (e) {
    yield put({
      type: T.PATCH_STATUS_FAILURE,
      leaveId,
      error: e?.message || 'Failed',
    });
  }
}

function* deleteLeave({ leaveId }) {
  try {
    yield call(leavesAPI.remove, leaveId);
    yield put({ type: T.DELETE_LEAVE_SUCCESS, leaveId });
  } catch (e) {
    yield put({
      type: T.DELETE_LEAVE_FAILURE,
      leaveId,
      error: e?.message || 'Failed',
    });
  }
}

export function* adminLeavesWatcher() {
  yield all([
    takeLatest(T.FETCH_LEAVES_REQUEST, fetchLeaves),
    takeLatest(T.FETCH_QUOTA_REQUEST, fetchQuota),
    takeLatest(T.APPLY_LEAVES_REQUEST, applyLeaves),
    takeLatest(T.PATCH_STATUS_REQUEST, patchStatus),
    takeLatest(T.DELETE_LEAVE_REQUEST, deleteLeave),
  ]);
}
