import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  // Store data
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      );
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  },

  // Retrieve data
  getItem: async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  // Remove data
  removeItem: async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },

  // Clear all data
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};
