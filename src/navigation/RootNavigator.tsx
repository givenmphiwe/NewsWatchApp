import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./TabNavigator";
import SplashScreen from "../screens/splash/SplashScreen";
import DrawerNavigator from "./DrawerNavigator";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : user ? (
        <DrawerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
