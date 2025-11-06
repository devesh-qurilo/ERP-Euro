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
} from './types'; // <-- where you export those constants

// use your central api barrel (adjust path if needed)
import {
  adminAppreciationsAPI,
  adminAwardsAPI,
} from '../../../../../services/api';

// const msg = e =>
//   e?.response?.data?.message || e?.message || 'Something went wrong';

/* -------------------- Appreciations -------------------- */
function* fetchAppreciations() {
  try {
    const list = yield call(adminAppreciationsAPI.list);
    console.log('lisiiii', list);
    // yield put({ type: APPREC_SET, payload: list });
  } catch (e) {
    yield put({ type: APPREC_ERROR, error: e.message });
  }
}

// function* createApprec({ payload }) {
//   try {
//     yield put({ type: APPREC_BUSY, payload: true });
//     yield call(adminAppreciationsAPI.create, payload);
//     yield put({ type: APPREC_CLOSE_MODAL });
//     yield call(fetchAppreciations); // refresh
//   } catch (e) {
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   } finally {
//     yield put({ type: APPREC_BUSY, payload: false });
//   }
// }

// function* updateApprec({ payload }) {
//   const { id, data } = payload || {};
//   try {
//     yield put({ type: APPREC_BUSY, payload: true });
//     yield call(adminAppreciationsAPI.update, id, data);
//     yield put({ type: APPREC_CLOSE_MODAL });
//     yield call(fetchAppreciations);
//   } catch (e) {
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   } finally {
//     yield put({ type: APPREC_BUSY, payload: false });
//   }
// }

// function* deleteApprec({ payload }) {
//   // payload = id
//   try {
//     yield put({ type: APPREC_BUSY, payload: true });
//     yield call(adminAppreciationsAPI.remove, payload);
//     yield call(fetchAppreciations);
//   } catch (e) {
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   } finally {
//     yield put({ type: APPREC_BUSY, payload: false });
//   }
// }

// /* ----------------------- Awards ------------------------ */
// function* fetchAwards() {
//   try {
//     const list = yield call(adminAwardsAPI.list);
//     yield put({ type: AWARDS_SET, payload: list });
//   } catch (e) {
//     // reuse APPREC_ERROR so a single error banner can show (or add AWARDS_ERROR if you have it)
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   }
// }

// function* createAward({ payload }) {
//   try {
//     yield call(adminAwardsAPI.create, payload);
//     yield put({ type: AWARD_CLOSE_MODAL });
//     yield call(fetchAwards);
//   } catch (e) {
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   }
// }

// function* updateAward({ payload }) {
//   const { id, data } = payload || {};
//   try {
//     yield call(adminAwardsAPI.update, id, data);
//     yield put({ type: AWARD_CLOSE_MODAL });
//     yield call(fetchAwards);
//   } catch (e) {
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   }
// }

// function* toggleAward({ payload }) {
//   // payload = id
//   try {
//     yield call(adminAwardsAPI.toggleStatus, payload);
//     yield call(fetchAwards);
//   } catch (e) {
//     yield put({ type: APPREC_ERROR, error: msg(e) });
//   }
// }

/* ---------------------- Watchers ----------------------- */
export default function* appreciationsWatcher() {
  yield all([
    // Appreciations
    takeLatest(APPREC_FETCH, fetchAppreciations),
    // takeLatest(APPREC_CREATE, createApprec),
    // takeLatest(APPREC_UPDATE, updateApprec),
    // takeLatest(APPREC_DELETE, deleteApprec),

    // // Awards
    // takeLatest(AWARDS_FETCH, fetchAwards),
    // takeLatest(AWARDS_CREATE, createAward),
    // takeLatest(AWARDS_UPDATE, updateAward),
    // takeLatest(AWARDS_TOGGLE, toggleAward),
  ]);
}
