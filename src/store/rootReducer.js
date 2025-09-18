import { combineReducers } from 'redux';
import auth from '../modules/auth/store/reducers';
import adminDashboard from '../modules/admin/dashboard/store/reducers';
import adminLeads from '../modules/admin/leads/store/reducers';
import adminClients from '../modules/admin/clients/store/reducers';
import adminWorks from '../modules/admin/works/store/reducers';
import adminHRMS from '../modules/admin/hrms/store/reducers';
import adminFinance from '../modules/admin/finance/store/reducers';
import employeeDashboard from '../modules/employee/dashboard/store/reducers';
import employeeLeads from '../modules/employee/leads/store/reducers';
import employeeWorks from '../modules/employee/works/store/reducers';
import employeeHR from '../modules/employee/hr/store/reducers';

const rootReducer = combineReducers({
  auth,
  //   admin: combineReducers({
  //     dashboard: adminDashboard,
  //     leads: adminLeads,
  //     clients: adminClients,
  //     works: adminWorks,
  //     hrms: adminHRMS,
  //     finance: adminFinance,
  //   }),
  //   employee: combineReducers({
  //     dashboard: employeeDashboard,
  //     leads: employeeLeads,
  //     works: employeeWorks,
  //     hr: employeeHR,
  //   }),
});

export default rootReducer;
