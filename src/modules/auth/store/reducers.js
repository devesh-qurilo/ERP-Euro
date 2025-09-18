import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  RESET_AUTH_ERROR,
  SET_USER_TYPE,
} from './actions';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  userRole: null,
  userType: 'employee', // 'admin' or 'employee'
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        userRole: action.payload.user.role,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        userRole: null,
        isAuthenticated: false,
        error: action.payload,
      };
    case LOGOUT:
      return initialState;
    case RESET_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };
    case SET_USER_TYPE:
      return {
        ...state,
        userType: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
