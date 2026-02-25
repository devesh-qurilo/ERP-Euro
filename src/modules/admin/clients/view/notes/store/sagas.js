import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { clientNotesAPI } from '../../../../../../services/api';

function* listSaga({ payload: { clientId } }) {
  try {
    const data = yield call(clientNotesAPI.list, clientId);
    // console.log('devesh client notes', clientId, data);
    yield put({ type: T.LIST_OK, payload: data });
  } catch (e) {
    yield put({ type: T.LIST_ERR, payload: e?.message || 'Load failed' });
  }
}

function* createSaga({ payload: { clientId, payload } }) {
  try {
    yield call(clientNotesAPI.create, clientId, payload);
    yield put({ type: T.CREATE_OK });
    yield put({ type: T.LIST_REQ, payload: { clientId } });
  } catch (e) {
    yield put({ type: T.CREATE_ERR, payload: e?.message || 'Create failed' });
  }
}

function* updateSaga({ payload: { clientId, noteId, payload } }) {
  try {
    yield call(clientNotesAPI.update, clientId, noteId, payload);
    yield put({ type: T.UPDATE_OK });
    yield put({ type: T.LIST_REQ, payload: { clientId } });
  } catch (e) {
    yield put({ type: T.UPDATE_ERR, payload: e?.message || 'Update failed' });
  }
}

function* deleteSaga({ payload: { clientId, noteId } }) {
  try {
    yield call(clientNotesAPI.remove, clientId, noteId);
    yield put({ type: T.DELETE_OK, meta: { noteId } });
    yield put({ type: T.LIST_REQ, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.DELETE_ERR,
      payload: e?.message || 'Delete failed',
      meta: { noteId },
    });
  }
}

export function* clientsViewNotesWatcher() {
  yield all([
    takeLatest(T.LIST_REQ, listSaga),
    takeLatest(T.CREATE_REQ, createSaga),
    takeLatest(T.UPDATE_REQ, updateSaga),
    takeLatest(T.DELETE_REQ, deleteSaga),
  ]);
}
