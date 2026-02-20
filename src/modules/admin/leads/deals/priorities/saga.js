import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import api from '../../../../../services/api';

function* fetchWorker() {
  try {
    const res = yield call(api.get, '/deals/admin/priorities');
    yield put({ type: T.FETCH_OK, payload: res.data });
  } catch (err) {
    yield put({ type: T.FETCH_ERR, err });
  }
}

export default function* adminDealspriority() {
  yield takeLatest(T.FETCH_REQ, fetchWorker);
}
