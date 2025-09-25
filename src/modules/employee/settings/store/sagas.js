// src/modules/employee/settings/store/sagas.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { settingsAPI, employeeAPI } from '../../../../services/api';
import {
  FETCH_ME_REQUEST,
  FETCH_ME_SUCCESS,
  FETCH_ME_FAILURE,
  UPDATE_ME_REQUEST,
  UPDATE_ME_SUCCESS,
  UPDATE_ME_FAILURE,
  FETCH_EMERGENCY_CONTACTS_REQUEST,
  FETCH_EMERGENCY_CONTACTS_SUCCESS,
  FETCH_EMERGENCY_CONTACTS_FAILURE,
  CREATE_EMERGENCY_CONTACT_REQUEST,
  CREATE_EMERGENCY_CONTACT_SUCCESS,
  CREATE_EMERGENCY_CONTACT_FAILURE,
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

function* fetchEmergencyContactsSaga(action) {
  try {
    const list = yield call(
      settingsAPI.getEmergencyContacts,
      action.employeeId,
    );
    yield put({ type: FETCH_EMERGENCY_CONTACTS_SUCCESS, payload: list });
  } catch (e) {
    yield put({
      type: FETCH_EMERGENCY_CONTACTS_FAILURE,
      error: e?.message || 'Failed to load contacts',
    });
  }
}

function* createEmergencyContactSaga(action) {
  try {
    const created = yield call(
      settingsAPI.createEmergencyContact,
      action.employeeId,
      action.contact,
    );
    yield put({ type: CREATE_EMERGENCY_CONTACT_SUCCESS, payload: created });
    // refresh list to be safe
    yield put({
      type: FETCH_EMERGENCY_CONTACTS_REQUEST,
      employeeId: action.employeeId,
    });
  } catch (e) {
    yield put({
      type: CREATE_EMERGENCY_CONTACT_FAILURE,
      error: e?.message || 'Failed to create contact',
    });
  }
}

export function* employeeSettingsWatcher() {
  yield all([
    takeLatest(FETCH_ME_REQUEST, fetchMeSaga),
    takeLatest(UPDATE_ME_REQUEST, updateMeSaga),
    takeLatest(FETCH_EMERGENCY_CONTACTS_REQUEST, fetchEmergencyContactsSaga),
    takeLatest(CREATE_EMERGENCY_CONTACT_REQUEST, createEmergencyContactSaga),
  ]);
}
