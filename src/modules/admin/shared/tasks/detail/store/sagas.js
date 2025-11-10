import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import {
  taskFilesAPI,
  subtasksAPI,
  notesAPI,
} from '../../../../../../services/api';

const getTaskId = s =>
  s.admin?.work?.taskDetail?.taskId || s.shared?.tasksDetail?.taskId;

/* -------- Files -------- */
function* filesFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(taskFilesAPI.list, taskId);
    yield put({ type: T.FILES_FETCH_OK, data });
  } catch (e) {
    yield put({
      type: T.FILES_FETCH_ERR,
      error: e?.message || 'Files load failed',
    });
  }
}
function* filesUploadW({ file }) {
  const taskId = yield select(getTaskId);
  yield call(taskFilesAPI.upload, taskId, file);
  yield* filesFetchW();
}
function* filesDeleteW({ fileId }) {
  yield call(taskFilesAPI.remove, fileId);
  yield* filesFetchW();
}

/* -------- Subtasks -------- */
function* subsFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(subtasksAPI.list, taskId);
    yield put({ type: T.SUBS_FETCH_OK, data });
  } catch (e) {
    yield put({
      type: T.SUBS_FETCH_ERR,
      error: e?.message || 'Subtasks load failed',
    });
  }
}
function* subsCreateW({ payload }) {
  const taskId = yield select(getTaskId);
  yield call(subtasksAPI.create, taskId, payload);
  yield* subsFetchW();
}
function* subsUpdateW({ subId, payload }) {
  const taskId = yield select(getTaskId);
  yield call(subtasksAPI.update, taskId, subId, payload);
  yield* subsFetchW();
}
function* subsDeleteW({ subId }) {
  const taskId = yield select(getTaskId);
  yield call(subtasksAPI.remove, taskId, subId);
  yield* subsFetchW();
}

/* -------- Notes -------- */
function* notesFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(notesAPI.list, taskId);
    yield put({ type: T.NOTES_FETCH_OK, data });
  } catch (e) {
    yield put({
      type: T.NOTES_FETCH_ERR,
      error: e?.message || 'Notes load failed',
    });
  }
}
function* notesCreateW({ payload }) {
  const taskId = yield select(getTaskId);
  yield call(notesAPI.create, taskId, payload);
  yield* notesFetchW();
}
function* notesDeleteW({ taskNoteId }) {
  yield call(notesAPI.removeByTaskNoteId, taskNoteId);
  yield* notesFetchW();
}

export function* tasksDetailWatcher() {
  yield takeLatest(T.FILES_FETCH_REQ, filesFetchW);
  yield takeLatest(T.FILES_UPLOAD_REQ, filesUploadW);
  yield takeLatest(T.FILES_DELETE_REQ, filesDeleteW);

  yield takeLatest(T.SUBS_FETCH_REQ, subsFetchW);
  yield takeLatest(T.SUBS_CREATE_REQ, subsCreateW);
  yield takeLatest(T.SUBS_UPDATE_REQ, subsUpdateW);
  yield takeLatest(T.SUBS_DELETE_REQ, subsDeleteW);

  yield takeLatest(T.NOTES_FETCH_REQ, notesFetchW);
  yield takeLatest(T.NOTES_CREATE_REQ, notesCreateW);
  yield takeLatest(T.NOTES_DELETE_REQ, notesDeleteW);
}

export default tasksDetailWatcher;
