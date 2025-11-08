import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import * as T from './types';
import { clientsAPI as API } from '../../../../services/api';

function* listSaga({ payload: { filters } }) {
  try {
    const data = yield call(API.list, filters);
    yield put({ type: T.LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.LIST_FAILURE, payload: e?.message || 'Load failed' });
  }
}

const getFilters = s => s.admin.clients.filters;

function* createSaga({ payload }) {
  try {
    yield call(API.create, payload);
    yield put({ type: T.CREATE_SUCCESS });
    const f = yield select(getFilters);
    yield put({ type: T.LIST_REQUEST, payload: { filters: f } });
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

function* updateSaga({ payload: { id, ...rest } }) {
  try {
    yield call(API.update, id, rest);
    yield put({ type: T.UPDATE_SUCCESS });
    const f = yield select(getFilters);
    yield put({ type: T.LIST_REQUEST, payload: { filters: f } });
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message || 'Update failed',
    });
  }
}

function* deleteSaga({ payload: { id } }) {
  try {
    yield call(API.remove, id);
    yield put({ type: T.DELETE_SUCCESS });
    const f = yield select(getFilters);
    yield put({ type: T.LIST_REQUEST, payload: { filters: f } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

export function* clientsWatcher() {
  yield all([
    takeLatest(T.LIST_REQUEST, listSaga),
    takeLatest(T.CREATE_REQUEST, createSaga),
    takeLatest(T.UPDATE_REQUEST, updateSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),
  ]);
}
export default function* clientsSaga() {
  yield clientsWatcher();
}
