import { call, put, takeEvery } from 'redux-saga/effects';
import {
  FETCH_EMPLOYEE_PROFILE_REQUEST,
  fetchEmployeeProfileSuccess,
  fetchEmployeeProfileFailure,
} from './actions';

// Mock API call - Replace with actual API
const fetchEmployeeProfileAPI = async employeeId => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock data based on employeeId
      const employeeData = {
        'AS-09': {
          id: 1,
          name: 'Aanchal Sharma',
          employeeId: 'AS-09',
          jobRole: 'Full-Stack Developer',
          department: 'Development',
          status: 'active',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          email: 'aanchal.sharma@company.com',
          phone: '+1-234-567-8900',
          joinDate: '2023-01-15',
          address: '123 Tech Street, Bangalore',
          reportsTo: 'Sneha Gupta (Project Manager)',
        },
        // Add more mock data for other employees if needed
      };

      resolve(employeeData[employeeId] || null);
    }, 1000);
  });
};

function* fetchEmployeeProfileSaga(action) {
  try {
    const employee = yield call(fetchEmployeeProfileAPI, action.payload);
    if (employee) {
      yield put(fetchEmployeeProfileSuccess(employee));
    } else {
      throw new Error('Employee not found');
    }
  } catch (error) {
    yield put(fetchEmployeeProfileFailure(error.message));
  }
}

export function* employeeSaga() {
  yield takeEvery(FETCH_EMPLOYEE_PROFILE_REQUEST, fetchEmployeeProfileSaga);
}
