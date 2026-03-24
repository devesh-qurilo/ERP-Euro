import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { clientPaymentsAPI, paymentsAPI } from '../../../../../../services/api';

function* listByClientSaga({ payload: { clientId } }) {
  try {
    const data = yield call(clientPaymentsAPI.listByClient, clientId);
    yield put({ type: T.LIST_BY_CLIENT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_CLIENT_FAILURE,
      payload: e?.message || 'Failed to load payments',
    });
  }
}

function* updatePaymentSaga({ payload: { paymentId, payload, clientId } }) {
  try {
    const data = yield call(clientPaymentsAPI.update, paymentId, payload);
    yield put({ type: T.UPDATE_SUCCESS, payload: data });
    // refresh list for the same client
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message,
      meta: { paymentId },
    });
  }
}

function* createPaymentSaga({ payload: { payload, clientId } }) {
  console.log('create payment client payment', payload);
  try {
    const res = yield call(paymentsAPI.create, payload);
    console.log('create payment client payment response', res);
    yield put({ type: T.CREATE_SUCCESS, payload: res });
    // refresh same client list
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Failed to create payment',
    });
  }
}

function* deletePaymentSaga({ payload: { paymentId, clientId } }) {
  try {
    yield call(clientPaymentsAPI.remove, paymentId);
    yield put({ type: T.DELETE_SUCCESS, meta: { paymentId } });
    yield put({ type: T.LIST_BY_CLIENT_REQUEST, payload: { clientId } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message,
      meta: { paymentId },
    });
  }
}

export function* clientsViewPaymentsWatcher() {
  yield all([
    takeLatest(T.LIST_BY_CLIENT_REQUEST, listByClientSaga),
    takeLatest(T.UPDATE_REQUEST, updatePaymentSaga),
    takeLatest(T.DELETE_REQUEST, deletePaymentSaga),
    takeLatest(T.CREATE_REQUEST, createPaymentSaga),
  ]);
}
