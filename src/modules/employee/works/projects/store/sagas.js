import { call, put, takeLatest, all } from 'redux-saga/effects';
import { projectsAPI } from '../../../../../services/api';
import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  TOGGLE_PIN_PROJECT_REQUEST,
  TOGGLE_PIN_PROJECT_SUCCESS,
  TOGGLE_PIN_PROJECT_FAILURE,
  FETCH_PROJECT_METRICS_REQUEST,
  FETCH_PROJECT_METRICS_SUCCESS,
  FETCH_PROJECT_METRICS_FAILURE,
  FETCH_PROJECT_TASKS_REQUEST,
  FETCH_PROJECT_TASKS_SUCCESS,
  FETCH_PROJECT_TASKS_FAILURE,
} from './actions';

function* fetchProjectsSaga(action) {
  try {
    const data = yield call(
      projectsAPI.getProjects,
      0,
      50,
      action.params || {},
    );
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

function* fetchTasksSaga({ projectId }) {
  try {
    const list = yield call(projectsAPI.getProjectTasks, projectId);
    yield put({ type: FETCH_PROJECT_TASKS_SUCCESS, projectId, payload: list });
  } catch (e) {
    yield put({
      type: FETCH_PROJECT_TASKS_FAILURE,
      projectId,
      error: e?.message || 'Failed to load tasks',
    });
  }
}

function* togglePinSaga({ projectId, desiredPinned, prevPinned }) {
  try {
    if (desiredPinned) {
      yield call(projectsAPI.pinProject, projectId);
    } else {
      yield call(projectsAPI.unpinProject, projectId);
    }
    yield put({ type: TOGGLE_PIN_PROJECT_SUCCESS, projectId, desiredPinned });
  } catch (e) {
    yield put({
      type: TOGGLE_PIN_PROJECT_FAILURE,
      projectId,
      prevPinned,
      error: e?.message || 'Failed to update pin',
    });
  }
}

function* fetchMetricsSaga({ projectId }) {
  try {
    const data = yield call(projectsAPI.getProjectMetrics, projectId);
    yield put({
      type: FETCH_PROJECT_METRICS_SUCCESS,
      projectId,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: FETCH_PROJECT_METRICS_FAILURE,
      projectId,
      error: e?.message || 'Failed to load metrics',
    });
  }
}

export function* employeeProjectsWatcher() {
  yield all([
    takeLatest(FETCH_PROJECTS_REQUEST, fetchProjectsSaga),
    takeLatest(TOGGLE_PIN_PROJECT_REQUEST, togglePinSaga),
    takeLatest(FETCH_PROJECT_METRICS_REQUEST, fetchMetricsSaga),
    takeLatest(FETCH_PROJECT_TASKS_REQUEST, fetchTasksSaga),
  ]);
}
