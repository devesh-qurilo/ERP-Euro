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
import clientsViewProjectsReducer from '../modules/admin/clients/view/projects/store/reducer';
// import clientsViewInvoicesReducer from '../modules/admin/clients/view/invoices/store/reducer';
import clientsViewInvoicesReducer from '../modules/admin/clients/view/invoices/store/reducer';
import clientsViewPaymentsReducer from '../modules/admin/clients/view/payments/store/reducer';
import clientsViewCreditNotesReducer from '../modules/admin/clients/view/credit-notes/store/reducer';
import clientsViewDocumentsReducer from '../modules/admin/clients/view/documents/store/reducer';
import clientsViewNotesReducer from '../modules/admin/clients/view/notes/store/reducer';
import adminDealsReducer from '../modules/admin/leads/deals/store/reducer';
import adminDealsViewReducer from '../modules/admin/leads/deals/view/store/reducer';
import adminTasksReducer from '../modules/admin/work/tasks/store/reducer';
import sharedTasksReducer from '../modules/admin/shared/tasks/store/reducer';
import tasksDetailReducer from '../modules/admin/shared/tasks/detail/store/reducer';
import taskStagesReducer from '../modules/admin/shared/taskStages/store/reducer';
import AdminTimesheetsReducer from '../modules/admin/work/timesheets/store/reducer';
import AdminweeklyReducer from '../modules/admin/work/timesheets/store/weekly/reducer';

import projectViewInvoicesReducer from '../modules/admin/work/projects/view/invoices/store/reducer';
import projectViewPaymentsReducer from '../modules/admin/work/projects/view/payments/store/reducer';
import projectsViewFilesReducer from '../modules/admin/work/projects/view/files/store/reducer';
import AdminprojectActivityReducer from '../modules/admin/work/projects/view/activity/store/reducer';
import AdminprojectNotesReducer from '../modules/admin/work/projects/view/notes/store/reducer';
import leadNotesReducer from '../modules/admin/leads/notes/store/reducer';
import dealsKanbanReducer from '../modules/admin/leads/deals/kanban/store/reducer';
import adminDashboardReducer from '../modules/admin/dashboard/store/reducers';
import timelogReducer from '../modules/admin/timelog/store/reducer';
import birthdaysReducer from '../modules/admin/birthdays/store/reducer';
import leavesReducer from '../modules/admin/leaves/store/reducer';
import wfhReducer from '../modules/admin/wfh/store/reducer';
import paymentGateways from '../modules/admin/finance/paymentGateways/reducer';
import adminMessagesReducer from '../modules/admin/messages/store/reducers';
import messagesReducer from '../modules/admin/messages/store/reducers';
import reducerPriority from '../modules/admin/leads/deals/priorities/reducer';

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
    Priority: reducerPriority,
    leads: adminLeadsReducer, // ✅ <-- this is the Admin Lead Contacts reducer
    Priority: reducerPriority,
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
      tasks: adminTasksReducer,
      tasks: sharedTasksReducer,
      taskDetail: tasksDetailReducer,
      taskStages: taskStagesReducer,
      timesheets: AdminTimesheetsReducer,
      timesheetsWeekly: AdminweeklyReducer,
    }),
    finance: combineReducers({
      invoice: adminFinanceInvoiceReducer,
      creditNotes: creditNotesReducer,
    }),
    // clients: adminClientsReducer,
    clients: clientsReducer,
    clientsView: clientsViewReducer,
    clientsViewProjects: clientsViewProjectsReducer,
    clientsViewInvoices: clientsViewInvoicesReducer,
    clientsViewPayments: clientsViewPaymentsReducer,
    clientsViewCreditNotes: clientsViewCreditNotesReducer,
    clientsViewDocuments: clientsViewDocumentsReducer,
    clientsViewNotes: clientsViewNotesReducer,
    deals: adminDealsReducer,
    dealsView: adminDealsViewReducer,
    projectViewInvoices: projectViewInvoicesReducer,
    projectViewPayments: projectViewPaymentsReducer,
    projectsViewFiles: projectsViewFilesReducer,
    projectViewActivity: AdminprojectActivityReducer,
    projectViewNotes: AdminprojectNotesReducer,
    leadNotes: leadNotesReducer,
    dealsKanban: dealsKanbanReducer,
    dashboard: adminDashboardReducer,
    timelog: timelogReducer,
    birthdays: birthdaysReducer,
    leaves: leavesReducer,
    wfh: wfhReducer,
    paymentGateways: paymentGateways,
    adminMessages: messagesReducer,
  }),
});

export default rootReducer;
// clientsViewInvoicesReducer;
