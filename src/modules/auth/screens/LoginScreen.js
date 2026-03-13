// src/screens/LoginScreen.js
import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, resetAuthError, loginSuccess } from '../store/actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '../store/selectors';
import * as tokenService from '../../../services/tokenService';
import { authAPI } from '../../../services/api';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    checkExistingAuth();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // If redux indicates authenticated, go to AdminDashboard
  useEffect(() => {
    if (isAuthenticated && !isCheckingAuth) {
      // navigate to drawer route main screen
      navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
    }
  }, [isAuthenticated, isCheckingAuth, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('common:loginFailed'), error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch, t]);

  const checkExistingAuth = async () => {
    try {
      const { token, refreshToken, user, tokenExp } =
        await tokenService.getAuth();

      if (token && user) {
        // If token has expiry and it's not expired, restore session
        const expired = tokenService.isTokenExpired(tokenExp);
        if (!expired) {
          dispatch(loginSuccess({ user, token, refreshToken }));
          navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
          return;
        }

        // Token expired — attempt refresh if refreshToken present
        if (refreshToken) {
          try {
            const resp = await authAPI.refreshToken(refreshToken);
            // expecting { accessToken, refreshToken, employeeId, ... } or similar
            const newToken = resp.accessToken || resp.token;
            const newRefresh = resp.refreshToken || refreshToken;
            const apiUser = resp.user || user || { employeeId };

            if (newToken) {
              await tokenService.saveAuth({
                token: newToken,
                refreshToken: newRefresh,
                user: apiUser,
              });
              dispatch(
                loginSuccess({
                  user: apiUser,
                  token: newToken,
                  refreshToken: newRefresh,
                }),
              );
              navigation.reset({
                index: 0,
                routes: [{ name: 'AdminDashboard' }],
              });
              return;
            }
          } catch (e) {
            // refresh failed; clear stored auth
            await tokenService.clearAuth();
          }
        } else {
          // no refresh token — clear storage
          await tokenService.clearAuth();
        }
      }
    } catch (err) {
      console.warn('checkExistingAuth error', err);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employeeId.trim())
      newErrors.employeeId = t('login.employeeId.required');
    if (!password) newErrors.password = t('login.password.required');
    else if (password.length < 6)
      newErrors.password = t('login.password.minLength');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    dispatch(loginRequest({ employeeId: employeeId.trim(), password }));
    // your saga handles API call + AsyncStorage storage
  };

  const handleForgotPassword = () => {
    Alert.alert(t('login.forgotPassword'), t('login.forgotPassword'), [
      { text: 'OK' },
    ]);
  };

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.appName}>{t('app.name')}</Text>
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>{t('app.name')}</Text>
            <View style={styles.logoBorder} />
          </View>
          <Text style={styles.welcomeText}>{t('app.welcome')}</Text>
          <Text style={styles.subtitleText}>{t('app.subtitle')}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.loginTitle}>{t('login.title')}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('login.employeeId.label')}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.employeeId && styles.inputError]}
                placeholder={t('login.employeeId.placeholder')}
                placeholderTextColor="#95a5a6"
                value={employeeId}
                onChangeText={text => {
                  setEmployeeId(text);
                  if (errors.employeeId)
                    setErrors(prev => ({ ...prev, employeeId: null }));
                }}
                autoCapitalize="none"
                keyboardType="default"
                editable={!loading}
              />
            </View>
            {errors.employeeId && (
              <Animated.Text style={styles.errorText}>
                {errors.employeeId}
              </Animated.Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('login.password.label')}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder={t('login.password.placeholder')}
                placeholderTextColor="#95a5a6"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errors.password)
                    setErrors(prev => ({ ...prev, password: null }));
                }}
                secureTextEntry
                editable={!loading}
              />
            </View>
            {errors.password && (
              <Animated.Text style={styles.errorText}>
                {errors.password}
              </Animated.Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>
              {t('login.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loginButtonText}>
                  {t('login.signingIn')}
                </Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>{t('login.login')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('login.footer')}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loader: { marginTop: 20 },
  loadingText: { marginTop: 16, fontSize: 14, color: '#7f8c8d' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 2,
  },
  logoBorder: {
    width: 60,
    height: 4,
    backgroundColor: '#3498db',
    borderRadius: 2,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitleText: { fontSize: 14, color: '#7f8c8d', fontWeight: '400' },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#2c3e50',
  },
  inputContainer: { marginBottom: 24 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  inputWrapper: { position: 'relative' },
  input: {
    height: 54,
    borderWidth: 2,
    borderColor: '#e0e6ed',
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  inputError: { borderColor: '#e74c3c', backgroundColor: '#fff5f5' },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -8,
  },
  forgotPasswordText: { color: '#3498db', fontSize: 14, fontWeight: '600' },
  loginButton: {
    height: 54,
    backgroundColor: '#3498db',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#bdc3c7', shadowOpacity: 0.1 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
