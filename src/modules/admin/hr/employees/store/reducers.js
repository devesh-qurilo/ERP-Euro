import * as T from './types';

const init = {
  list: [], // current page employees
  page: 0,
  size: 200000,
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

  inviteLoading: false,
  inviteError: null,
  inviteSuccess: false,

  attendanceCalendar: [],
  attendanceLoading: false,
  attendanceError: null,

  quota: [],
  quotaLoading: false,
  quotaError: null,

  employeeLeaves: [],
  employeeLeavesLoading: false,

  employeeDocs: [],
  employeeDocsLoading: false,
  employeeDocsError: null,

  promotions: [],
  promotionsLoading: false,
  promotionModalOpen: false,
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
        error: action.error,
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

    case T.INVITE_EMPLOYEE_REQUEST:
      return {
        ...state,
        inviteLoading: true,
        inviteError: null,
        inviteSuccess: false,
      };
    case T.INVITE_EMPLOYEE_SUCCESS:
      return { ...state, inviteLoading: false, inviteSuccess: true };
    case T.INVITE_EMPLOYEE_FAILURE:
      return {
        ...state,
        inviteLoading: false,
        inviteError: action.error,
        inviteSuccess: false,
      };
    case T.INVITE_EMPLOYEE_CLEAR:
      return {
        ...state,
        inviteLoading: false,
        inviteError: null,
        inviteSuccess: false,
      };

    case T.FETCH_EMP_ATT_CAL_REQ:
      return {
        ...state,
        attendanceLoading: true,
        attendanceError: null,
      };

    case T.FETCH_EMP_ATT_CAL_SUCCESS:
      return {
        ...state,
        attendanceLoading: false,
        attendanceCalendar: action.items || [],
      };

    case T.FETCH_EMP_ATT_CAL_FAIL:
      return {
        ...state,
        attendanceLoading: false,
        attendanceError: action.error,
      };

    case T.FETCH_EMP_LEAVE_QUOTA_REQ:
      return {
        ...state,
        quotaLoading: true,
        quotaError: null,
      };

    case T.FETCH_EMP_LEAVE_QUOTA_SUCCESS:
      return {
        ...state,
        quotaLoading: false,
        quota: action.items,
      };

    case T.FETCH_EMP_LEAVE_QUOTA_FAIL:
      return {
        ...state,
        quotaLoading: false,
        quotaError: action.error,
      };

    case T.FETCH_EMP_LEAVES_REQ:
      return {
        ...state,
        employeeLeavesLoading: true,
      };

    case T.FETCH_EMP_LEAVES_SUCCESS:
      return {
        ...state,
        employeeLeavesLoading: false,
        employeeLeaves: action.items,
      };

    case T.FETCH_EMP_LEAVES_FAIL:
      return {
        ...state,
        employeeLeavesLoading: false,
      };

    case T.EMP_DOCS_FETCH:
      return {
        ...state,
        employeeDocsLoading: true,
      };

    case T.EMP_DOCS_SUCCESS:
      console.log('Reducer docs', action.items);
      return {
        ...state,
        employeeDocsLoading: false,
        employeeDocs: action.items,
      };

    case T.EMP_DOCS_FAIL:
      return {
        ...state,
        employeeDocsLoading: false,
        employeeDocsError: action.error,
      };

    case T.FETCH_EMP_PROMOTIONS_REQ:
      return {
        ...state,
        promotionsLoading: true,
      };

    case T.FETCH_EMP_PROMOTIONS_SUCCESS:
      return {
        ...state,
        promotionsLoading: false,
        promotions: action.items,
      };

    case T.FETCH_EMP_PROMOTIONS_FAIL:
      return {
        ...state,
        promotionsLoading: false,
      };

    case T.OPEN_PROMOTION_MODAL:
      return {
        ...state,
        promotionModalOpen: true,
      };

    case T.CLOSE_PROMOTION_MODAL:
      return {
        ...state,
        promotionModalOpen: false,
      };

    default:
      return state;
  }
}
