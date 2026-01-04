// AsyncStorage wrapper for DukaScan settings persistence

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCRIPT_URL_KEY = '@dukascan_script_url';

/**
 * Get the saved Google Apps Script URL
 */
export const getScriptUrl = async (): Promise<string | null> => {
  try {
    const url = await AsyncStorage.getItem(SCRIPT_URL_KEY);
    return url;
  } catch (error) {
    console.error('Error reading script URL from storage:', error);
    return null;
  }
};

/**
 * Save the Google Apps Script URL
 */
export const setScriptUrl = async (url: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(SCRIPT_URL_KEY, url);
    return true;
  } catch (error) {
    console.error('Error saving script URL to storage:', error);
    return false;
  }
};

/**
 * Clear all stored settings
 */
export const clearSettings = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(SCRIPT_URL_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing settings:', error);
    return false;
  }
};
