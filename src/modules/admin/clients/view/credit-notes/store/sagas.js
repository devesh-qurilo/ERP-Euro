// src/modules/admin/clients/view/credit-notes/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { clientCreditNotesAPI } from '../../../../../../services/api';

function* listByClientSaga({ payload: { clientId } }) {
  try {
    const data = yield call(clientCreditNotesAPI.listByClient, clientId);
    yield put({ type: T.LIST_BY_CLIENT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_CLIENT_FAILURE,
      payload: e?.message || 'Load error',
    });
  }
}

function* updateSaga({ payload: { id, payload, clientId } }) {
  try {
    yield call(clientCreditNotesAPI.update, id, payload);
    yield put({ type: T.UPDATE_SUCCESS });
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message || 'Update failed',
    });
  }
}

function* deleteSaga({ payload: { id, clientId } }) {
  try {
    yield call(clientCreditNotesAPI.remove, id);
    yield put({ type: T.DELETE_SUCCESS, meta: { id } });
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      meta: { id },
      payload: e?.message || 'Delete failed',
    });
  }
}

export function* clientsViewCreditNotesWatcher() {
  yield all([
    takeLatest(T.LIST_BY_CLIENT_REQUEST, listByClientSaga),
    takeLatest(T.UPDATE_REQUEST, updateSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),
  ]);
}
