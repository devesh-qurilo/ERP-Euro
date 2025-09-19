import { combineReducers } from 'redux';
import userReducer from '../modules/auth/store/reducers';
import employeeProfileReducer from '../modules/employee/profile/store/reducers';

const rootReducer = combineReducers({
  auth: userReducer,
  employee: combineReducers({
    profile: employeeProfileReducer,
  }),
});

export default rootReducer;
