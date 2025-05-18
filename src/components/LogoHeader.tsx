import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "../../src/context/ThemeContext";

const LogoHeader = () => {
  const { theme } = useTheme();
  return (
    <View className="flex-row items-center">
      <Image
        source={require("../../assets/NewsWatch_logo.png")}
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
  );
};

export default LogoHeader;
