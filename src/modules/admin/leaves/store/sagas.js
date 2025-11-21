// src/modules/admin/leaves/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../../services/api'; // adjust path if needed
import {
  FETCH_LEAVES_CALENDAR_REQUEST,
  fetchLeavesCalendarSuccess,
  fetchLeavesCalendarFailure,
} from './actions';

function* fetchLeavesWorker(action) {
  try {
    const date = action?.payload?.date;
    // endpoint: /employee/api/leaves/calendar?date=YYYY-MM-DD
    const res = yield call([api, api.get], '/employee/api/leaves/calendar', {
      params: { date },
    });
    const data = res?.data ?? res;
    // expected array
    const list = Array.isArray(data) ? data : [];
    yield put(fetchLeavesCalendarSuccess(list));
  } catch (err) {
    console.error('[leaves] fetch error:', err?.message || err);
    yield put(
      fetchLeavesCalendarFailure(err?.message || 'Failed to fetch leaves'),
    );
  }
}

export function* leavesWatcher() {
  yield takeLatest(FETCH_LEAVES_CALENDAR_REQUEST, fetchLeavesWorker);
}
