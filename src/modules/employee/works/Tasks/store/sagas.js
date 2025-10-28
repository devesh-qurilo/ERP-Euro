// src/modules/employee/works/tasks/store/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { myTasksAPI, taskPinAPI } from '../../../../../services/api';
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

function* togglePinTaskSaga({ taskId, desiredPinned, prevPinned }) {
  try {
    if (desiredPinned) {
      yield call(taskPinAPI.pin, taskId);
    } else {
      yield call(taskPinAPI.unpin, taskId);
    }
    yield put({ type: T.TOGGLE_PIN_TASK_SUCCESS, taskId, desiredPinned });
  } catch (e) {
    yield put({
      type: T.TOGGLE_PIN_TASK_FAILURE,
      taskId,
      prevPinned, // rollback
      error: e?.message || 'Failed to update pin',
    });
  }
}

export function* employeeTasksWatcher() {
  yield takeLatest(T.FETCH_MY_TASKS_REQUEST, fetchMyTasksSaga);
  yield takeLatest(T.TOGGLE_PIN_TASK_REQUEST, togglePinTaskSaga);
}
