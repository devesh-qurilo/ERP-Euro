import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { AdminprojectActivityAPI } from '../../../../../../../services/api';

function* listByProjectSaga({ payload: { projectId } }) {
  try {
    const data = yield call(AdminprojectActivityAPI.listByProject, projectId);
    console.log('raggg', data);
    yield put({ type: T.LIST_BY_PROJECT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_PROJECT_FAILURE,
      payload: e?.message || 'Failed to load activity',
    });
  }
}

export function* projectActivityWatcher() {
  yield all([takeLatest(T.LIST_BY_PROJECT_REQUEST, listByProjectSaga)]);
}

export default function* AdminprojectActivityRoot() {
  yield projectActivityWatcher();
}
