import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import {
  projectPaymentsAPI,
  paymentsAPI,
} from '../../../../../../../services/api';

function* listByProjectSaga({ payload: { projectId } }) {
  try {
    const data = yield call(projectPaymentsAPI.listByProject, projectId);
    yield put({ type: T.LIST_BY_PROJECT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_PROJECT_FAILURE,
      payload: e?.message || 'Failed to load payments',
    });
  }
}

function* updatePaymentSaga({ payload: { paymentId, payload, projectId } }) {
  try {
    console.log('devesh payment id', paymentId);
    console.log('devesh projectId', projectId);
    console.log('devesh  payload', payload);
    const data = yield call(projectPaymentsAPI.update, paymentId, payload);
    yield put({ type: T.UPDATE_SUCCESS, payload: data });
    yield put({ type: T.LIST_BY_PROJECT_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message,
      meta: { paymentId },
    });
  }
}

function* createPaymentSaga({ payload: { payload, projectId } }) {
  try {
    const res = yield call(paymentsAPI.create, payload);
    yield put({ type: T.CREATE_SUCCESS, payload: res });
    yield put({ type: T.LIST_BY_PROJECT_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Failed to create payment',
    });
  }
}

function* deletePaymentSaga({ payload: { paymentId, projectId } }) {
  try {
    yield call(projectPaymentsAPI.remove, paymentId);
    yield put({ type: T.DELETE_SUCCESS, meta: { paymentId } });
    yield put({ type: T.LIST_BY_PROJECT_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message,
      meta: { paymentId },
    });
  }
}

export function* projectsViewPaymentsWatcher() {
  yield all([
    takeLatest(T.LIST_BY_PROJECT_REQUEST, listByProjectSaga),
    takeLatest(T.UPDATE_REQUEST, updatePaymentSaga),
    takeLatest(T.DELETE_REQUEST, deletePaymentSaga),
    takeLatest(T.CREATE_REQUEST, createPaymentSaga),
  ]);
}

export default function* projectsViewPaymentsSaga() {
  yield projectsViewPaymentsWatcher();
}
