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
import projectNotesReducer from '../modules/employee/works/projects/store/projectNotes/reducer';
import projectActivityReducer from '../modules/employee/works/projects/store/projectActivity/reducer';
import employeeTasksReducer from '../modules/employee/works/tasks/store/reducers';
import employeeTimesheetsReducer from '../modules/employee/works/timesheets/store/reducer';
import weeklyReducer from '../modules/employee/works/timesheets/store/weekly/reducer';
import chatReducer from '../modules/employee/messages/store/reducers';

// ⬇️ Admin modules
import adminLeadsReducer from '../modules/admin/leads/store/reducers';
import adminSettingsReducer from '../modules/admin/settings/store/reducer';
import adminDesignationsReducer from '../modules/admin/hr/designations/store/reducers';
import adminDepartmentsReducer from '../modules/admin/hr/departments/store/reducers';
import adminEmployeesReducer from '../modules/admin/hr/employees/store/reducers';
import empProjectsReducer from '../modules/admin/hr/employees/work/projects/store/reducers';
import adminLeavesReducer from '../modules/admin/hr/leaves/store/reducers';
import adminHolidaysReducer from '../modules/admin/hr/holidays/store/reducers';
import adminAttendanceReducer from '../modules/admin/hr/attendance/store/reducers';
import appreciationsReducer from '../modules/admin/hr/appreciations/store/reducers';

import adminWorkProjectsReducer from '../modules/admin/work/projects/store/reducers';
import tasksReducer from '../modules/admin/work/projects/store/tasks/reducer';
import adminFinanceInvoiceReducer from '../modules/admin/finance/invoice/store/reducers';
import creditNotesReducer from '../modules/admin/finance/credit-notes/store/reducer';

import adminClientsReducer from '../modules/admin/client/store/reducers';
import clientsReducer from '../modules/admin/clients/store/reducers';
import clientsViewReducer from '../modules/admin/clients/view/store/reducer';

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
      projectNotes: projectNotesReducer, // ✅ NEW
      projectActivity: projectActivityReducer, // ✅ NEW
      tasks: employeeTasksReducer,
      timesheets: employeeTimesheetsReducer,
      timesheetsWeekly: weeklyReducer,
    }),
    messages: chatReducer,
  }),

  admin: combineReducers({
    leads: adminLeadsReducer, // ✅ <-- this is the Admin Lead Contacts reducer
    settings: adminSettingsReducer,
    hr: combineReducers({
      designations: adminDesignationsReducer, // ✅ add this
      departments: adminDepartmentsReducer,

      employees: adminEmployeesReducer,
      projects: empProjectsReducer,
      leaves: adminLeavesReducer,
      holidays: adminHolidaysReducer,
      attendance: adminAttendanceReducer,
      appreciations: appreciationsReducer,
    }),
    work: combineReducers({
      projects: adminWorkProjectsReducer, // ← mount here
      tasks: tasksReducer,
    }),
    finance: combineReducers({
      invoice: adminFinanceInvoiceReducer,
      creditNotes: creditNotesReducer,
    }),
    // clients: adminClientsReducer,
    clients: clientsReducer,
    clientsView: clientsViewReducer,
  }),
});

export default rootReducer;
