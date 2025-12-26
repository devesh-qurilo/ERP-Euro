import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import {
  fetchHolidaysAPI,
  createHolidaysBulkAPI,
  updateHolidayAPI,
  deleteHolidayAPI,
} from '../../../../../services/api';

function* fetchHolidaysWorker() {
  try {
    const data = yield call(fetchHolidaysAPI);
    yield put({ type: T.FETCH_HOLIDAYS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_HOLIDAYS_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

function* createHolidaysWorker({ payload }) {
  try {
    const data = yield call(createHolidaysBulkAPI, payload);
    // after create, refetch to be safe
    yield put({ type: T.CREATE_HOLIDAYS_SUCCESS, payload: data });
    yield put({ type: T.FETCH_HOLIDAYS_REQUEST });
  } catch (e) {
    yield put({
      type: T.CREATE_HOLIDAYS_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

function* updateHolidayWorker({ id, payload }) {
  try {
    yield call(updateHolidayAPI, id, payload);
    yield put({ type: T.UPDATE_HOLIDAY_SUCCESS });
    yield put({ type: T.FETCH_HOLIDAYS_REQUEST });
    yield put({ type: T.CLOSE_HOLIDAY_MODAL });
  } catch (e) {
    yield put({ type: T.UPDATE_HOLIDAY_FAILURE, error: e.message });
  }
}

function* deleteHolidayWorker({ id }) {
  try {
    yield call(deleteHolidayAPI, id);
    yield put({ type: T.DELETE_HOLIDAY_SUCCESS });
    yield put({ type: T.FETCH_HOLIDAYS_REQUEST });
  } catch (e) {
    yield put({ type: T.DELETE_HOLIDAY_FAILURE, error: e.message });
  }
}

export function* holidaysWatcher() {
  yield all([
    takeLatest(T.FETCH_HOLIDAYS_REQUEST, fetchHolidaysWorker),
    takeLatest(T.CREATE_HOLIDAYS_REQUEST, createHolidaysWorker),
    takeLatest(T.UPDATE_HOLIDAY_REQUEST, updateHolidayWorker),
    takeLatest(T.DELETE_HOLIDAY_REQUEST, deleteHolidayWorker),
  ]);
}
