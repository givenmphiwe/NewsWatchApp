import React from "react";
import { View } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";
import Loader from "./src/components/Loader";

const App = () => {
  return (
    <ThemeProvider>
      <View className="flex-1 relative">
        <RootNavigator />
        <Loader />
      </View>
    </ThemeProvider>
  );
};

export default App;
