import { call, put, takeEvery } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginSuccess, loginFailure } from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* loginSaga(action) {
  try {
    const { employeeId, password, userType } = action.payload;

    // Mock validation
    if (userType === 'employee') {
      if (employeeId !== 'EMP001' || password !== 'password123') {
        throw new Error('Invalid employee ID or password');
      }
    }

    const response = {
      user: {
        id: 1,
        employeeId: employeeId,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'employee',
        department: 'Operations',
      },
      token: 'mock-jwt-token-for-employee',
    };

    yield call([AsyncStorage, 'setItem'], 'authToken', response.token);
    yield call(
      [AsyncStorage, 'setItem'],
      'userData',
      JSON.stringify(response.user),
    );

    yield put(loginSuccess(response));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

// Export as a generator function
export function* authSaga() {
  yield takeEvery(LOGIN_REQUEST, loginSaga);
}
