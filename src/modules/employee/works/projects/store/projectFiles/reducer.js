import {
  FETCH_PROJECT_FILES_REQUEST,
  FETCH_PROJECT_FILES_SUCCESS,
  FETCH_PROJECT_FILES_FAILURE,
  UPLOAD_PROJECT_FILE_REQUEST,
  UPLOAD_PROJECT_FILE_SUCCESS,
  UPLOAD_PROJECT_FILE_FAILURE,
  CLEAR_PROJECT_FILES,
} from './types';

const initialState = {
  byProject: {}, // { [projectId]: Array<File> }
  loading: false,
  uploading: false,
  error: null,
};

export default function projectFilesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROJECT_FILES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROJECT_FILES_SUCCESS: {
      const { projectId, items } = action.payload;
      return {
        ...state,
        loading: false,
        byProject: { ...state.byProject, [projectId]: items || [] },
      };
    }
    case FETCH_PROJECT_FILES_FAILURE:
      return { ...state, loading: false, error: action.error };

    case UPLOAD_PROJECT_FILE_REQUEST:
      return { ...state, uploading: true, error: null };
    case UPLOAD_PROJECT_FILE_SUCCESS: {
      const item = action.payload.item;
      const arr = state.byProject[item.projectId] || [];
      return {
        ...state,
        uploading: false,
        byProject: { ...state.byProject, [item.projectId]: [item, ...arr] },
      };
    }
    case UPLOAD_PROJECT_FILE_FAILURE:
      return { ...state, uploading: false, error: action.error };

    case CLEAR_PROJECT_FILES:
      return initialState;

    default:
      return state;
  }
}
