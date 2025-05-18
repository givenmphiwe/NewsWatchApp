import { View, Text, Image } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const SplashScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.background }}
    >
      <View className="flex-row items-center">
        <Image
          source={require("../../../assets/NewsWatch_logo.png")}
          className="w-14 h-14"
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold" style={{ color: theme.primary }}>
          News
        </Text>
        <Text className="text-4xl font-bold" style={{ color: theme.text }}>
          Watch
        </Text>
      </View>
      <Text
        className="text-sm text-center mt-1 mx-4"
        style={{ color: theme.text }}
      >
        All type of news from all trusted sources for all type of people
      </Text>
    </View>
  );
};

export default SplashScreen;
