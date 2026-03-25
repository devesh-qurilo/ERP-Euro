import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { projectNotesAPI } from '../../../../../../../services/api';

function* listByProjectSaga({ payload: { projectId } }) {
  try {
    const data = yield call(projectNotesAPI.listByProject, projectId);
    yield put({ type: T.LIST_BY_PROJECT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_PROJECT_FAILURE,
      payload: e?.message || 'Failed to load notes',
    });
  }
}

function* createNoteSaga({ payload: { projectId, note } }) {
  try {
    yield call(projectNotesAPI.create, projectId, note);
    yield put({ type: T.CREATE_SUCCESS });
    yield put({ type: T.LIST_BY_PROJECT_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Failed to create note',
    });
  }
}

function* deleteNoteSaga({ payload: { noteId, projectId } }) {
  try {
    yield call(projectNotesAPI.remove, noteId);
    yield put({ type: T.DELETE_SUCCESS, meta: { noteId } });
    yield put({ type: T.LIST_BY_PROJECT_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Failed to delete note',
      meta: { noteId },
    });
  }
}

export function* projectNotesWatcher() {
  yield all([
    takeLatest(T.LIST_BY_PROJECT_REQUEST, listByProjectSaga),
    takeLatest(T.CREATE_REQUEST, createNoteSaga),
    takeLatest(T.DELETE_REQUEST, deleteNoteSaga),
  ]);
}

export default function* projectNotesRoot() {
  yield projectNotesWatcher();
}
