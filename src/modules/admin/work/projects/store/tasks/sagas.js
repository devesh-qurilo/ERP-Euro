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

console.log('[SAGA] tasks/sagas file loaded');

function* fetchTasksWorker({ projectId }) {
  console.log('[SAGA] TASKS_FETCH received with projectId:', projectId);
  try {
    yield put(setTasksBusy(true));
    const data = yield call(adminProjectTasksAPI.listByProject, projectId);
    console.log('[SAGA] listByProject OK:', {
      projectId,
      count: (data || []).length,
    });
    yield put(setTasks(projectId, data || []));
  } catch (err) {
    console.log('[SAGA] fetchTasksWorker error:', err);
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Failed to load tasks'));
  }
}

function* createTaskWorker({ payload }) {
  console.log('[SAGA] TASKS_CREATE', payload?.projectId);
  try {
    yield put(setTasksBusy(true));
    yield call(adminProjectTasksAPI.create, payload);
    yield put(fetchTasksByProject(payload.projectId));
  } catch (err) {
    console.log('[SAGA] createTaskWorker error:', err);
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Create task failed'));
  }
}

function* updateTaskWorker({ taskId, payload }) {
  console.log('[SAGA] TASKS_UPDATE', taskId, payload?.projectId);
  try {
    yield put(setTasksBusy(true));
    yield call(adminProjectTasksAPI.update, taskId, payload);
    if (payload.projectId) yield put(fetchTasksByProject(payload.projectId));
    else yield put(setTasksBusy(false));
  } catch (err) {
    console.log('[SAGA] updateTaskWorker error:', err);
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Update task failed'));
  }
}

function* deleteTaskWorker({ projectId, taskId }) {
  console.log('[SAGA] TASKS_DELETE', projectId, taskId);
  try {
    yield put(setTasksBusy(true));
    yield call(adminProjectTasksAPI.remove, { projectId, taskId });
    yield put(fetchTasksByProject(projectId));
  } catch (err) {
    console.log('[SAGA] deleteTaskWorker error:', err);
    yield put(setTasksBusy(false));
    yield put(setTasksError(err?.message || 'Delete task failed'));
  }
}

export function* adminProjectTasksWatcher() {
  console.log('[SAGA] adminProjectTasksWatcher ONLINE');
  yield takeLatest(TASKS_FETCH, fetchTasksWorker);
  yield takeLatest(TASKS_CREATE, createTaskWorker);
  yield takeLatest(TASKS_UPDATE, updateTaskWorker);
  yield takeLatest(TASKS_DELETE, deleteTaskWorker);
}
