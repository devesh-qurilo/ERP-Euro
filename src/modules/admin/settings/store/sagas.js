import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as T from './types';
import {
  adminProfileUpdateSuccess,
  adminProfileUpdateFailure,
  adminCompanyFetchSuccess,
  adminCompanyFetchFailure,
  adminCompanySaveSuccess,
  adminCompanySaveFailure,
} from './actions';
import { adminSettingsAPI } from '../../../../services/api';

// Profile
function* updateProfile({ payload }) {
  try {
    const data = yield call(adminSettingsAPI.updateMe, payload);
    yield put(adminProfileUpdateSuccess(data));
  } catch (e) {
    yield put(adminProfileUpdateFailure(e?.message || 'Update failed'));
  }
}

// Company
function* fetchCompany() {
  try {
    const data = yield call(adminSettingsAPI.getCompany);
    yield put(adminCompanyFetchSuccess(data));
  } catch (e) {
    yield put(adminCompanyFetchFailure(e?.message || 'Fetch failed'));
  }
}

function* saveCompany({ payload }) {
  try {
    const data = yield call(adminSettingsAPI.upsertCompany, payload);
    yield put(adminCompanySaveSuccess(data));
  } catch (e) {
    yield put(adminCompanySaveFailure(e?.message || 'Save failed'));
  }
}

export function* adminSettingsWatcher() {
  yield all([
    takeLatest(T.ADMIN_PROFILE_UPDATE_REQUEST, updateProfile),
    takeLatest(T.ADMIN_COMPANY_FETCH_REQUEST, fetchCompany),
    takeLatest(T.ADMIN_COMPANY_SAVE_REQUEST, saveCompany),
  ]);
}
