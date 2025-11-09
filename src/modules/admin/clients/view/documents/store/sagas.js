import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { clientDocumentsAPI } from '../../../../../../services/api';

function* listSaga({ payload: { clientId } }) {
  try {
    const data = yield call(clientDocumentsAPI.list, clientId);
    yield put({ type: T.LIST_BY_CLIENT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_CLIENT_FAILURE,
      payload: e?.message || 'Load failed',
    });
  }
}

function* uploadSaga({ payload: { clientId, file } }) {
  try {
    yield call(clientDocumentsAPI.upload, clientId, file);
    yield put({ type: T.UPLOAD_SUCCESS });
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.UPLOAD_FAILURE,
      payload: e?.message || 'Upload failed',
    });
  }
}

function* deleteSaga({ payload: { clientId, docId } }) {
  try {
    yield call(clientDocumentsAPI.remove, clientId, docId);
    yield put({ type: T.DELETE_SUCCESS, meta: { docId } });
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
      meta: { docId },
    });
  }
}

export function* clientsViewDocumentsWatcher() {
  yield all([
    takeLatest(T.LIST_BY_CLIENT_REQUEST, listSaga),
    takeLatest(T.UPLOAD_REQUEST, uploadSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),
  ]);
}
