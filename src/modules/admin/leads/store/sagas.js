// src/modules/admin/leads/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminLeadsAPI } from '../../../../services/api';
import { createLeadSuccess, createLeadFailure } from './actions';

function* fetchLeads({ params }) {
  try {
    const data = yield call(adminLeadsAPI.list, params);
    yield put({ type: T.FETCH_ADMIN_LEADS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_ADMIN_LEADS_FAILURE,
      error: e?.message || 'Failed to fetch leads',
    });
  }
}

function* delLead({ id }) {
  try {
    yield call(adminLeadsAPI.remove, id);
    yield put({ type: T.DELETE_ADMIN_LEAD_SUCCESS, id });
  } catch (e) {
    yield put({
      type: T.DELETE_ADMIN_LEAD_FAILURE,
      id,
      error: e?.message || 'Delete failed',
    });
  }
}

function* updLead({ id, payload }) {
  try {
    const data = yield call(adminLeadsAPI.update, id, payload);
    yield put({ type: T.UPDATE_LEAD_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.UPDATE_LEAD_FAILURE,
      id,
      error: e?.message || 'Update failed',
    });
  }
}

function* createLead({ payload }) {
  try {
    const data = yield call(adminLeadsAPI.create, payload);
    yield put(createLeadSuccess(data));
  } catch (e) {
    yield put(createLeadFailure(e?.message || 'Failed to create lead'));
  }
}

export function* adminLeadsWatcher() {
  yield all([
    takeLatest(T.FETCH_ADMIN_LEADS_REQUEST, fetchLeads),
    takeLatest(T.DELETE_ADMIN_LEAD_REQUEST, delLead),
    takeLatest(T.CREATE_LEAD_REQUEST, createLead),
    takeLatest(T.UPDATE_LEAD_REQUEST, updLead),
  ]);
}
