import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { AstatusesAPI } from '../../../../../services/api';

function* fetchW() {
  try {
    const data = yield call(AstatusesAPI.list);
    // normalize optional: keep order by position then id
    data.sort((a, b) => (a.position || 0) - (b.position || 0) || a.id - b.id);
    yield put({ type: T.STAGES_FETCH_OK, data });
  } catch (e) {
    yield put({ type: T.STAGES_FETCH_ERR, error: e?.message });
  }
}

function* createW({ payload }) {
  yield call(AstatusesAPI.create, payload);
  yield* fetchW();
}
function* deleteW({ id }) {
  yield call(AstatusesAPI.remove, id);
  yield* fetchW();
}

export default function* taskStagesWatcher() {
  yield takeLatest(T.STAGES_FETCH_REQ, fetchW);
  yield takeLatest(T.STAGE_CREATE_REQ, createW);
  yield takeLatest(T.STAGE_DELETE_REQ, deleteW);
}
