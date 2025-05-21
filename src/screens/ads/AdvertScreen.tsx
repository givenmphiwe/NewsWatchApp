import { View, Text, Image } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const AdvertScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.background }}
    >
      <Text>Ads Screen</Text>
    </View>
  );
};

export default AdvertScreen;
