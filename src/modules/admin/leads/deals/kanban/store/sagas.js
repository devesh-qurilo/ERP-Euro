import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { stagesAPI, adminDealsAPI } from '../../../../../../services/api';
import { setBusy } from './actions';

// helper: group deals by stage name
function groupByStage(stages, deals) {
  const columns = {};
  // initialize with all stages (use stage.name)
  stages.forEach(s => {
    columns[s.name] = [];
  });
  // fallback column for unknown stages
  columns['Unassigned'] = columns['Unassigned'] || [];

  (deals || []).forEach(d => {
    const name = d.dealStage || d.stage || 'Unassigned';
    if (!columns[name]) columns[name] = [];
    columns[name].push(d);
  });
  return columns;
}

// FETCH whole kanban: stages + deals
function* fetchWorker() {
  try {
    yield put(setBusy(true));
    const stages = yield call(stagesAPI.list);
    // fetch all deals (you may pass large size; default behavior of your API)
    const deals = yield call(adminDealsAPI.list, { page: 0, size: 1000 });
    // if your API returns object with content, adapt:
    const dealsArray = Array.isArray(deals) ? deals : deals?.content ?? [];
    const columns = groupByStage(stages, dealsArray);
    yield put({ type: T.FETCH_OK, stages, columns });
  } catch (error) {
    yield put({ type: T.FETCH_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

// Move card (change dealStage on server)
function* moveCardWorker({ dealId, toStageName }) {
  try {
    yield put(setBusy(true));
    // update deal stage on server (payload depends on backend: we set dealStage)
    yield call(adminDealsAPI.update, dealId, { dealStage: toStageName });
    // re-fetch to get fresh ordering & meta
    yield call(fetchWorker);
    yield put({ type: T.MOVE_CARD_OK });
  } catch (error) {
    yield put({ type: T.MOVE_CARD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

// Stage management
function* createStageWorker({ payload }) {
  try {
    yield put(setBusy(true));
    yield call(stagesAPI.create, payload);
    yield call(fetchWorker);
    yield put({ type: T.STAGE_CREATE_OK });
  } catch (error) {
    yield put({ type: T.STAGE_CREATE_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* updateStageWorker({ id, payload }) {
  try {
    yield put(setBusy(true));
    yield call(stagesAPI.update, id, payload);
    yield call(fetchWorker);
    yield put({ type: T.STAGE_UPDATE_OK });
  } catch (error) {
    yield put({ type: T.STAGE_UPDATE_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* deleteStageWorker({ id }) {
  try {
    yield put(setBusy(true));
    yield call(stagesAPI.remove, id);
    yield call(fetchWorker);
    yield put({ type: T.STAGE_DELETE_OK });
  } catch (error) {
    yield put({ type: T.STAGE_DELETE_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

export default function* kanbanWatcher() {
  yield takeLatest(T.FETCH_REQ, fetchWorker);
  yield takeLatest(T.MOVE_CARD_REQ, moveCardWorker);

  yield takeLatest(T.STAGE_CREATE_REQ, createStageWorker);
  yield takeLatest(T.STAGE_UPDATE_REQ, updateStageWorker);
  yield takeLatest(T.STAGE_DELETE_REQ, deleteStageWorker);
}
