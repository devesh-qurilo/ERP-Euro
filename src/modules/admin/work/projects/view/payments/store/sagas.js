// ...imports
import {
  projectPaymentsAPI,
  paymentsAPI,
} from '../../../../../../../services/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';

function* listByProjectSaga({ payload: { projectId } }) {
  try {
    const data = yield call(projectPaymentsAPI.listByProject, projectId); // ✅ correct endpoint
    console.log('list by poroject', data);
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
    const data = yield call(projectPaymentsAPI.update, paymentId, payload);
    console.log('create project payment', data);
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
    takeLatest(T.LIST_BY_PROJECT_REQUEST, listByProjectSaga), // ✅
    takeLatest(T.UPDATE_REQUEST, updatePaymentSaga),
    takeLatest(T.DELETE_REQUEST, deletePaymentSaga),
    takeLatest(T.CREATE_REQUEST, createPaymentSaga),
  ]);
}

export default function* projectsViewPaymentsSaga() {
  yield projectsViewPaymentsWatcher();
}
