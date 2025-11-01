import * as T from './types';

const init = {
  list: [],
  loading: false,
  error: null,
  busyIds: [],
  modalOpen: false,
  editing: null,
  mode: 'list',
};

export default function adminDepartmentsReducer(state = init, action) {
  switch (action.type) {
    case T.FETCH_DEPT_REQ:
      return { ...state, loading: true, error: null };
    case T.FETCH_DEPT_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case T.FETCH_DEPT_FAIL:
      return { ...state, loading: false, error: action.error };

    case T.CREATE_DEPT_REQ:
      return { ...state, busyIds: [...state.busyIds, '__create__'] };
    case T.CREATE_DEPT_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== '__create__'),
        list: [action.payload, ...state.list],
        modalOpen: false,
        editing: null,
      };
    case T.CREATE_DEPT_FAIL:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== '__create__'),
      };

    case T.UPDATE_DEPT_REQ:
      return { ...state, busyIds: [...state.busyIds, action.id] };
    case T.UPDATE_DEPT_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.payload.id),
        list: state.list.map(x =>
          x.id === action.payload.id ? action.payload : x,
        ),
        modalOpen: false,
        editing: null,
      };
    case T.UPDATE_DEPT_FAIL:
      return { ...state, busyIds: state.busyIds.filter(x => x !== action.id) };

    case T.DELETE_DEPT_REQ:
      return { ...state, busyIds: [...state.busyIds, action.id] };
    case T.DELETE_DEPT_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.id),
        list: state.list.filter(x => x.id !== action.id),
      };
    case T.DELETE_DEPT_FAIL:
      return { ...state, busyIds: state.busyIds.filter(x => x !== action.id) };

    case T.OPEN_DEPT_MODAL:
      return { ...state, modalOpen: true, editing: action.record || null };
    case T.CLOSE_DEPT_MODAL:
      return { ...state, modalOpen: false, editing: null };

    case T.SET_DEPT_MODE:
      return { ...state, mode: action.mode || 'list' };

    default:
      return state;
  }
}
