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
  ]);
}
