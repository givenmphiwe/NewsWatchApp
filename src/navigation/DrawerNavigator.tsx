import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import CustomDrawerContent from "../components/CustomDrawer/CustomDrawerContent";
import { DrawerParamList } from "./types";
import { useTheme } from "../context/ThemeContext";

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
     const { theme } = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        options={{
          drawerItemStyle: { display: "none" },
        }}
        component={TabNavigator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
