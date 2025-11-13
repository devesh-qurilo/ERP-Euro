// src/modules/admin/leads/notes/store/reducer.js
import * as T from './types';

const initial = {
  leadId: null, // current lead whose notes are loaded
  list: [], // notes for that lead
  loading: false,
  error: null,

  creating: false,
  createError: null,

  busyIds: {}, // per-note busy (update/delete)
};

export default function leadNotesReducer(state = initial, action) {
  switch (action.type) {
    // ===== FETCH =====
    case T.FETCH_LEAD_NOTES_REQUEST:
      return {
        ...state,
        leadId: action.leadId,
        loading: true,
        error: null,
      };

    case T.FETCH_LEAD_NOTES_SUCCESS:
      // only update if leadId still same
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        loading: false,
        list: action.payload || [],
      };

    case T.FETCH_LEAD_NOTES_FAILURE:
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        loading: false,
        error: action.error || 'Failed to load notes',
      };

    // ===== CREATE =====
    case T.CREATE_LEAD_NOTE_REQUEST:
      return {
        ...state,
        creating: true,
        createError: null,
      };

    case T.CREATE_LEAD_NOTE_SUCCESS:
      // only push if this note belongs to current lead
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        creating: false,
        list: [action.payload, ...state.list],
      };

    case T.CREATE_LEAD_NOTE_FAILURE:
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        creating: false,
        createError: action.error || 'Failed to create note',
      };

    // ===== UPDATE / DELETE mark busy =====
    case T.UPDATE_LEAD_NOTE_REQUEST:
    case T.DELETE_LEAD_NOTE_REQUEST:
      return {
        ...state,
        busyIds: {
          ...state.busyIds,
          [action.noteId]: true,
        },
      };

    case T.UPDATE_LEAD_NOTE_SUCCESS:
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        list: state.list.map(n =>
          n.id === action.payload.id ? action.payload : n,
        ),
        busyIds: {
          ...state.busyIds,
          [action.payload.id]: false,
        },
      };

    case T.DELETE_LEAD_NOTE_SUCCESS:
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        list: state.list.filter(n => n.id !== action.noteId),
        busyIds: {
          ...state.busyIds,
          [action.noteId]: false,
        },
      };

    case T.UPDATE_LEAD_NOTE_FAILURE:
    case T.DELETE_LEAD_NOTE_FAILURE:
      if (state.leadId !== action.leadId) return state;
      return {
        ...state,
        busyIds: {
          ...state.busyIds,
          [action.noteId]: false,
        },
        error: action.error || 'Action failed',
      };

    default:
      return state;
  }
}
