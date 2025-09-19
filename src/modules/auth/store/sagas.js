import { call, put, takeEvery } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginSuccess, loginFailure } from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../../services/api';

function* loginSaga(action) {
  try {
    console.log('Login saga started', action.payload);

    const { employeeId, password, userType } = action.payload;

    // Call the real API
    const response = yield call(authAPI.login, { employeeId, password });

    console.log('API Response:', response);

    // Transform the API response to match our expected format
    const userData = {
      user: {
        id: response.employeeId, // Using employeeId as ID
        employeeId: response.employeeId,
        name: response.employeeId, // You might want to get actual name from API
        role: response.role.toLowerCase().replace('role_', ''), // Convert "ROLE_ADMIN" to "admin"
        department: '', // Add department if available in API response
      },
      token: response.accessToken,
      refreshToken: response.refreshToken,
    };

    console.log('Login successful, storing data...');

    // Store tokens and user data
    yield call(AsyncStorage.setItem, 'authToken', userData.token);
    yield call(AsyncStorage.setItem, 'refreshToken', userData.refreshToken);
    yield call(AsyncStorage.setItem, 'userData', JSON.stringify(userData.user));

    console.log('Dispatching login success...');
    yield put(loginSuccess(userData));
  } catch (error) {
    console.log('Login failed:', error.message);
    let errorMessage = error.message;

    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || 'Login failed';
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection.';
    }

    yield put(loginFailure(errorMessage));
  }
}

export function* authSaga() {
  yield takeEvery(LOGIN_REQUEST, loginSaga);
}
