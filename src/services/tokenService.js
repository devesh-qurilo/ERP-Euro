// src/services/tokenService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const KEYS = {
  token: 'authToken',
  refresh: 'refreshToken',
  user: 'userData',
  tokenExp: 'tokenExp',
};

export const saveAuth = async ({ token, refreshToken, user }) => {
  try {
    if (token) await AsyncStorage.setItem(KEYS.token, token);
    if (refreshToken) await AsyncStorage.setItem(KEYS.refresh, refreshToken);
    if (user) await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));

    // store token expiry if token is JWT
    try {
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded && decoded.exp) {
          await AsyncStorage.setItem(KEYS.tokenExp, String(decoded.exp));
        }
      }
    } catch (e) {
      // not a JWT or decode failed - ignore
    }
  } catch (err) {
    console.warn('tokenService.saveAuth error', err);
  }
};

export const getAuth = async () => {
  try {
    const [token, refreshToken, userStr, tokenExp] = await Promise.all([
      AsyncStorage.getItem(KEYS.token),
      AsyncStorage.getItem(KEYS.refresh),
      AsyncStorage.getItem(KEYS.user),
      AsyncStorage.getItem(KEYS.tokenExp),
    ]);
    return {
      token,
      refreshToken,
      user: userStr ? JSON.parse(userStr) : null,
      tokenExp: tokenExp ? Number(tokenExp) : null,
    };
  } catch (err) {
    console.warn('tokenService.getAuth error', err);
    return { token: null, refreshToken: null, user: null, tokenExp: null };
  }
};

export const clearAuth = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.token),
      AsyncStorage.removeItem(KEYS.refresh),
      AsyncStorage.removeItem(KEYS.user),
      AsyncStorage.removeItem(KEYS.tokenExp),
    ]);
  } catch (err) {
    console.warn('tokenService.clearAuth error', err);
  }
};

export const isTokenExpired = exp => {
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  // treat as expired 60s earlier to avoid edge-cases
  return now >= exp - 60;
};
