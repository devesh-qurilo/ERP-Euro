import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { AdminprojectFilesAPI } from '../../../../../../../services/api';

function* listSaga({ payload: { projectId } }) {
  try {
    const data = yield call(AdminprojectFilesAPI.list, projectId);
    yield put({ type: T.LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.LIST_FAILURE, payload: e?.message });
  }
}

function* uploadSaga({ payload: { projectId, file } }) {
  try {
    yield call(AdminprojectFilesAPI.upload, projectId, file);
    yield put({ type: T.UPLOAD_SUCCESS });
    yield put({ type: T.LIST_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({ type: T.UPLOAD_FAILURE, payload: e?.message });
  }
}

function* deleteSaga({ payload: { fileId, projectId } }) {
  try {
    yield call(AdminprojectFilesAPI.remove, fileId);
    yield put({ type: T.DELETE_SUCCESS, meta: { fileId } });
    yield put({ type: T.LIST_REQUEST, payload: { projectId } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message,
      meta: { fileId },
    });
  }
}

export function* projectsViewFilesWatcher() {
  yield all([
    takeLatest(T.LIST_REQUEST, listSaga),
    takeLatest(T.UPLOAD_REQUEST, uploadSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),
  ]);
}

export default function* projectsViewFilesSaga() {
  yield projectsViewFilesWatcher();
}
