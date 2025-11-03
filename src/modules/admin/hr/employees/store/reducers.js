import * as T from './types';

const init = {
  list: [], // current page employees
  page: 0,
  size: 20,
  totalPages: 0,
  totalElements: 0,

  loading: false,
  error: null,
  busyIds: [],

  modalOpen: false,
  editing: null,

  inviteOpen: false,

  filters: {
    q: '',
    role: 'All',
    active: 'All',
  },
};

export default function adminEmployeesReducer(state = init, action) {
  switch (action.type) {
    case T.SET_EMP_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...(action.patch || {}) },
      };

    case T.SET_EMP_PAGE:
      return {
        ...state,
        page: action.page ?? 0,
        size: action.size ?? state.size,
      };

    case T.FETCH_EMP_REQ:
      return { ...state, loading: true, error: null };
    case T.FETCH_EMP_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.content || [],
        page: action.payload.pageable?.pageNumber ?? 0,
        size: action.payload.pageable?.pageSize ?? state.size,
        totalPages: action.payload.totalPages ?? 0,
        totalElements: action.payload.totalElements ?? 0,
      };
    case T.FETCH_EMP_FAIL:
      return { ...state, loading: false, error: action.error };

    case T.OPEN_EMP_MODAL:
      return { ...state, modalOpen: true, editing: action.record || null };
    case T.CLOSE_EMP_MODAL:
      return { ...state, modalOpen: false, editing: null };

    case T.OPEN_INVITE_MODAL:
      return { ...state, inviteOpen: true };
    case T.CLOSE_INVITE_MODAL:
      return { ...state, inviteOpen: false };

    case T.CREATE_EMP_REQ:
      return { ...state, busyIds: [...state.busyIds, '__create__'] };
    case T.CREATE_EMP_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== '__create__'),
        modalOpen: false,
        editing: null,
      };
    case T.CREATE_EMP_FAIL:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== '__create__'),
      };

    case T.UPDATE_EMP_REQ:
      return { ...state, busyIds: [...state.busyIds, action.employeeId] };
    case T.UPDATE_EMP_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.payload.employeeId),
        modalOpen: false,
        editing: null,
        list: state.list.map(e =>
          e.employeeId === action.payload.employeeId ? action.payload : e,
        ),
      };
    case T.UPDATE_EMP_FAIL:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.employeeId),
      };

    case T.DELETE_EMP_REQ:
      return { ...state, busyIds: [...state.busyIds, action.employeeId] };
    case T.DELETE_EMP_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.employeeId),
        list: state.list.filter(e => e.employeeId !== action.employeeId),
      };
    case T.DELETE_EMP_FAIL:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== action.employeeId),
      };

    case T.PATCH_ROLE_REQ:
      return {
        ...state,
        busyIds: [...state.busyIds, `role:${action.employeeId}`],
      };
    case T.PATCH_ROLE_SUCCESS:
      return {
        ...state,
        busyIds: state.busyIds.filter(
          x => x !== `role:${action.payload.employeeId}`,
        ),
        list: state.list.map(e =>
          e.employeeId === action.payload.employeeId ? action.payload : e,
        ),
      };
    case T.PATCH_ROLE_FAIL:
      return {
        ...state,
        busyIds: state.busyIds.filter(x => x !== `role:${action.employeeId}`),
      };

    default:
      return state;
  }
}
