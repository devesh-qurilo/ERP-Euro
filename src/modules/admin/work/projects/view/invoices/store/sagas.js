// src/modules/admin/work/projects/view/invoices/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { projectInvoicesAPI } from '../../../../../../../services/api';

function* listByProjectSaga({ payload: { projectId } }) {
  try {
    const data = yield call(projectInvoicesAPI.listByProject, projectId);
    yield put({ type: T.LIST_BY_PROJECT_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.LIST_BY_PROJECT_FAILURE,
      payload: e?.message || 'Failed to load project invoices',
    });
  }
}

export function* projectViewInvoicesWatcher() {
  yield all([takeLatest(T.LIST_BY_PROJECT_REQUEST, listByProjectSaga)]);
}

export default function* projectViewInvoicesSaga() {
  yield projectViewInvoicesWatcher();
}
