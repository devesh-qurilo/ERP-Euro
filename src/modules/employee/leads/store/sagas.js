import { call, put, takeLatest, all } from 'redux-saga/effects';
import { leadsAPI } from '../../../../services/api';
import {
  FETCH_MY_LEADS_REQUEST,
  FETCH_MY_LEADS_SUCCESS,
  FETCH_MY_LEADS_FAILURE,
  CREATE_LEAD_REQUEST,
  CREATE_LEAD_SUCCESS,
  CREATE_LEAD_FAILURE,
} from './actions';

function* fetchMyLeadsSaga() {
  try {
    const data = yield call(leadsAPI.getMyLeads);
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    yield put({ type: FETCH_MY_LEADS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: FETCH_MY_LEADS_FAILURE,
      error: e?.message || 'Failed to load leads',
    });
  }
}

function* createLeadSaga(action) {
  try {
    const created = yield call(leadsAPI.createLead, action.payload);
    yield put({ type: CREATE_LEAD_SUCCESS, payload: created });
    action.meta?.onDone?.(created);
  } catch (e) {
    yield put({
      type: CREATE_LEAD_FAILURE,
      error: e?.message || 'Failed to create lead',
    });
    action.meta?.onDone?.(null, e);
  }
}

export function* employeeLeadsWatcher() {
  yield all([
    takeLatest(FETCH_MY_LEADS_REQUEST, fetchMyLeadsSaga),
    takeLatest(CREATE_LEAD_REQUEST, createLeadSaga),
  ]);
}
