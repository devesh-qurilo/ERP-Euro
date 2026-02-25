import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import * as A from './actions';
import {
  adminTasksAPI, // /api/projects/tasks/getAll
  myTasksAPI, // /me/tasks
  adminProjectTasksAPI, // /projects/{id}/tasks
} from '../../../../../services/api';

const pickAPI = source => {
  if (!source) return { fn: adminTasksAPI.listAll };
  const { kind, id } = source;
  switch (kind) {
    case 'my':
      return { fn: myTasksAPI.list };
    case 'project':
      return { fn: () => adminProjectTasksAPI.listByProject(id) };
    case 'all':
    default:
      return { fn: adminTasksAPI.listAll };
  }
};

function* fetchWorker({ params }) {
  try {
    yield put(A.setBusy(true));
    const state = yield select(s => s);
    const source = state?.shared?.tasks?.source ||
      state?.admin?.work?.tasks?.source || { kind: 'all' };
    const { fn } = pickAPI(source);
    const data = yield call(fn);
    yield put(A.fetchOk(data));
  } catch (err) {
    yield put(A.fetchFail(err?.message || 'Failed to load tasks'));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* createWorker({ payload }) {
  try {
    // yield put(A.setBusy(true));
    const created = yield call(adminTasksAPI.create, payload);
    // console.log('create task ', created);
    yield put(A.createOk(created));
    yield put(A.setModal({ visible: false, record: null }));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* updateWorker({ taskId, payload }) {
  try {
    yield put(A.setBusy(true));
    const updated = yield call(adminTasksAPI.update, taskId, payload);
    yield put(A.updateOk(updated));
    yield put(A.setModal({ visible: false, record: null }));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* deleteWorker({ taskId }) {
  try {
    yield put(A.setBusy(true));
    yield call(adminTasksAPI.remove, taskId);
    yield put(A.deleteOk(taskId));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* pinWorker({ taskId }) {
  try {
    yield call(adminTasksAPI.pin, taskId);
    yield put(A.pinOk(taskId));
  } catch (err) {
    yield put(A.pinFail(err?.message || 'Pin failed'));
  }
}
function* unpinWorker({ taskId }) {
  try {
    yield call(adminTasksAPI.unpin, taskId);
    yield put(A.unpinOk(taskId));
  } catch (err) {
    yield put(A.unpinFail(err?.message || 'Unpin failed'));
  }
}

function* updateStageWorker({ taskId, stageId }) {
  try {
    yield call(adminTasksAPI.updateStatus, taskId, stageId);
    yield put(A.fetchTasks()); // refresh table
  } catch (e) {
    // console.log('Failed to update stage', e);
  }
}

function* fetchMyTasksSaga() {
  try {
    const data = yield call(myTasksAPI.list);
    yield put({ type: T.FETCH_MY_TASKS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_MY_TASKS_FAILURE,
      error: e?.message || 'Failed to load my tasks',
    });
  }
}

export function* tasksWatcher() {
  yield takeLatest(T.FETCH_REQ, fetchWorker);
  yield takeLatest(T.CREATE_REQ, createWorker);
  yield takeLatest(T.UPDATE_REQ, updateWorker);
  yield takeLatest(T.DELETE_REQ, deleteWorker);
  yield takeLatest(T.PIN_REQ, pinWorker);
  yield takeLatest(T.UNPIN_REQ, unpinWorker);
  yield takeLatest(T.TASK_STAGE_UPDATE_REQ, updateStageWorker);
  yield takeLatest(T.FETCH_MY_TASKS_REQUEST, fetchMyTasksSaga);
}

export default tasksWatcher;
