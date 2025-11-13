// src/modules/admin/leads/notes/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminLeadsAPI } from '../../../../../services/api';
// ↑ path adjust if needed (from: modules/admin/leads/notes/store)

function* fetchNotes({ leadId }) {
  try {
    const data = yield call(adminLeadsAPI.listNotes, leadId);
    yield put({
      type: T.FETCH_LEAD_NOTES_SUCCESS,
      leadId,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: T.FETCH_LEAD_NOTES_FAILURE,
      leadId,
      error: e?.message || 'Failed to fetch notes',
    });
  }
}

function* createNote({ leadId, payload }) {
  try {
    const data = yield call(adminLeadsAPI.createNote, leadId, payload);
    yield put({
      type: T.CREATE_LEAD_NOTE_SUCCESS,
      leadId,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: T.CREATE_LEAD_NOTE_FAILURE,
      leadId,
      error: e?.message || 'Failed to create note',
    });
  }
}

function* updateNote({ leadId, noteId, payload }) {
  try {
    const data = yield call(adminLeadsAPI.updateNote, leadId, noteId, payload);
    yield put({
      type: T.UPDATE_LEAD_NOTE_SUCCESS,
      leadId,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: T.UPDATE_LEAD_NOTE_FAILURE,
      leadId,
      noteId,
      error: e?.message || 'Failed to update note',
    });
  }
}

function* deleteNote({ leadId, noteId }) {
  try {
    yield call(adminLeadsAPI.deleteNote, leadId, noteId);
    yield put({
      type: T.DELETE_LEAD_NOTE_SUCCESS,
      leadId,
      noteId,
    });
  } catch (e) {
    yield put({
      type: T.DELETE_LEAD_NOTE_FAILURE,
      leadId,
      noteId,
      error: e?.message || 'Failed to delete note',
    });
  }
}

export function* leadNotesWatcher() {
  yield all([
    takeLatest(T.FETCH_LEAD_NOTES_REQUEST, fetchNotes),
    takeLatest(T.CREATE_LEAD_NOTE_REQUEST, createNote),
    takeLatest(T.UPDATE_LEAD_NOTE_REQUEST, updateNote),
    takeLatest(T.DELETE_LEAD_NOTE_REQUEST, deleteNote),
  ]);
}
