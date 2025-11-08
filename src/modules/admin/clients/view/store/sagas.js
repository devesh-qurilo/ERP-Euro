import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as T from './types';
import { clientsAPI } from '../../../../../services/api';

function* viewSaga({ payload: { id } }) {
  try {
    const data = yield call(clientsAPI.get, id);
    yield put({ type: T.VIEW_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.VIEW_FAILURE,
      payload: e?.message || 'Failed to load client',
    });
  }
}

export function* clientsViewWatcher() {
  yield all([takeLatest(T.VIEW_REQUEST, viewSaga)]);
}

export default function* clientsViewSaga() {
  yield clientsViewWatcher();
}
