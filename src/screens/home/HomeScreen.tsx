import React from 'react';
import { View } from 'react-native';
import Header from '../../components/Header';
import { useTheme } from "../../context/ThemeContext";


const HomeScreen = () => {
    const { theme } = useTheme();

  return (
    <View className="flex-1 " style={{ backgroundColor: theme.background }}>
      <Header />
      {/* Your screen content here */}
    </View>
  );
};

export default HomeScreen;