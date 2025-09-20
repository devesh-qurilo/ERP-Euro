import { all } from 'redux-saga/effects';
import { authSaga } from '../modules/auth/store/sagas';
import { employeeProfileSaga } from '../modules/employee/profile/store/sagas';
import { employeeDashboardWatcher } from '../modules/employee/dashboard/store/sagas';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    authSaga(),
    employeeProfileSaga(),
    employeeDashboardWatcher(),
    // employeeDashboardWatcher(),
    // Add other sagas here as we create more modules
  ]);
}
