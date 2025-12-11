import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import {
  AtaskFilesAPI,
  AsubtasksAPI,
  AnotesAPI,
  ATimesheetsAPI,
} from '../../../../../../services/api';

const getTaskId = s =>
  s.admin?.work?.taskDetail?.taskId || s.shared?.tasksDetail?.taskId;

/* -------- Files -------- */
function* filesFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(AtaskFilesAPI.list, taskId);
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
  yield call(AtaskFilesAPI.upload, taskId, file);
  yield* filesFetchW();
}
function* filesDeleteW({ fileId }) {
  yield call(AtaskFilesAPI.remove, fileId);
  yield* filesFetchW();
}

/* -------- Subtasks -------- */
function* subsFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(AsubtasksAPI.list, taskId);
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
  yield call(AsubtasksAPI.create, taskId, payload);
  yield* subsFetchW();
}
function* subsUpdateW({ subId, payload }) {
  const taskId = yield select(getTaskId);
  yield call(AsubtasksAPI.update, taskId, subId, payload);
  yield* subsFetchW();
}
function* subsDeleteW({ subId }) {
  const taskId = yield select(getTaskId);
  yield call(AsubtasksAPI.remove, taskId, subId);
  yield* subsFetchW();
}

/* -------- Notes -------- */
function* notesFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(AnotesAPI.list, taskId);
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
  yield call(AnotesAPI.create, taskId, payload);
  yield* notesFetchW();
}
function* notesDeleteW({ taskNoteId }) {
  yield call(AnotesAPI.removeByTaskNoteId, taskNoteId);
  yield* notesFetchW();
}

function* timesheetFetchW() {
  try {
    const taskId = yield select(getTaskId);
    const data = yield call(ATimesheetsAPI.listByTaskId, taskId);
    yield put({ type: T.TIMESHEET_FETCH_OK, data });
  } catch (e) {
    yield put({
      type: T.TIMESHEET_FETCH_ERR,
      error: e?.message || 'Timesheet load failed',
    });
  }
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

  yield takeLatest(T.TIMESHEET_FETCH_REQ, timesheetFetchW);
}

export default tasksDetailWatcher;
