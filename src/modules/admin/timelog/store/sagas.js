import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../../services/api';
import {
  FETCH_TIMELOG_REQUEST,
  fetchTimelogSuccess,
  fetchTimelogFailure,
} from './actions';

console.log('[timelog sagas] FETCH_TIMELOG_REQUEST ->', FETCH_TIMELOG_REQUEST);

function* fetchTimelogWorker(action) {
  try {
    const date = action?.payload?.date;
    const res = yield call([api, api.get], '/timesheets/me/day', {
      params: { date },
    });
    const data = res?.data ?? res;
    const timeLogs = Array.isArray(data.timeLogs)
      ? data.timeLogs
      : data?.timeLogs ?? [];
    const summary = data.summary || {
      date,
      totalMinutes: 0,
      totalHours: 0,
      segments: [],
    };
    const dayMinutes = 24 * 60;
    const usedMinutes = Number(summary.totalMinutes || 0);
    const usedPct = dayMinutes
      ? Math.round((usedMinutes / dayMinutes) * 100)
      : 0;
    yield put(
      fetchTimelogSuccess({ timeLogs, summary: { ...summary, usedPct } }),
    );
  } catch (err) {
    yield put(fetchTimelogFailure(err?.message || 'Failed to fetch timelog'));
  }
}

export function* timelogWatcher() {
  // make sure the constant is defined — if undefined this is the place it will throw
  if (!FETCH_TIMELOG_REQUEST) {
    console.error(
      '[timelogWatcher] FETCH_TIMELOG_REQUEST is undefined — check actions import/export!',
    );
  }
  yield takeLatest(FETCH_TIMELOG_REQUEST, fetchTimelogWorker);
}
