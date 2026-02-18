import * as T from './types';

// comments
export const fetchComments = dealId => ({ type: T.COMMENTS_FETCH_REQ, dealId });
export const addComment = (dealId, payload) => ({
  type: T.COMMENT_ADD_REQ,
  dealId,
  payload,
});
export const updateComment = (dealId, commentId, payload) => ({
  type: T.COMMENT_UPD_REQ,
  dealId,
  commentId,
  payload,
});
export const deleteComment = (dealId, commentId) => ({
  type: T.COMMENT_DEL_REQ,
  dealId,
  commentId,
});

// tags
export const fetchTags = dealId => ({ type: T.TAGS_FETCH_REQ, dealId });
export const addTag = (dealId, payload) => ({
  type: T.TAG_ADD_REQ,
  dealId,
  payload,
});
export const deleteTag = (dealId, tagId) => ({
  type: T.TAG_DEL_REQ,
  dealId,
  tagId,
});

// documents
export const fetchDocs = dealId => ({ type: T.DOCS_FETCH_REQ, dealId });
export const uploadDoc = (dealId, file) => ({
  type: T.DOC_UPLOAD_REQ,
  dealId,
  file,
});

// notes
export const fetchNotes = dealId => ({ type: T.NOTES_FETCH_REQ, dealId });
export const addNote = (dealId, payload) => ({
  type: T.NOTE_ADD_REQ,
  dealId,
  payload,
});
export const updateNote = (dealId, noteId, payload) => ({
  type: T.NOTE_UPD_REQ,
  dealId,
  noteId,
  payload,
});

export const deleteNote = (dealId, noteId) => ({
  type: T.NOTE_DEL_REQ,
  dealId,
  noteId,
});

// followups
export const fetchFollowups = dealId => ({ type: T.FUPS_FETCH_REQ, dealId });
export const addFollowup = (dealId, payload) => ({
  type: T.FUP_ADD_REQ,
  dealId,
  payload,
});
export const updateFollowup = (dealId, followupId, payload) => ({
  type: T.FUP_UPD_REQ,
  dealId,
  followupId,
  payload,
});

export const deleteFollowup = (dealId, followupId) => ({
  type: T.FUP_DEL_REQ,
  dealId,
  followupId,
});

// ui
export const setBusy = busy => ({ type: T.SET_BUSY, busy });
