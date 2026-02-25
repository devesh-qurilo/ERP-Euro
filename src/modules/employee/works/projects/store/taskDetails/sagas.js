// src/modules/employee/works/projects/store/taskDetails/sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import {
  taskFilesAPI,
  subtasksAPI,
  timesheetsAPI,
  notesAPI,
} from '../../../../../../services/api';

// Files
function* fetchFilesSaga({ payload: { taskId } }) {
  try {
    // console.log('khush', taskId);
    const data = yield call(taskFilesAPI.list, taskId);
    yield put({ type: T.FETCH_TASK_FILES_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_TASK_FILES_FAILURE,
      error: e.message || 'Failed',
    });
  }
}
function* uploadFileSaga({ payload: { taskId, file } }) {
  try {
    // console.log('khush22', taskId);
    const data = yield call(taskFilesAPI.upload, taskId, file);
    yield put({ type: T.UPLOAD_TASK_FILE_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.UPLOAD_TASK_FILE_FAILURE,
      error: e.message || 'Failed',
    });
  }
}

// Subtasks
function* fetchSubsSaga({ payload: { taskId } }) {
  try {
    // console.log('khush3', taskId);
    const data = yield call(subtasksAPI.list, taskId);
    yield put({ type: T.FETCH_SUBTASKS_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.FETCH_SUBTASKS_FAILURE, error: e.message || 'Failed' });
  }
}
function* createSubSaga({ payload: { taskId, data } }) {
  try {
    // console.log('khush4', taskId);
    const res = yield call(subtasksAPI.create, taskId, data);
    yield put({ type: T.CREATE_SUBTASK_SUCCESS, payload: res });
  } catch (e) {
    yield put({ type: T.CREATE_SUBTASK_FAILURE, error: e.message || 'Failed' });
  }
}

// Timesheets
function* fetchSheetsSaga({ payload: { projectId, taskId } }) {
  try {
    // console.log('khush5', taskId);
    const data = yield call(timesheetsAPI.list, { projectId, taskId });
    yield put({ type: T.FETCH_TIMESHEETS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_TIMESHEETS_FAILURE,
      error: e.message || 'Failed',
    });
  }
}

// Notes
function* fetchNotesSaga({ payload: { taskId } }) {
  try {
    // console.log('khush6', taskId);
    const data = yield call(notesAPI.list, taskId);
    yield put({ type: T.FETCH_NOTES_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.FETCH_NOTES_FAILURE, error: e.message || 'Failed' });
  }
}
function* createNoteSaga({ payload: { taskId, data } }) {
  try {
    // console.log('khush7', taskId);
    const res = yield call(notesAPI.create, taskId, data);
    yield put({ type: T.CREATE_NOTE_SUCCESS, payload: res });
  } catch (e) {
    yield put({ type: T.CREATE_NOTE_FAILURE, error: e.message || 'Failed' });
  }
}

export function* taskDetailsWatcher() {
  yield takeLatest(T.FETCH_TASK_FILES_REQUEST, fetchFilesSaga);
  yield takeLatest(T.UPLOAD_TASK_FILE_REQUEST, uploadFileSaga);

  yield takeLatest(T.FETCH_SUBTASKS_REQUEST, fetchSubsSaga);
  yield takeLatest(T.CREATE_SUBTASK_REQUEST, createSubSaga);

  yield takeLatest(T.FETCH_TIMESHEETS_REQUEST, fetchSheetsSaga);

  yield takeLatest(T.FETCH_NOTES_REQUEST, fetchNotesSaga);
  yield takeLatest(T.CREATE_NOTE_REQUEST, createNoteSaga);
}
