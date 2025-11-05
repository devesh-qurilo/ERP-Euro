import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  busyIds: [],
  modalOpen: false,
  editing: null,
};

export default function empProjectsReducer(state = initial, action) {
  switch (action.type) {
    case T.EMP_PROJ_FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case T.EMP_PROJ_FETCH_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case T.EMP_PROJ_FETCH_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.EMP_PROJ_OPEN_MODAL:
      return { ...state, modalOpen: true, editing: action.editing };
    case T.EMP_PROJ_CLOSE_MODAL:
      return { ...state, modalOpen: false, editing: null };

    case T.EMP_PROJ_CREATE_REQUEST:
    case T.EMP_PROJ_UPDATE_REQUEST:
    case T.EMP_PROJ_DELETE_REQUEST:
    case T.EMP_PROJ_STATUS_REQUEST:
      return {
        ...state,
        busyIds: [...state.busyIds, action.projectId || 'GLOBAL'],
      };

    case T.EMP_PROJ_CREATE_SUCCESS:
    case T.EMP_PROJ_UPDATE_SUCCESS:
    case T.EMP_PROJ_DELETE_SUCCESS:
    case T.EMP_PROJ_STATUS_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(
          id => id !== (action.projectId || 'GLOBAL'),
        ),
      };

    case T.EMP_PROJ_CREATE_FAILURE:
    case T.EMP_PROJ_UPDATE_FAILURE:
    case T.EMP_PROJ_DELETE_FAILURE:
    case T.EMP_PROJ_STATUS_FAILURE:
      return {
        ...state,
        busyIds: state.busyIds.filter(
          id => id !== (action.projectId || 'GLOBAL'),
        ),
        error: action.error,
      };

    default:
      return state;
  }
}
