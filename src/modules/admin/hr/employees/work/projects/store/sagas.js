import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { projectsApi } from '../../../../../../../services/api';

function* fetchList({ employeeId }) {
  try {
    const data = yield call(projectsApi.listByEmployee, employeeId);
    yield put({ type: T.EMP_PROJ_FETCH_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.EMP_PROJ_FETCH_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

function* createOne({ payload, employeeIdForRefresh }) {
  try {
    yield call(projectsApi.create, payload);
    yield put({ type: T.EMP_PROJ_CREATE_SUCCESS, projectId: 'GLOBAL' });
    if (employeeIdForRefresh)
      yield put({
        type: T.EMP_PROJ_FETCH_REQUEST,
        employeeId: employeeIdForRefresh,
      });
    yield put({ type: T.EMP_PROJ_CLOSE_MODAL });
  } catch (e) {
    yield put({
      type: T.EMP_PROJ_CREATE_FAILURE,
      error: e?.message || 'Failed',
      projectId: 'GLOBAL',
    });
  }
}

function* updateOne({ projectId, payload, employeeIdForRefresh }) {
  try {
    yield call(projectsApi.update, projectId, payload);
    yield put({ type: T.EMP_PROJ_UPDATE_SUCCESS, projectId });
    if (employeeIdForRefresh)
      yield put({
        type: T.EMP_PROJ_FETCH_REQUEST,
        employeeId: employeeIdForRefresh,
      });
    yield put({ type: T.EMP_PROJ_CLOSE_MODAL });
  } catch (e) {
    yield put({
      type: T.EMP_PROJ_UPDATE_FAILURE,
      error: e?.message || 'Failed',
      projectId,
    });
  }
}

function* removeOne({ projectId, employeeIdForRefresh }) {
  try {
    yield call(projectsApi.remove, projectId);
    yield put({ type: T.EMP_PROJ_DELETE_SUCCESS, projectId });
    if (employeeIdForRefresh)
      yield put({
        type: T.EMP_PROJ_FETCH_REQUEST,
        employeeId: employeeIdForRefresh,
      });
  } catch (e) {
    yield put({
      type: T.EMP_PROJ_DELETE_FAILURE,
      error: e?.message || 'Failed',
      projectId,
    });
  }
}

function* patchStatus({ projectId, status, employeeIdForRefresh }) {
  try {
    yield call(projectsApi.patchStatus, projectId, status);
    yield put({ type: T.EMP_PROJ_STATUS_SUCCESS, projectId });
    if (employeeIdForRefresh)
      yield put({
        type: T.EMP_PROJ_FETCH_REQUEST,
        employeeId: employeeIdForRefresh,
      });
  } catch (e) {
    yield put({
      type: T.EMP_PROJ_STATUS_FAILURE,
      error: e?.message || 'Failed',
      projectId,
    });
  }
}

export function* empProjectsWatcher() {
  yield all([
    takeLatest(T.EMP_PROJ_FETCH_REQUEST, fetchList),
    takeLatest(T.EMP_PROJ_CREATE_REQUEST, createOne),
    takeLatest(T.EMP_PROJ_UPDATE_REQUEST, updateOne),
    takeLatest(T.EMP_PROJ_DELETE_REQUEST, removeOne),
    takeLatest(T.EMP_PROJ_STATUS_REQUEST, patchStatus),
  ]);
}
