import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import * as A from './actions';
import { adminTasksAPI } from '../../../../../services/api';

const selectParams = state => {
  const s = state.admin?.work?.tasks;
  const { page, size, q, filters } = s || {};
  return { page, size, q, ...filters };
};

function* fetchWorker({ params }) {
  try {
    yield put(A.setBusy(true));
    const _ = params || (yield select(selectParams)); // future use
    const data = yield call(adminTasksAPI.listAll);
    yield put(A.fetchSuccess(data));
  } catch (err) {
    yield put(A.fetchFailure(err?.message || 'Failed to load tasks'));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* createWorker({ payload }) {
  try {
    yield put(A.setBusy(true));
    const created = yield call(adminTasksAPI.create, payload);
    yield put(A.createSuccess(created));
    yield put(A.setModal({ visible: false, record: null }));
  } catch (err) {
    yield put(A.createFailure(err?.message || 'Create failed'));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* updateWorker({ taskId, payload }) {
  try {
    yield put(A.setBusy(true));
    const updated = yield call(adminTasksAPI.update, taskId, payload);
    yield put(A.updateSuccess(updated));
    yield put(A.setModal({ visible: false, record: null }));
  } catch (err) {
    yield put(A.updateFailure(err?.message || 'Update failed'));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* deleteWorker({ taskId }) {
  try {
    yield put(A.setBusy(true));
    yield call(adminTasksAPI.remove, taskId);
    yield put(A.deleteSuccess(taskId));
  } catch (err) {
    yield put(A.deleteFailure(err?.message || 'Delete failed'));
  } finally {
    yield put(A.setBusy(false));
  }
}

function* pinWorker({ taskId }) {
  try {
    yield call(adminTasksAPI.pin, taskId);
    yield put(A.pinSuccess(taskId));
  } catch (err) {
    yield put(A.pinFailure(err?.message || 'Pin failed'));
  }
}

function* unpinWorker({ taskId }) {
  try {
    yield call(adminTasksAPI.unpin, taskId);
    yield put(A.unpinSuccess(taskId));
  } catch (err) {
    yield put(A.unpinFailure(err?.message || 'Unpin failed'));
  }
}

export function* adminTasksWatcher() {
  yield takeLatest(T.FETCH_REQUEST, fetchWorker);
  yield takeLatest(T.CREATE_REQUEST, createWorker);
  yield takeLatest(T.UPDATE_REQUEST, updateWorker);
  yield takeLatest(T.DELETE_REQUEST, deleteWorker);
  yield takeLatest(T.PIN_REQUEST, pinWorker);
  yield takeLatest(T.UNPIN_REQUEST, unpinWorker);
}

export default adminTasksWatcher;
