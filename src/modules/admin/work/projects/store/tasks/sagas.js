// src/modules/admin/work/projects/store/tasks/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { TASKS_FETCH, TASKS_CREATE, TASKS_UPDATE, TASKS_DELETE } from './types';
import {
  setTasksBusy,
  setTasksError,
  setTasks,
  fetchTasksByProject,
} from './actions';
import { adminProjectTasksAPI } from '../../../../../../services/api'; // adjust path if needed

function* fetchTasksWorker({ projectId }) {
  try {
    yield put(setTasksBusy(true));
    const data = yield call(adminProjectTasksAPI.listByProject, projectId);

    yield put(setTasks(projectId, data || []));
  } catch (err) {
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Failed to load tasks'));
  }
}

function* createTaskWorker({ payload }) {
  try {
    yield put(setTasksBusy(true));
    yield call(adminProjectTasksAPI.create, payload);
    yield put(fetchTasksByProject(payload.projectId));
  } catch (err) {
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Create task failed'));
  }
}

function* updateTaskWorker({ taskId, payload }) {
  try {
    yield put(setTasksBusy(true));
    yield call(adminProjectTasksAPI.update, taskId, payload);
    if (payload.projectId) yield put(fetchTasksByProject(payload.projectId));
    else yield put(setTasksBusy(false));
  } catch (err) {
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Update task failed'));
  }
}

function* deleteTaskWorker({ projectId, taskId }) {
  try {
    yield put(setTasksBusy(true));
    yield call(adminProjectTasksAPI.remove, { projectId, taskId });
    yield put(fetchTasksByProject(projectId));
  } catch (err) {
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Delete task failed'));
  }
}

export function* adminProjectTasksWatcher() {
  yield takeLatest(TASKS_FETCH, fetchTasksWorker);
  yield takeLatest(TASKS_CREATE, createTaskWorker);
  yield takeLatest(TASKS_UPDATE, updateTaskWorker);
  yield takeLatest(TASKS_DELETE, deleteTaskWorker);
}
