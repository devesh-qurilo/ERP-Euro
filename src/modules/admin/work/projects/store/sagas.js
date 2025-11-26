import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminWorkProjectsAPI } from '../../../../../services/api';

const emsg = e => e?.response?.data?.message || e?.message || 'Request failed';

function* fetchAll() {
  try {
    const list = yield call(adminWorkProjectsAPI.list);
    console.log('list', list);
    yield put({ type: T.AWP_SET_ALL, list });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  }
}

function* patchProgress({ id, percent }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.patchProgress, id, percent);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* createProject({ payload }) {
  try {
    yield put({ type: T.AWP_BUSY, id: 'create', on: true });
    console.log('clent project', payload);
    yield call(adminWorkProjectsAPI.create, payload);
    yield put({ type: T.AWP_CLOSE_MODAL });
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    console.error('AWP create failed:', e.response?.data || e.message);
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id: 'create', on: false });
  }
}

function* updateProject({ id, payload }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.update, id, payload);
    console.log('update project', payload);
    yield put({ type: T.AWP_CLOSE_MODAL });
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* deleteProject({ id }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.remove, id);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* patchStatus({ id, status }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.patchStatus, id, status);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* pin({ id }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.pin, id);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* unpin({ id }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.unpin, id);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* archive({ id }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.archive, id);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}

function* unarchive({ id }) {
  try {
    yield put({ type: T.AWP_BUSY, id, on: true });
    yield call(adminWorkProjectsAPI.unarchive, id);
    yield put({ type: T.AWP_FETCH_ALL });
  } catch (e) {
    yield put({ type: T.AWP_ERROR, error: emsg(e) });
  } finally {
    yield put({ type: T.AWP_BUSY, id, on: false });
  }
}
export const fetchMetrics = projectId => ({
  type: T.AWP_FETCH_METRICS,
  projectId,
});

export const setMetrics = (projectId, metrics) => ({
  type: T.AWP_SET_METRICS,
  projectId,
  metrics,
});

function* catListSaga() {
  try {
    const cats = yield call(adminWorkProjectsAPI.getProjectCategories);
    yield put({ type: T.AWP_CAT_SET, categories: cats });
  } catch (e) {
    yield put({ type: T.AWP_CAT_ERROR, error: emsg(e) });
  }
}

function* catCreateSaga({ payload }) {
  try {
    yield call(adminWorkProjectsAPI.createProjectCategory, payload);
    yield put({ type: T.AWP_CAT_CREATE_SUCCESS });
    // refresh
    yield put({ type: T.AWP_CAT_LIST });
  } catch (e) {
    yield put({ type: T.AWP_CAT_CREATE_FAILURE, error: emsg(e) });
  }
}

function* catDeleteSaga({ id }) {
  try {
    yield call(adminWorkProjectsAPI.deleteProjectCategory, id);
    yield put({ type: T.AWP_CAT_DELETE_SUCCESS });
    // refresh
    yield put({ type: T.AWP_CAT_LIST });
  } catch (e) {
    yield put({ type: T.AWP_CAT_DELETE_FAILURE, error: emsg(e) });
  }
}

export default function* adminWorkProjectsWatcher() {
  yield all([
    takeLatest(T.AWP_FETCH_ALL, fetchAll),
    takeLatest(T.AWP_CREATE, createProject),
    takeLatest(T.AWP_UPDATE, updateProject),
    takeLatest(T.AWP_DELETE, deleteProject),
    takeLatest(T.AWP_PATCH_STATUS, patchStatus),
    takeLatest(T.AWP_PIN, pin),
    takeLatest(T.AWP_UNPIN, unpin),
    takeLatest(T.AWP_ARCHIVE, archive),
    takeLatest(T.AWP_UNARCHIVE, unarchive),
    takeLatest(T.AWP_PATCH_PROGRESS, patchProgress),
    takeLatest(T.AWP_FETCH_METRICS, fetchMetrics),
    takeLatest(T.AWP_CAT_LIST, catListSaga),
    takeLatest(T.AWP_CAT_CREATE, catCreateSaga),
    takeLatest(T.AWP_CAT_DELETE, catDeleteSaga),
  ]);
}
