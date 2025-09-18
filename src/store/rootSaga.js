import { all } from 'redux-saga/effects';
import { authSaga } from '../modules/auth/store/sagas';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    authSaga(),
    // Add other sagas here as we create more modules
  ]);
}
