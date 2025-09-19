import {
  FETCH_EMPLOYEE_PROFILE_REQUEST,
  FETCH_EMPLOYEE_PROFILE_SUCCESS,
  FETCH_EMPLOYEE_PROFILE_FAILURE,
  UPDATE_EMPLOYEE_PROFILE_REQUEST,
  UPDATE_EMPLOYEE_PROFILE_SUCCESS,
  UPDATE_EMPLOYEE_PROFILE_FAILURE,
  CLEAR_EMPLOYEE_PROFILE,
} from './action';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
};

const employeeProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EMPLOYEE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_EMPLOYEE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };
    case FETCH_EMPLOYEE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        profile: null,
        error: action.payload,
      };
    case UPDATE_EMPLOYEE_PROFILE_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };
    case UPDATE_EMPLOYEE_PROFILE_SUCCESS:
      return {
        ...state,
        updating: false,
        profile: action.payload,
        error: null,
      };
    case UPDATE_EMPLOYEE_PROFILE_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };
    case CLEAR_EMPLOYEE_PROFILE:
      return initialState;
    default:
      return state;
  }
};

export default employeeProfileReducer;
