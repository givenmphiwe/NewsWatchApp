import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeTheme = async (theme: string) => {
  try {
    await AsyncStorage.setItem("theme", theme);
  } catch (error) {
    console.error("Failed to store the theme:", error);
  }
};

export const retrieveTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem("theme");
    return theme || "light";
  } catch (error) {
    console.error("Failed to retrieve the theme:", error);
    return "light";
  }
};

export const storeProfileImage = async (uri: string) => {
  try {
    await AsyncStorage.setItem("profileImage", uri);
  } catch (error) {
    console.error("Failed to store profile image:", error);
  }
};

export const retrieveProfileImage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("profileImage");
  } catch (error) {
    console.error("Failed to retrieve profile image:", error);
    return null;
  }
};

export const storePollVoted = async (pollId: string) => {
  try {
    await AsyncStorage.setItem(`poll_voted_${pollId}`, "true");
  } catch (error) {
    console.error("Failed to store poll voted status:", error);
  }
};

export const retrievePollVoted = async (pollId: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(`poll_voted_${pollId}`);
    return value === "true";
  } catch (error) {
    console.error("Failed to retrieve poll voted status:", error);
    return false;
  }
};