import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { priorityAPI } from './priorityAPI';
import { select } from 'redux-saga/effects';
import { selectPriorities } from '../selectors';

/* ---------------- FETCH ---------------- */
function* fetchWorker() {
  try {
    const data = yield call(priorityAPI.list);

    yield put({
      type: T.FETCH_OK,
      payload: data,
    });
  } catch (err) {
    yield put({
      type: T.FETCH_ERR,
      error: err?.response?.data || err.message,
    });
  }
}

function* createWorker(action) {
  try {
    yield call(priorityAPI.create, action.payload);

    yield put({ type: T.CREATE_OK });

    // ✅ ONLY fetch (single source of truth)
    yield put({ type: T.FETCH_REQ });
  } catch (err) {
    yield put({
      type: T.CREATE_ERR,
      error: err?.response?.data || err.message,
    });
  }
}

/* ---------------- UPDATE ---------------- */
function* updateWorker(action) {
  try {
    const data = yield call(priorityAPI.update, action.id, action.payload);

    yield put({
      type: T.UPDATE_OK,
      payload: data,
    });

    yield put({ type: T.FETCH_REQ });
  } catch (err) {
    yield put({
      type: T.UPDATE_ERR,
      error: err?.response?.data || err.message,
    });
  }
}

/* ---------------- DELETE ---------------- */
function* deleteWorker(action) {
  try {
    yield call(priorityAPI.remove, action.id);

    yield put({
      type: T.DELETE_OK,
      id: action.id,
    });

    yield put({ type: T.FETCH_REQ });
  } catch (err) {
    yield put({
      type: T.DELETE_ERR,
      error: err?.response?.data || err.message,
    });
  }
}

/* ---------------- ASSIGN / UPDATE DEAL PRIORITY ---------------- */
function* assignDealPriorityWorker(action) {
  try {
    const { dealId, priorityId, hasExisting } = action;

    if (!hasExisting) {
      yield call(priorityAPI.assignToDeal, dealId, priorityId);
    } else {
      yield call(priorityAPI.updateDealPriority, dealId, priorityId);
    }

    // ✅ GET FULL PRIORITY OBJECT
    const priorities = yield select(selectPriorities);
    const priority = priorities.find(p => p.id === priorityId);

    // ✅ SEND FULL DATA
    yield put({
      type: 'kanban/UPDATE_DEAL_PRIORITY',
      dealId,
      priority, // 🔥 important
    });

    yield put({
      type: T.ASSIGN_DEAL_PRIORITY_OK,
    });
  } catch (err) {
    yield put({
      type: T.ASSIGN_DEAL_PRIORITY_ERR,
      error: err?.response?.data || err.message,
    });
  }
}

/* ---------------- REMOVE DEAL PRIORITY ---------------- */
function* removeDealPriorityWorker(action) {
  try {
    const { dealId } = action;

    yield call(priorityAPI.deleteFromDeal, dealId);

    // ✅ instant UI update
    yield put({
      type: 'kanban/REMOVE_DEAL_PRIORITY',
      dealId,
    });

    yield put({
      type: T.REMOVE_DEAL_PRIORITY_OK,
      dealId,
    });
  } catch (err) {
    yield put({
      type: T.REMOVE_DEAL_PRIORITY_ERR,
      error: err?.response?.data || err.message,
    });
  }
}

/* ---------------- ROOT SAGA ---------------- */
export default function* prioritySaga() {
  yield takeLatest(T.FETCH_REQ, fetchWorker);
  yield takeLatest(T.CREATE_REQ, createWorker);
  yield takeLatest(T.UPDATE_REQ, updateWorker);
  yield takeLatest(T.DELETE_REQ, deleteWorker);

  // 🔥 deal priority
  yield takeLatest(T.ASSIGN_DEAL_PRIORITY_REQ, assignDealPriorityWorker);
  yield takeLatest(T.REMOVE_DEAL_PRIORITY_REQ, removeDealPriorityWorker);
}
