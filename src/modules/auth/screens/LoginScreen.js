import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, resetAuthError, setUserType } from '../store/actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectUserType,
} from '../store/selectors';

const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('EMP-010');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main');
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!employeeId) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(
        loginRequest({
          employeeId,
          password,
          userType,
        }),
      );
    }
  };

  const handleUserTypeChange = type => {
    dispatch(setUserType(type));
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented here',
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>SKOVA</Text>
          <Text style={styles.welcomeText}>WELCOME BACK !</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.loginTitle}>Log In</Text>

          {/* User Type Selection */}
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'admin' && styles.userTypeButtonActive,
              ]}
              onPress={() => handleUserTypeChange('admin')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'admin' && styles.userTypeTextActive,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'employee' && styles.userTypeButtonActive,
              ]}
              onPress={() => handleUserTypeChange('employee')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'employee' && styles.userTypeTextActive,
                ]}
              >
                Employee
              </Text>
            </TouchableOpacity>
          </View>

          {/* Employee ID Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Employee Id</Text>
            <TextInput
              style={[styles.input, errors.employeeId && styles.inputError]}
              placeholder="Enter your employee ID"
              value={employeeId}
              onChangeText={setEmployeeId}
              autoCapitalize="none"
              keyboardType="default"
              editable={!loading}
            />
            {errors.employeeId && (
              <Text style={styles.errorText}>{errors.employeeId}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing in...' : 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2c3e50',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#3498db',
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  userTypeTextActive: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
