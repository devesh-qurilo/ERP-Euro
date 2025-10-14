// src/modules/employee/works/projects/store/sagas.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { projectsAPI } from '../../../../../services/api';
import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
} from './actions';

function* fetchProjectsSaga(action) {
  try {
    // you can pass filters via action.params (category/status/client/etc)
    const data = yield call(
      projectsAPI.getProjects,
      0,
      50,
      action.params || {},
    );
    // optional: newest first by createdAt
    data.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
    yield put({ type: FETCH_PROJECTS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: FETCH_PROJECTS_FAILURE,
      error: e?.message || 'Failed to load projects',
    });
  }
}

export function* employeeProjectsWatcher() {
  yield all([takeLatest(FETCH_PROJECTS_REQUEST, fetchProjectsSaga)]);
}
