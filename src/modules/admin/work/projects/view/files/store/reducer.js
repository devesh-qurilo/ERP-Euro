import * as T from './types';

const initial = {
  projectId: null,
  items: [],
  loading: false,
  error: null,

  uploadOpen: false,
  uploadBusy: false,
  uploadPreset: null,

  busyIds: [],
};

export default function projectsViewFilesReducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        projectId: action.payload.projectId,
      };
    case T.LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        items: Array.isArray(action.payload) ? action.payload : [],
      };
    case T.LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Failed to load files',
      };

    case T.UPLOAD_OPEN:
      return {
        ...state,
        uploadOpen: true,
        uploadPreset: action.payload || null,
      };
    case T.UPLOAD_CLOSE:
      return { ...state, uploadOpen: false, uploadPreset: null };

    case T.UPLOAD_REQUEST:
      return { ...state, uploadBusy: true, error: null };
    case T.UPLOAD_SUCCESS:
      return {
        ...state,
        uploadBusy: false,
        uploadOpen: false,
        uploadPreset: null,
      };
    case T.UPLOAD_FAILURE:
      return {
        ...state,
        uploadBusy: false,
        error: action.payload || 'Upload failed',
      };

    case T.DELETE_REQUEST:
      return { ...state, busyIds: [...state.busyIds, action.payload.fileId] };
    case T.DELETE_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta?.fileId),
      };
    case T.DELETE_FAILURE:
      return {
        ...state,
        busyIds: state.busyIds.filter(id => id !== action.meta?.fileId),
        error: action.payload || 'Delete failed',
      };

    default:
      return state;
  }
}
