import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import * as T from './types';
import { clientsAPI as API } from '../../../../services/api';

function* listSaga({ payload: { filters } }) {
  try {
    const data = yield call(API.list, filters);
    yield put({ type: T.LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: T.LIST_FAILURE, payload: e?.message || 'Load failed' });
  }
}

const getFilters = s => s.admin.clients.filters;

function* createSaga({ payload }) {
  try {
    yield call(API.create, payload);
    yield put({ type: T.CREATE_SUCCESS });
    const f = yield select(getFilters);
    yield put({ type: T.LIST_REQUEST, payload: { filters: f } });
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

function* updateSaga({ payload: { id, ...rest } }) {
  try {
    yield call(API.update, id, rest);
    yield put({ type: T.UPDATE_SUCCESS });
    const f = yield select(getFilters);
    yield put({ type: T.LIST_REQUEST, payload: { filters: f } });
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message || 'Update failed',
    });
  }
}

function* deleteSaga({ payload: { id } }) {
  try {
    yield call(API.remove, id);
    yield put({ type: T.DELETE_SUCCESS });
    const f = yield select(getFilters);
    yield put({ type: T.LIST_REQUEST, payload: { filters: f } });
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

/* --- Category sagas --- */
function* categoryListSaga() {
  try {
    const data = yield call(API.getCategories); // <--- implement in clientsAPI or rename accordingly
    console.log('devesh category', data);
    yield put({ type: T.CATEGORY_LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.CATEGORY_LIST_FAILURE,
      payload: e?.message || 'Category load failed',
    });
  }
}

function* categoryCreateSaga({ payload }) {
  try {
    // payload { categoryName: 'Sales' } per your API spec
    yield call(API.createCategory, payload);
    yield put({ type: T.CATEGORY_CREATE_SUCCESS });
    // refresh list
    yield put({ type: T.CATEGORY_LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.CATEGORY_CREATE_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

function* categoryDeleteSaga({ payload: { id } }) {
  try {
    yield call(API.deleteCategory, id);
    yield put({ type: T.CATEGORY_DELETE_SUCCESS });
    yield put({ type: T.CATEGORY_LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.CATEGORY_DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

/* --- SubCategory sagas --- */
function* subCategoryListSaga() {
  try {
    const data = yield call(API.getSubcategories); // <--- implement or rename
    console.log('devesh subcategory', data);
    yield put({ type: T.SUBCATEGORY_LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.SUBCATEGORY_LIST_FAILURE,
      payload: e?.message || 'Subcategory load failed',
    });
  }
}

function* subCategoryCreateSaga({ payload }) {
  try {
    // payload { subCategoryName: 'Gold' }
    yield call(API.createSubcategory, payload);
    yield put({ type: T.SUBCATEGORY_CREATE_SUCCESS });
    yield put({ type: T.SUBCATEGORY_LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.SUBCATEGORY_CREATE_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

function* subCategoryDeleteSaga({ payload: { id } }) {
  try {
    yield call(API.deleteSubcategory, id);
    yield put({ type: T.SUBCATEGORY_DELETE_SUCCESS });
    yield put({ type: T.SUBCATEGORY_LIST_REQUEST });
  } catch (e) {
    yield put({
      type: T.SUBCATEGORY_DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

export function* clientsWatcher() {
  yield all([
    takeLatest(T.LIST_REQUEST, listSaga),
    takeLatest(T.CREATE_REQUEST, createSaga),
    takeLatest(T.UPDATE_REQUEST, updateSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),

    /* categories */
    takeLatest(T.CATEGORY_LIST_REQUEST, categoryListSaga),
    takeLatest(T.CATEGORY_CREATE_REQUEST, categoryCreateSaga),
    takeLatest(T.CATEGORY_DELETE_REQUEST, categoryDeleteSaga),

    /* subcategories */
    takeLatest(T.SUBCATEGORY_LIST_REQUEST, subCategoryListSaga),
    takeLatest(T.SUBCATEGORY_CREATE_REQUEST, subCategoryCreateSaga),
    takeLatest(T.SUBCATEGORY_DELETE_REQUEST, subCategoryDeleteSaga),
  ]);
}
export default function* clientsSaga() {
  yield clientsWatcher();
}
