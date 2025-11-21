// src/modules/admin/birthdays/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../../services/api'; // adjust path
import {
  FETCH_BIRTHDAYS_REQUEST,
  fetchBirthdaysSuccess,
  fetchBirthdaysFailure,
} from './actions';

/**
 * Worker saga: GET /employee/birthdays
 */
function* fetchBirthdaysWorker() {
  try {
    const res = yield call([api, api.get], '/employee/birthdays');
    const data = res?.data ?? res;
    // Expecting an array
    const list = Array.isArray(data) ? data : [];
    yield put(fetchBirthdaysSuccess(list));
  } catch (err) {
    console.error('[birthdays] fetch error', err?.message || err);
    yield put(
      fetchBirthdaysFailure(err?.message || 'Failed to fetch birthdays'),
    );
  }
}

export function* birthdaysWatcher() {
  yield takeLatest(FETCH_BIRTHDAYS_REQUEST, fetchBirthdaysWorker);
}
