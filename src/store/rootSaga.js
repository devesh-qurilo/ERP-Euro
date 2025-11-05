import { all } from 'redux-saga/effects';
import { authSaga } from '../modules/auth/store/sagas';
import { employeeProfileSaga } from '../modules/employee/profile/store/sagas';
import { employeeDashboardWatcher } from '../modules/employee/dashboard/store/sagas';
import { employeeHRWatcher } from '../modules/employee/hr/store/sagas';
import { employeeSettingsWatcher } from '../modules/employee/settings/store/sagas';
import { employeeNotificationsWatcher } from '../modules/employee/notifications/store/sagas';
import { employeeProjectsWatcher } from '../modules/employee/works/projects/store/sagas';

import { employeeLeadsWatcher } from '../modules/employee/leads/store/sagas';
import { taskDetailsWatcher } from '../modules/employee/works/projects/store/taskDetails/sagas';
import { projectFilesWatcher } from '../modules/employee/works/projects/store/projectFiles/sagas';

import { projectNotesWatcher } from '../modules/employee/works/projects/store/projectNotes/sagas';
import { projectActivityWatcher } from '../modules/employee/works/projects/store/projectActivity/sagas';

import { employeeTasksWatcher } from '../modules/employee/works/tasks/store/sagas';
import { employeeTimesheetsWatcher } from '../modules/employee/works/timesheets/store/sagas';

import { weeklyWatcher } from '../modules/employee/works/timesheets/store/weekly/sagas';
import { chatWatcher } from '../modules/employee/messages/store/sagas';

import { adminLeadsWatcher } from '../modules/admin/leads/store/sagas';
import { adminSettingsWatcher } from '../modules/admin/settings/store/sagas';
import { adminDesignationsWatcher } from '../modules/admin/hr/designations/store/sagas';
import { adminDepartmentsWatcher } from '../modules/admin/hr/departments/store/sagas';
import { adminEmployeesWatcher } from '../modules/admin/hr/employees/store/sagas';
import { empProjectsWatcher } from '../modules/admin/hr/employees/work/projects/store/sagas';
import { adminLeavesWatcher } from '../modules/admin/hr/leaves/store/sagas';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    authSaga(),
    employeeProfileSaga(),
    employeeDashboardWatcher(),
    employeeHRWatcher(),
    employeeSettingsWatcher(),
    employeeNotificationsWatcher(),
    employeeLeadsWatcher(),
    employeeProjectsWatcher(),
    taskDetailsWatcher(),
    projectFilesWatcher(),
    projectNotesWatcher(),
    projectActivityWatcher(),
    employeeTasksWatcher(),
    employeeTimesheetsWatcher(),
    weeklyWatcher(),
    chatWatcher(),
    adminLeadsWatcher(),
    adminSettingsWatcher(),
    adminDesignationsWatcher(),
    adminDepartmentsWatcher(),
    adminEmployeesWatcher(),
    empProjectsWatcher(),
    adminLeavesWatcher(),
  ]);
}
