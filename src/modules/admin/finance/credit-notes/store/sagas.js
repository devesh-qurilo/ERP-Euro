import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { financeCreditNotesAPI as API } from '../../../../../services/api';

function* listSaga() {
  try {
    const data = yield call(API.listAll);
    yield put({ type: T.LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_FAILURE,
      payload: e?.message || 'Failed to load credit notes',
    });
  }
}

function* updateSaga({ payload: { id, payload } }) {
  try {
    yield call(API.update, id, payload);
    yield put({ type: T.UPDATE_SUCCESS });
    yield put({ type: T.LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message || 'Update failed',
    });
  }
}

function* deleteSaga({ payload: { id } }) {
  // console.log('[CN] deleteSaga', id);
  try {
    yield call(API.remove, id);
    yield put({ type: T.DELETE_SUCCESS });
    yield put({ type: T.LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

export function* creditNotesWatcher() {
  yield all([
    takeLatest(T.LIST_REQUEST, listSaga),
    takeLatest(T.UPDATE_REQUEST, updateSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),
  ]);
}

// also provide a default that forks the watcher (prevents tree-shake issues)
export default function* creditNotesSaga() {
  yield creditNotesWatcher();
}
