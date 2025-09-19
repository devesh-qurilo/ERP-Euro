import {
  FETCH_EMPLOYEE_PROFILE_REQUEST,
  FETCH_EMPLOYEE_PROFILE_SUCCESS,
  FETCH_EMPLOYEE_PROFILE_FAILURE,
} from './actions';

const initialState = {
  employeeProfile: null,
  loading: false,
  error: null,
};

const employeeReducer = (state = initialState, action) => {
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
        employeeProfile: action.payload,
        error: null,
      };
    case FETCH_EMPLOYEE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        employeeProfile: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default employeeReducer;
