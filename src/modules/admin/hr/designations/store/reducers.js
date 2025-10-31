import * as T from './types';

const init = {
  list: [],
  loading: false,
  error: null,

  busyIds: [],

  modalOpen: false,
  editing: null, // record or null

  mode: 'list', // 'list' | 'hierarchy'
};

export default function adminDesignationsReducer(state = init, action) {
  switch (action.type) {
    case T.FETCH_DESIG_REQ:
      return { ...state, loading: true, error: null };
    case T.FETCH_DESIG_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case T.FETCH_DESIG_FAIL:
      return { ...state, loading: false, error: action.error };

    case T.CREATE_DESIG_REQ:
      return { ...state, busyIds: [...state.busyIds, '__create__'] };
    case T.CREATE_DESIG_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== '__create__'),
        list: [action.payload, ...state.list],
        modalOpen: false,
        editing: null,
      };
    case T.CREATE_DESIG_FAIL:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== '__create__'),
      };

    case T.UPDATE_DESIG_REQ:
      return { ...state, busyIds: [...state.busyIds, action.id] };
    case T.UPDATE_DESIG_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.payload.id),
        list: state.list.map(x =>
          x.id === action.payload.id ? action.payload : x,
        ),
        modalOpen: false,
        editing: null,
      };
    case T.UPDATE_DESIG_FAIL:
      return { ...state, busyIds: state.busyIds.filter(x => x !== action.id) };

    case T.DELETE_DESIG_REQ:
      return { ...state, busyIds: [...state.busyIds, action.id] };
    case T.DELETE_DESIG_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.id),
        list: state.list.filter(x => x.id !== action.id),
      };
    case T.DELETE_DESIG_FAIL:
      return { ...state, busyIds: state.busyIds.filter(x => x !== action.id) };

    case T.OPEN_MODAL:
      return { ...state, modalOpen: true, editing: action.record || null };
    case T.CLOSE_MODAL:
      return { ...state, modalOpen: false, editing: null };

    case T.SET_MODE:
      return { ...state, mode: action.mode || 'list' };

    default:
      return state;
  }
}
