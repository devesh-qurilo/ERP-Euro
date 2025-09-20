import { combineReducers } from 'redux';
import userReducer from '../modules/auth/store/reducers';
import employeeProfileReducer from '../modules/employee/profile/store/reducers';
import employeeDashboardReducer from '../modules/employee/dashboard/store/reducers';

const rootReducer = combineReducers({
  auth: userReducer,
  employee: combineReducers({
    profile: employeeProfileReducer,
    dashboard: employeeDashboardReducer,
  }),
});

export default rootReducer;
