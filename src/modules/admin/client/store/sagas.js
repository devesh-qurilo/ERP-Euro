import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as T from './types';
import { adminClientsAPI } from '../../../../services/api';
import { getClientQuery } from './selectors';

function* fetchClientsWorker({ params }) {
  try {
    const query = params || (yield select(getClientQuery));
    const data = yield call(adminClientsAPI.list, query);
    const payload = Array.isArray(data) ? data : data || {};
    yield put({ type: T.FETCH_CLIENTS_SUCCESS, payload });
  } catch (error) {
    yield put({ type: T.FETCH_CLIENTS_FAILURE, error });
  }
}

function* createClientWorker({ payload }) {
  try {
    const res = yield call(adminClientsAPI.create, payload);
    yield put({ type: T.CREATE_CLIENT_SUCCESS, payload: res });
    yield put({ type: T.FETCH_CLIENTS_REQUEST }); // refresh from server
    yield put({ type: T.SET_CLIENT_MODAL, visible: false }); // close modal
    yield put({ type: T.SET_SELECTED_CLIENT, client: null });
  } catch (error) {
    yield put({ type: T.CREATE_CLIENT_FAILURE, error });
  }
}

function* updateClientWorker({ id, payload }) {
  try {
    // some backends return {message: "..."} only; so ALWAYS refresh after update
    yield call(adminClientsAPI.update, id, payload);
    yield put({ type: T.UPDATE_CLIENT_SUCCESS, payload: { id } }); // optimistic
    yield put({ type: T.FETCH_CLIENTS_REQUEST }); // authoritative refresh
    yield put({ type: T.SET_CLIENT_MODAL, visible: false }); // close modal
    yield put({ type: T.SET_SELECTED_CLIENT, client: null });
  } catch (error) {
    yield put({ type: T.UPDATE_CLIENT_FAILURE, error });
  }
}

function* deleteClientWorker({ id }) {
  try {
    yield call(adminClientsAPI.remove, id);
    yield put({ type: T.DELETE_CLIENT_SUCCESS, id });
  } catch (error) {
    yield put({ type: T.DELETE_CLIENT_FAILURE, error });
  }
}

export function* adminClientsWatcher() {
  yield takeLatest(T.FETCH_CLIENTS_REQUEST, fetchClientsWorker);
  yield takeLatest(T.CREATE_CLIENT_REQUEST, createClientWorker);
  yield takeLatest(T.UPDATE_CLIENT_REQUEST, updateClientWorker);
  yield takeLatest(T.DELETE_CLIENT_REQUEST, deleteClientWorker);
}
