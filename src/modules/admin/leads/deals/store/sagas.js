import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as T from './types';
import { adminDealsAPI, adminLeadsAPI } from '../../../../../services/api'; // leads list for dropdown
import { selectDealsParams } from './selectors';
import { setBusy, setFormOpen, setEditing, setFollowupOpen } from './actions';

function* fetchListWorker({ params }) {
  try {
    yield put(setBusy(true));
    const saved = yield select(selectDealsParams);
    const merged = { ...saved, ...(params || {}) };
    const data = yield call(adminDealsAPI.list, merged);
    yield put({ type: T.FETCH_LIST_SUCCESS, data });
  } catch (error) {
    yield put({ type: T.FETCH_LIST_FAILURE, error });
  } finally {
    yield put(setBusy(false));
  }
}

function* fetchOneWorker({ id }) {
  try {
    const data = yield call(adminDealsAPI.get, id);
    yield put({ type: T.FETCH_ONE_SUCCESS, data });
  } catch (error) {
    yield put({ type: T.FETCH_ONE_FAILURE, error });
  }
}

function* createWorker({ payload }) {
  try {
    yield put(setBusy(true));
    yield call(adminDealsAPI.create, payload);
    yield put({ type: T.CREATE_SUCCESS });
    yield put(setFormOpen(false));
    yield put(setEditing(null));
    yield put({ type: T.FETCH_LIST_REQUEST });
  } catch (error) {
    yield put({ type: T.CREATE_FAILURE, error });
  } finally {
    yield put(setBusy(false));
  }
}

function* updateWorker({ id, payload }) {
  try {
    yield put(setBusy(true));
    yield call(adminDealsAPI.update, id, payload);
    yield put({ type: T.UPDATE_SUCCESS });
    yield put(setFormOpen(false));
    yield put(setEditing(null));
    yield put({ type: T.FETCH_LIST_REQUEST });
  } catch (error) {
    yield put({ type: T.UPDATE_FAILURE, error });
  } finally {
    yield put(setBusy(false));
  }
}

function* deleteWorker({ id }) {
  try {
    yield put(setBusy(true));
    yield call(adminDealsAPI.remove, id);
    yield put({ type: T.DELETE_SUCCESS });
    yield put({ type: T.FETCH_LIST_REQUEST });
  } catch (error) {
    yield put({ type: T.DELETE_FAILURE, error });
  } finally {
    yield put(setBusy(false));
  }
}

function* followupCreateWorker({ dealId, payload }) {
  try {
    yield put(setBusy(true));
    yield call(adminDealsAPI.addFollowup, dealId, payload);
    yield put({ type: T.FOLLOWUP_CREATE_SUCCESS });
    yield put(setFollowupOpen(false, null));
    // optional: refresh row details
    yield put({ type: T.FETCH_LIST_REQUEST });
  } catch (error) {
    yield put({ type: T.FOLLOWUP_CREATE_FAILURE, error });
  } finally {
    yield put(setBusy(false));
  }
}

// Optional helper: preload leads for dropdown (if you want caching)
// export function* preloadLeadsWorker() { yield call(adminLeadsAPI.list); }

export function* adminDealsWatcher() {
  yield takeLatest(T.FETCH_LIST_REQUEST, fetchListWorker);
  yield takeLatest(T.FETCH_ONE_REQUEST, fetchOneWorker);
  yield takeLatest(T.CREATE_REQUEST, createWorker);
  yield takeLatest(T.UPDATE_REQUEST, updateWorker);
  yield takeLatest(T.DELETE_REQUEST, deleteWorker);
  yield takeLatest(T.FOLLOWUP_CREATE_REQUEST, followupCreateWorker);
}

export default adminDealsWatcher;
