// src/modules/admin/wfh/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../../services/api'; // adjust path
import { FETCH_WFH_REQUEST, fetchWfhSuccess, fetchWfhFailure } from './actions';

function* fetchWfhWorker(action) {
  try {
    const date = action?.payload?.date;
    const res = yield call([api, api.get], '/employee/attendance/wfh', {
      params: { date },
    });
    const data = res?.data ?? res;
    const list = Array.isArray(data) ? data : [];
    yield put(fetchWfhSuccess(list));
  } catch (err) {
    console.error('[wfh] fetch error', err?.message || err);
    yield put(fetchWfhFailure(err?.message || 'Failed to fetch WFH'));
  }
}

export function* wfhWatcher() {
  yield takeLatest(FETCH_WFH_REQUEST, fetchWfhWorker);
}
