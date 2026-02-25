import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { clientProjectsAPI } from '../../../../../../services/api';

function* listByClientSaga({ payload: { clientId } }) {
  try {
    const data = yield call(clientProjectsAPI.listByClient, clientId);
    // console.log('devvvvvvv', data, clientId);
    yield put({ type: T.LIST_BY_CLIENT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_CLIENT_FAILURE,
      payload: e?.message || 'Failed to load projects',
    });
  }
}

export function* clientsViewProjectsWatcher() {
  yield all([takeLatest(T.LIST_BY_CLIENT_REQUEST, listByClientSaga)]);
}
export default function* clientsViewProjectsSaga() {
  yield clientsViewProjectsWatcher();
}
