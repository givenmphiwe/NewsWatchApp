import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./TabNavigator";
import SplashScreen from "../screens/splash/SplashScreen";
import DrawerNavigator from "./DrawerNavigator";

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : isLoggedIn ? (
        <DrawerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
