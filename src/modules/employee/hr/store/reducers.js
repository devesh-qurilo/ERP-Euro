// src/modules/employee/hr/store/reducers.js
import {
  FETCH_MY_LEAVES_REQUEST,
  FETCH_MY_LEAVES_SUCCESS,
  FETCH_MY_LEAVES_FAILURE,
  APPLY_LEAVE_REQUEST,
  APPLY_LEAVE_SUCCESS,
  APPLY_LEAVE_FAILURE,
  FETCH_MY_ATTENDANCE_REQUEST,
  FETCH_MY_ATTENDANCE_SUCCESS,
  FETCH_MY_ATTENDANCE_FAILURE,
  FETCH_APPRECIATIONS_REQUEST,
  FETCH_APPRECIATIONS_SUCCESS,
  FETCH_APPRECIATIONS_FAILURE,
  FETCH_HOLIDAYS_REQUEST,
  FETCH_HOLIDAYS_SUCCESS,
  FETCH_HOLIDAYS_FAILURE,
} from './actions';

const initialState = {
  myLeaves: { data: [], loading: false, error: null },
  apply: { loading: false, error: null, lastCreated: null },
  attendance: { data: [], loading: false, error: null },

  holidays: { data: [], loading: false, error: null }, // ✅
};

export default function employeeHRReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MY_LEAVES_REQUEST:
      return {
        ...state,
        myLeaves: { ...state.myLeaves, loading: true, error: null },
      };

    case FETCH_MY_LEAVES_SUCCESS:
      return {
        ...state,
        myLeaves: { data: action.payload, loading: false, error: null },
      };

    case FETCH_MY_LEAVES_FAILURE:
      return {
        ...state,
        myLeaves: { ...state.myLeaves, loading: false, error: action.error },
      };

    case APPLY_LEAVE_REQUEST:
      return {
        ...state,
        apply: { loading: true, error: null, lastCreated: null },
      };
    case APPLY_LEAVE_SUCCESS:
      return {
        ...state,
        apply: { loading: false, error: null, lastCreated: action.payload },
      };
    case APPLY_LEAVE_FAILURE:
      return {
        ...state,
        apply: { loading: false, error: action.error, lastCreated: null },
      };

    // attendance
    case FETCH_MY_ATTENDANCE_REQUEST:
      return {
        ...state,
        attendance: { ...state.attendance, loading: true, error: null },
      };
    case FETCH_MY_ATTENDANCE_SUCCESS:
      return {
        ...state,
        attendance: { data: action.payload, loading: false, error: null },
      };
    case FETCH_MY_ATTENDANCE_FAILURE:
      return {
        ...state,
        attendance: {
          ...state.attendance,
          loading: false,
          error: action.error,
        },
      };

    //  Appreciations
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

    case FETCH_HOLIDAYS_REQUEST:
      return {
        ...state,
        holidays: { ...state.holidays, loading: true, error: null },
      };
    case FETCH_HOLIDAYS_SUCCESS:
      return {
        ...state,
        holidays: { data: action.payload, loading: false, error: null },
      };
    case FETCH_HOLIDAYS_FAILURE:
      return {
        ...state,
        holidays: { ...state.holidays, loading: false, error: action.error },
      };

    default:
      return state; // <— returns initialState on first call
  }
}
