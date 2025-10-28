// src/modules/employee/works/tasks/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { myTasksAPI } from '../../../../../services/api';
import * as T from './types';

function* fetchMyTasksSaga() {
  try {
    const data = yield call(myTasksAPI.list);
    yield put({ type: T.FETCH_MY_TASKS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_MY_TASKS_FAILURE,
      error: e?.message || 'Failed to load tasks',
    });
  }
}

export function* employeeTasksWatcher() {
  yield takeLatest(T.FETCH_MY_TASKS_REQUEST, fetchMyTasksSaga);
}
