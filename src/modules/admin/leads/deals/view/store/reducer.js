import * as T from './types';

const initial = {
  busy: false,
  error: null,
  comments: [],
  tags: [], // NOTE: backend returns array of strings
  documents: [],
  notes: [],
  followups: [],
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_BUSY:
      return { ...state, busy: action.busy };

    // COMMENTS
    case T.COMMENTS_FETCH_OK:
      return { ...state, comments: action.data || [] };
    case T.COMMENT_ADD_OK:
      return { ...state, comments: [...(state.comments || []), action.data] };
    case T.COMMENT_UPD_OK: {
      const upd = action.data;
      return {
        ...state,
        comments: (state.comments || []).map(c => (c.id === upd.id ? upd : c)),
      };
    }
    case T.COMMENT_DEL_OK:
      return {
        ...state,
        comments: (state.comments || []).filter(c => c.id !== action.commentId),
      };

    // TAGS
    case T.TAGS_FETCH_OK:
      return { ...state, tags: action.data || [] };
    case T.TAG_ADD_OK:
      return {
        ...state,
        tags: [
          ...(state.tags || []),
          action.data?.tagName ?? action.payload?.tagName,
        ],
      };
    case T.TAG_DEL_OK:
      return {
        ...state,
        tags: (state.tags || []).filter(
          (_, idx) => String(idx + 1) !== String(action.tagId),
        ),
      };

    // DOCS
    case T.DOCS_FETCH_OK:
      return { ...state, documents: action.data || [] };
    case T.DOC_UPLOAD_OK:
      return { ...state, documents: [action.data, ...(state.documents || [])] };

    // NOTES
    case T.NOTES_FETCH_OK:
      return { ...state, notes: action.data || [] };
    case T.NOTE_ADD_OK:
      return { ...state, notes: [action.data, ...(state.notes || [])] };
    case T.NOTE_UPD_OK: {
      const upd = action.data;

      return {
        ...state,
        notes: (state.notes || []).map(n => (n.id === upd.id ? upd : n)),
      };
    }

    case T.NOTE_DEL_OK:
      return {
        ...state,
        notes: state.notes.filter(n => n.id !== action.noteId),
      };

    // FUPS
    case T.FUPS_FETCH_OK:
      return { ...state, followups: action.data || [] };
    case T.FUP_ADD_OK:
      return { ...state, followups: [action.data, ...(state.followups || [])] };
    case T.FUP_UPD_OK: {
      const upd = action.data;
      return {
        ...state,
        followups: (state.followups || []).map(f =>
          f.id === upd.id ? upd : f,
        ),
      };
    }
    case T.FUPS_FETCH_OK:
      return { ...state, followups: action.data };

    case T.FUP_ADD_OK:
      return {
        ...state,
        followups: [action.data, ...state.followups],
      };

    case T.FUP_UPD_OK:
      return {
        ...state,
        followups: state.followups.map(f =>
          f.id === action.data.id ? action.data : f,
        ),
      };

    case T.FUP_DEL_OK:
      return {
        ...state,
        followups: state.followups.filter(f => f.id !== action.followupId),
      };

    // ERRORS
    case T.COMMENTS_FETCH_ERR:
    case T.COMMENT_ADD_ERR:
    case T.COMMENT_UPD_ERR:
    case T.COMMENT_DEL_ERR:
    case T.TAGS_FETCH_ERR:
    case T.TAG_ADD_ERR:
    case T.TAG_DEL_ERR:
    case T.DOCS_FETCH_ERR:
    case T.DOC_UPLOAD_ERR:
    case T.NOTES_FETCH_ERR:
    case T.NOTE_ADD_ERR:
    case T.NOTE_UPD_ERR:
    case T.FUPS_FETCH_ERR:
    case T.FUP_ADD_ERR:
    case T.FUP_UPD_ERR:
      return { ...state, error: action.error };

    default:
      return state;
  }
}
