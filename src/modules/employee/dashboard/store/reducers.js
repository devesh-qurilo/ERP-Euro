// src/modules/employee/dashboard/store/reducers.js
import {
  FETCH_LEAVE_QUOTA_REQUEST,
  FETCH_LEAVE_QUOTA_SUCCESS,
  FETCH_LEAVE_QUOTA_FAILURE,
  // new appreciation types
  FETCH_APPRECIATIONS_REQUEST,
  FETCH_APPRECIATIONS_SUCCESS,
  FETCH_APPRECIATIONS_FAILURE,
} from './actions';

const initialState = {
  leaveQuota: { data: [], loading: false, error: null },
};

export default function employeeDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_LEAVE_QUOTA_REQUEST:
      return {
        ...state,
        leaveQuota: { ...state.leaveQuota, loading: true, error: null },
      };
    case FETCH_LEAVE_QUOTA_SUCCESS:
      return {
        ...state,
        leaveQuota: { data: action.payload, loading: false, error: null },
      };
    case FETCH_LEAVE_QUOTA_FAILURE:
      return {
        ...state,
        leaveQuota: {
          ...state.leaveQuota,
          loading: false,
          error: action.error,
        },
      };
    // appreciations
    case FETCH_APPRECIATIONS_REQUEST:
      return {
        ...state,
        appreciations: { ...state.appreciations, loading: true, error: null },
      };
    case FETCH_APPRECIATIONS_SUCCESS:
      return {
        ...state,
        appreciations: { data: action.payload, loading: false, error: null },
      };
    case FETCH_APPRECIATIONS_FAILURE:
      return {
        ...state,
        appreciations: {
          ...state.appreciations,
          loading: false,
          error: action.error,
        },
      };

    default:
      return state;
  }
}
