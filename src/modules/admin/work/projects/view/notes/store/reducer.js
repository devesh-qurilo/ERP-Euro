import * as T from './types';

const initial = {
  projectId: null,
  items: [],
  loading: false,
  error: null,

  createOpen: false,
  createBusy: false,
  createPreset: null,

  busyIds: [],
};

export default function AdminprojectNotesReducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_BY_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        projectId: action.payload.projectId,
      };
    case T.LIST_BY_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: Array.isArray(action.payload) ? action.payload : [],
      };
    case T.LIST_BY_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Failed to load notes',
      };

    case T.CREATE_OPEN:
      return {
        ...state,
        createOpen: true,
        createPreset: action.payload || null,
      };
    case T.CREATE_CLOSE:
      return { ...state, createOpen: false, createPreset: null };

    case T.CREATE_REQUEST:
      return { ...state, createBusy: true };
    case T.CREATE_SUCCESS:
      return {
        ...state,
        createBusy: false,
        createOpen: false,
        createPreset: null,
      };
    case T.CREATE_FAILURE:
      return {
        ...state,
        createBusy: false,
        error: action.payload || 'Failed to create note',
      };

    case T.DELETE_REQUEST:
      return { ...state, busyIds: [...state.busyIds, action.payload.noteId] };
    case T.DELETE_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta?.noteId),
      };
    case T.DELETE_FAILURE:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta?.noteId),
        error: action.payload || 'Failed to delete note',
      };

    default:
      return state;
  }
}
