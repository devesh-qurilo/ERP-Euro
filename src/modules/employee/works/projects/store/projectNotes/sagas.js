import { call, put, takeLatest } from 'redux-saga/effects';
import { projectsAPI } from '../../../../../../services/api';
import {
  FETCH_PROJECT_NOTES_REQUEST,
  FETCH_PROJECT_NOTES_SUCCESS,
  FETCH_PROJECT_NOTES_FAILURE,
} from './types';

function* fetchNotesSaga({ projectId }) {
  try {
    const data = yield call(projectsAPI.getProjectNotes, projectId);
    yield put({ type: FETCH_PROJECT_NOTES_SUCCESS, projectId, payload: data });
  } catch (e) {
    yield put({
      type: FETCH_PROJECT_NOTES_FAILURE,
      projectId,
      error: e?.message || 'Failed to load notes',
    });
  }
}

export function* projectNotesWatcher() {
  yield takeLatest(FETCH_PROJECT_NOTES_REQUEST, fetchNotesSaga);
}
