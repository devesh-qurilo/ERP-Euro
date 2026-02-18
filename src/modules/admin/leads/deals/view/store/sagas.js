import { call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminDealViewAPI } from '../../../../../../services/api';
import { setBusy } from './actions';

// helper
function* safeCall(fn, ...args) {
  return yield call(fn, ...args);
}

// COMMENTS
function* commentsFetch({ dealId }) {
  try {
    const data = yield safeCall(adminDealViewAPI.listComments, dealId);
    yield put({ type: T.COMMENTS_FETCH_OK, data });
  } catch (error) {
    yield put({ type: T.COMMENTS_FETCH_ERR, error });
  }
}
function* commentAdd({ dealId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(adminDealViewAPI.addComment, dealId, payload);
    yield put({ type: T.COMMENT_ADD_OK, data });
  } catch (error) {
    yield put({ type: T.COMMENT_ADD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* commentUpd({ dealId, commentId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(
      adminDealViewAPI.updateComment,
      dealId,
      commentId,
      payload,
    );
    yield put({ type: T.COMMENT_UPD_OK, data });
  } catch (error) {
    yield put({ type: T.COMMENT_UPD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* commentDel({ dealId, commentId }) {
  try {
    yield put(setBusy(true));
    yield safeCall(adminDealViewAPI.deleteComment, dealId, commentId);
    yield put({ type: T.COMMENT_DEL_OK, commentId });
  } catch (error) {
    yield put({ type: T.COMMENT_DEL_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

// TAGS
function* tagsFetch({ dealId }) {
  try {
    const data = yield safeCall(adminDealViewAPI.listTags, dealId);
    yield put({ type: T.TAGS_FETCH_OK, data });
  } catch (error) {
    yield put({ type: T.TAGS_FETCH_ERR, error });
  }
}
function* tagAdd({ dealId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(adminDealViewAPI.addTag, dealId, payload);
    yield put({ type: T.TAG_ADD_OK, data, payload });
  } catch (error) {
    yield put({ type: T.TAG_ADD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* tagDel({ dealId, tagId }) {
  try {
    yield put(setBusy(true));

    yield call(adminDealViewAPI.deleteTag, dealId, tagId);

    // 🔥 refetch list
    const data = yield call(adminDealViewAPI.listTags, dealId);
    yield put({ type: T.TAGS_FETCH_OK, data });
  } catch (error) {
    yield put({ type: T.TAG_DEL_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

// DOCS
function* docsFetch({ dealId }) {
  try {
    const data = yield safeCall(adminDealViewAPI.listDocuments, dealId);
    yield put({ type: T.DOCS_FETCH_OK, data });
  } catch (error) {
    yield put({ type: T.DOCS_FETCH_ERR, error });
  }
}
function* docUpload({ dealId, file }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(adminDealViewAPI.uploadDocument, dealId, file);
    yield put({ type: T.DOC_UPLOAD_OK, data });
  } catch (error) {
    yield put({ type: T.DOC_UPLOAD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

// NOTES
function* notesFetch({ dealId }) {
  try {
    const data = yield safeCall(adminDealViewAPI.listNotes, dealId);
    yield put({ type: T.NOTES_FETCH_OK, data });
  } catch (error) {
    yield put({ type: T.NOTES_FETCH_ERR, error });
  }
}
function* noteAdd({ dealId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(adminDealViewAPI.addNote, dealId, payload);
    yield put({ type: T.NOTE_ADD_OK, data });
  } catch (error) {
    yield put({ type: T.NOTE_ADD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* noteUpd({ dealId, noteId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(
      adminDealViewAPI.updateNote,
      dealId,
      noteId,
      payload,
    );
    yield put({ type: T.NOTE_UPD_OK, data });
  } catch (error) {
    yield put({ type: T.NOTE_UPD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

function* deleteNoteSaga({ dealId, noteId }) {
  try {
    yield call(adminDealViewAPI.deleteNote, dealId, noteId);

    yield put({ type: T.NOTE_DEL_OK, noteId });
  } catch (e) {
    yield put({ type: T.NOTE_DEL_FAIL, error: e.message });
  }
}

// FOLLOWUPS
function* fupsFetch({ dealId }) {
  try {
    const data = yield safeCall(adminDealViewAPI.listFollowups, dealId);
    yield put({ type: T.FUPS_FETCH_OK, data });
  } catch (error) {
    yield put({ type: T.FUPS_FETCH_ERR, error });
  }
}
function* fupAdd({ dealId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(adminDealViewAPI.addFollowup, dealId, payload);
    yield put({ type: T.FUP_ADD_OK, data });
  } catch (error) {
    yield put({ type: T.FUP_ADD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* fupUpd({ dealId, followupId, payload }) {
  try {
    yield put(setBusy(true));
    const data = yield safeCall(
      adminDealViewAPI.updateFollowup,
      dealId,
      followupId,
      payload,
    );
    yield put({ type: T.FUP_UPD_OK, data });
  } catch (error) {
    yield put({ type: T.FUP_UPD_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}
function* fupDel({ dealId, followupId }) {
  try {
    yield put(setBusy(true));
    yield safeCall(adminDealViewAPI.deleteFollowup, dealId, followupId);

    yield put({
      type: T.FUP_DEL_OK,
      followupId,
    });
  } catch (error) {
    yield put({ type: T.FUP_DEL_ERR, error });
  } finally {
    yield put(setBusy(false));
  }
}

export default function* dealsViewWatcher() {
  yield takeLatest(T.COMMENTS_FETCH_REQ, commentsFetch);
  yield takeLatest(T.COMMENT_ADD_REQ, commentAdd);
  yield takeLatest(T.COMMENT_UPD_REQ, commentUpd);
  yield takeLatest(T.COMMENT_DEL_REQ, commentDel);

  yield takeLatest(T.TAGS_FETCH_REQ, tagsFetch);
  yield takeLatest(T.TAG_ADD_REQ, tagAdd);
  yield takeLatest(T.TAG_DEL_REQ, tagDel);

  yield takeLatest(T.DOCS_FETCH_REQ, docsFetch);
  yield takeLatest(T.DOC_UPLOAD_REQ, docUpload);

  yield takeLatest(T.NOTES_FETCH_REQ, notesFetch);
  yield takeLatest(T.NOTE_ADD_REQ, noteAdd);
  yield takeLatest(T.NOTE_UPD_REQ, noteUpd);
  yield takeLatest(T.NOTE_DEL_REQ, deleteNoteSaga);

  yield takeLatest(T.FUPS_FETCH_REQ, fupsFetch);
  yield takeLatest(T.FUP_ADD_REQ, fupAdd);
  yield takeLatest(T.FUP_UPD_REQ, fupUpd);
  yield takeLatest(T.FUP_DEL_REQ, fupDel);
}
