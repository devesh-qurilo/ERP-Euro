import { call, put, takeLatest, all } from 'redux-saga/effects';
import { notificationsAPI } from '../../../../services/api';
import {
  FETCH_NOTIFS_REQUEST,
  FETCH_NOTIFS_SUCCESS,
  FETCH_NOTIFS_FAILURE,
  MARK_READ_REQUEST,
  MARK_READ_SUCCESS,
  MARK_READ_FAILURE,
} from './actions';

function* fetchNotifsSaga() {
  try {
    const data = yield call(notificationsAPI.getMyNotifications);
    // newest first
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    yield put({ type: FETCH_NOTIFS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: FETCH_NOTIFS_FAILURE,
      error: e?.message || 'Failed to load notifications',
    });
  }
}

function* markReadSaga(action) {
  try {
    yield call(notificationsAPI.markAsRead, action.id);
    yield put({ type: MARK_READ_SUCCESS, id: action.id });
  } catch (e) {
    yield put({
      type: MARK_READ_FAILURE,
      id: action.id,
      error: e?.message || 'Failed to mark read',
    });
  }
}

export function* employeeNotificationsWatcher() {
  yield all([
    takeLatest(FETCH_NOTIFS_REQUEST, fetchNotifsSaga),
    takeLatest(MARK_READ_REQUEST, markReadSaga),
  ]);
}
