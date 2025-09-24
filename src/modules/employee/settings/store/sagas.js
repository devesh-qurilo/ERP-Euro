// src/modules/employee/settings/store/sagas.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { employeeAPI } from '../../../../services/api';
import {
  FETCH_ME_REQUEST,
  FETCH_ME_SUCCESS,
  FETCH_ME_FAILURE,
  UPDATE_ME_REQUEST,
  UPDATE_ME_SUCCESS,
  UPDATE_ME_FAILURE,
} from './actions';

function* fetchMeSaga() {
  try {
    const data = yield call(employeeAPI.getProfile);
    yield put({ type: FETCH_ME_SUCCESS, payload: data });
  } catch (err) {
    yield put({
      type: FETCH_ME_FAILURE,
      error: err?.message || 'Failed to load profile',
    });
  }
}

function* updateMeSaga(action) {
  try {
    const { employee, profilePictureFile } = action.payload || {};
    const fd = new FormData();
    fd.append('employee', JSON.stringify(employee || {}));
    if (profilePictureFile?.uri) {
      fd.append('profilePicture', {
        uri: profilePictureFile.uri,
        name: profilePictureFile.name || 'profile.jpg',
        type: profilePictureFile.type || 'image/jpeg',
      });
    }
    // 👉 this now sends a PUT because employeeAPI.updateMe uses api.put
    const updated = yield call(employeeAPI.updateMe, fd);
    yield put({ type: UPDATE_ME_SUCCESS, payload: updated });
  } catch (err) {
    yield put({
      type: UPDATE_ME_FAILURE,
      error: err?.message || 'Failed to save changes',
    });
  }
}

export function* employeeSettingsWatcher() {
  yield all([
    takeLatest(FETCH_ME_REQUEST, fetchMeSaga),
    takeLatest(UPDATE_ME_REQUEST, updateMeSaga),
  ]);
}
