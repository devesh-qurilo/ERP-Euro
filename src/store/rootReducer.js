import { combineReducers } from 'redux';
import userReducer from '../modules/auth/store/reducers';
import employeeProfileReducer from '../modules/employee/profile/store/reducers';
import employeeDashboardReducer from '../modules/employee/dashboard/store/reducers';
import employeeHRReducer from '../modules/employee/hr/store/reducers';
import employeeSettingsReducer from '../modules/employee/settings/store/reducers';
import employeeNotificationsReducer from '../modules/employee/notifications/store/reducers';
import employeeProjectsReducer from '../modules/employee/works/projects/store/reducers';

import employeeLeadsReducer from '../modules/employee/leads/store/reducers';
import taskDetailsReducer from '../modules/employee/works/projects/store/taskDetails/reducer';

const rootReducer = combineReducers({
  auth: userReducer,
  employee: combineReducers({
    profile: employeeProfileReducer,
    dashboard: employeeDashboardReducer,
    hr: employeeHRReducer,
    settings: employeeSettingsReducer,
    notifications: employeeNotificationsReducer,
    leads: employeeLeadsReducer,
    works: combineReducers({
      projects: employeeProjectsReducer, // ✅ mount here
      taskDetails: taskDetailsReducer,
    }),
  }),
});

export default rootReducer;
