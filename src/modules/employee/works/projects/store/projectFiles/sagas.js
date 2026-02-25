import { call, put, takeLatest } from 'redux-saga/effects';
import { projectFilesAPI } from '../../../../../../services/api';
import * as T from './types';
import {
  fetchProjectFilesSuccess,
  fetchProjectFilesFailure,
  uploadProjectFileSuccess,
  uploadProjectFileFailure,
} from './actions';

function* fetchProjectFilesSaga({ payload: { projectId } }) {
  try {
    const items = yield call(projectFilesAPI.list, projectId);
    yield put(fetchProjectFilesSuccess(projectId, items));
  } catch (e) {
    yield put(fetchProjectFilesFailure(e?.message || 'Failed to load files'));
  }
}

function* uploadProjectFileSaga({ payload: { projectId, file } }) {
  try {
    const item = yield call(projectFilesAPI.upload, projectId, file);
    // append freshly uploaded file at top
    // console.log('deveshhhhh', item);
    yield put(uploadProjectFileSuccess(item));
    // console.log('deveshoo', item);
    // optional: refresh list from server
    const items = yield call(projectFilesAPI.list, projectId);
    yield put(fetchProjectFilesSuccess(projectId, items));
  } catch (e) {
    yield put(uploadProjectFileFailure(e?.message || 'Upload failed'));
  }
}

export function* projectFilesWatcher() {
  yield takeLatest(T.FETCH_PROJECT_FILES_REQUEST, fetchProjectFilesSaga);
  yield takeLatest(T.UPLOAD_PROJECT_FILE_REQUEST, uploadProjectFileSaga);
}
