// src/modules/admin/hr/appreciations/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  APPREC_FETCH,
  APPREC_SET,
  APPREC_ERROR,
  APPREC_CREATE,
  APPREC_UPDATE,
  APPREC_DELETE,
  APPREC_BUSY,
  APPREC_CLOSE_MODAL,
  AWARDS_FETCH,
  AWARDS_SET,
  AWARDS_CREATE,
  AWARDS_UPDATE,
  AWARDS_TOGGLE,
  AWARD_CLOSE_MODAL,
} from './types';

import {
  adminAppreciationsAPI,
  adminAwardsAPI,
} from '../../../../../services/api';

// small helper to format error messages safely
const msg = e =>
  e?.response?.data?.message ||
  e?.message ||
  String(e) ||
  'Something went wrong';

/* -------------------- Appreciations -------------------- */
function* fetchAppreciations() {
  try {
    const list = yield call(adminAppreciationsAPI.list);
    // list is expected as array from service (your service returns r.data already)
    // reducer expects action.items — keep that consistent
    yield put({ type: APPREC_SET, items: list });
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  }
}

function* createApprec(action) {
  const payload = action?.payload;
  try {
    console.log('createApprec', payload);
    yield put({ type: APPREC_BUSY, payload: true });
    yield call(adminAppreciationsAPI.create, payload);
    yield put({ type: APPREC_CLOSE_MODAL });
    // refresh
    yield call(fetchAppreciations);
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  } finally {
    yield put({ type: APPREC_BUSY, payload: false });
  }
}

function* updateApprec(action) {
  // action shape: { type, id, payload }
  const { id, payload } = action || {};
  try {
    console.log('updateApprec', payload);
    yield put({ type: APPREC_BUSY, payload: true });
    yield call(adminAppreciationsAPI.update, id, payload);
    yield put({ type: APPREC_CLOSE_MODAL });
    yield call(fetchAppreciations);
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  } finally {
    yield put({ type: APPREC_BUSY, payload: false });
  }
}

function* deleteApprec(action) {
  // action shape: { type, id }
  const id = action?.id ?? action?.payload;
  try {
    yield put({ type: APPREC_BUSY, payload: true });
    yield call(adminAppreciationsAPI.remove, id);
    yield call(fetchAppreciations);
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  } finally {
    yield put({ type: APPREC_BUSY, payload: false });
  }
}

/* ----------------------- Awards ------------------------ */
function* fetchAwards() {
  try {
    const list = yield call(adminAwardsAPI.list);
    // reducer expects action.items
    yield put({ type: AWARDS_SET, items: list });
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  }
}

function* createAward(action) {
  const payload = action?.payload;
  try {
    yield call(adminAwardsAPI.create, payload);
    yield put({ type: AWARD_CLOSE_MODAL });
    yield call(fetchAwards);
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  }
}

function* updateAward(action) {
  const { id, payload } = action || {};
  try {
    yield call(adminAwardsAPI.update, id, payload);
    yield put({ type: AWARD_CLOSE_MODAL });
    yield call(fetchAwards);
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  }
}

function* toggleAward(action) {
  // action shape: { type, id }
  const id = action?.id ?? action?.payload;
  try {
    yield call(adminAwardsAPI.toggleStatus, id);
    yield call(fetchAwards);
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: msg(e) });
  }
}

/* ---------------------- Watchers ----------------------- */
export default function* appreciationsWatcher() {
  yield all([
    // Appreciations
    takeLatest(APPREC_FETCH, fetchAppreciations),
    takeLatest(APPREC_CREATE, createApprec),
    takeLatest(APPREC_UPDATE, updateApprec),
    takeLatest(APPREC_DELETE, deleteApprec),

    // Awards
    takeLatest(AWARDS_FETCH, fetchAwards),
    takeLatest(AWARDS_CREATE, createAward),
    takeLatest(AWARDS_UPDATE, updateAward),
    takeLatest(AWARDS_TOGGLE, toggleAward),
  ]);
}
