import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminPaymentGatewaysAPI as API } from '../../../../services/api';

// list
function* listSaga() {
  try {
    const rows = yield call(API.list);
    yield put({ type: T.LIST_SUCCESS, payload: rows });
  } catch (e) {
    yield put({ type: T.LIST_FAILURE, payload: e?.message || 'List failed' });
  }
}

// create
function* createSaga({ payload }) {
  try {
    const created = yield call(API.create, payload);
    yield put({ type: T.CREATE_SUCCESS, payload: created });
    // refresh full list to keep server order consistent
    yield put({ type: T.LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

// delete
function* deleteSaga({ payload: { id } }) {
  try {
    yield call(API.remove, id);
    yield put({ type: T.DELETE_SUCCESS, payload: { id } });
    // refresh
    yield put({ type: T.LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

export default function* paymentGatewaysWatcher() {
  yield takeLatest(T.LIST_REQUEST, listSaga);
  yield takeLatest(T.CREATE_REQUEST, createSaga);
  yield takeLatest(T.DELETE_REQUEST, deleteSaga);
}
