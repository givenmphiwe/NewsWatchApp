import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTheme = async (theme: string) => {
  try {
    await AsyncStorage.setItem('theme', theme);
  } catch (error) {
    console.error('Failed to store the theme:', error);
  }
};

export const retrieveTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme || 'light';
  } catch (error) {
    console.error('Failed to retrieve the theme:', error);
    return 'light';
  }
};