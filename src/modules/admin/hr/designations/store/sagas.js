import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminDesignationsAPI as API } from '../../../../../services/api';

function* fetchList() {
  try {
    const data = yield call(API.list);
    yield put({ type: T.FETCH_DESIG_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_DESIG_FAIL,
      error: e?.message || 'Failed to load designations',
    });
  }
}

function* createOne({ payload }) {
  try {
    const data = yield call(API.create, payload);
    yield put({ type: T.CREATE_DESIG_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.CREATE_DESIG_FAIL,
      error: e?.message || 'Create failed',
    });
  }
}

function* updateOne({ id, payload }) {
  try {
    const data = yield call(API.update, id, payload);
    yield put({ type: T.UPDATE_DESIG_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.UPDATE_DESIG_FAIL,
      id,
      error: e?.message || 'Update failed',
    });
  }
}

function* deleteOne({ id }) {
  try {
    yield call(API.remove, id);
    yield put({ type: T.DELETE_DESIG_SUCCESS, id });
  } catch (e) {
    yield put({
      type: T.DELETE_DESIG_FAIL,
      id,
      error: e?.message || 'Delete failed',
    });
  }
}

export function* adminDesignationsWatcher() {
  yield all([
    takeLatest(T.FETCH_DESIG_REQ, fetchList),
    takeLatest(T.CREATE_DESIG_REQ, createOne),
    takeLatest(T.UPDATE_DESIG_REQ, updateOne),
    takeLatest(T.DELETE_DESIG_REQ, deleteOne),
  ]);
}
