import { call, put, takeLatest, all } from 'redux-saga/effects';
import { leadsAPI } from '../../../../services/api';
import {
  FETCH_MY_LEADS_REQUEST,
  FETCH_MY_LEADS_SUCCESS,
  FETCH_MY_LEADS_FAILURE,
} from './actions';

function* fetchMyLeadsSaga() {
  try {
    const data = yield call(leadsAPI.getMyLeads);
    // newest first
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    yield put({ type: FETCH_MY_LEADS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: FETCH_MY_LEADS_FAILURE,
      error: e?.message || 'Failed to load leads',
    });
  }
}

export function* employeeLeadsWatcher() {
  yield all([takeLatest(FETCH_MY_LEADS_REQUEST, fetchMyLeadsSaga)]);
}
