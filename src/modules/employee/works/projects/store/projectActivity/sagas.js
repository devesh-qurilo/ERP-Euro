import { call, put, takeLatest } from 'redux-saga/effects';
import { projectsAPI } from '../../../../../../services/api';
import {
  FETCH_PROJECT_ACTIVITY_REQUEST,
  FETCH_PROJECT_ACTIVITY_SUCCESS,
  FETCH_PROJECT_ACTIVITY_FAILURE,
} from './types';

function* fetchActivitySaga({ projectId }) {
  try {
    const data = yield call(projectsAPI.getProjectActivity, projectId);
    yield put({
      type: FETCH_PROJECT_ACTIVITY_SUCCESS,
      projectId,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: FETCH_PROJECT_ACTIVITY_FAILURE,
      projectId,
      error: e?.message || 'Failed to load activity',
    });
  }
}

export function* projectActivityWatcher() {
  yield takeLatest(FETCH_PROJECT_ACTIVITY_REQUEST, fetchActivitySaga);
}
