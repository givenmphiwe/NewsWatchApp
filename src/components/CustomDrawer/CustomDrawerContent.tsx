import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { storeTheme, retrieveTheme } from "../../utils/storage";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const drawerItems: { label: string; icon: MaterialIconName }[] = [
  { label: "Profile", icon: "account-outline" },
  { label: "My Wallet", icon: "wallet-outline" },
  { label: "My Post", icon: "note-edit-outline" },
  { label: "Boost Your Post", icon: "rocket-launch-outline" },
  { label: "Notifications", icon: "bell-outline" },
  { label: "Terms and Conditions", icon: "file-document-outline" },
  { label: "About", icon: "information-outline" },
  { label: "Watch Ads & Earn", icon: "star-outline" },
  { label: "Refer and Earn", icon: "share-outline" },
];

const CustomDrawerContent = (props: any) => {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await retrieveTheme();
      setCurrentTheme(savedTheme);
    };
    fetchTheme();
  }, []);

  const handleThemeToggle = async () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    await storeTheme(newTheme);
    toggleTheme();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-row justify-between items-center p-5">
        <Text className="font-bold text-xl" style={{ color: theme.text }}>
          Settings
        </Text>
        <TouchableOpacity onPress={handleThemeToggle}>
          <MaterialCommunityIcons
            name={
              currentTheme === "light" ? "white-balance-sunny" : "weather-night"
            }
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>
      {drawerItems.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            onPress={() => navigation.navigate(item.label)}
            className="flex-row items-center p-4"
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={theme.text}
            />
            <Text className="ml-2 text-sm flex-1" style={{ color: theme.text }}>
              {item.label}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <View className="h-px bg-gray-300 mx-4" />
        </View>
      ))}
      <TouchableOpacity
        onPress={handleLogout}
      >
        <View className="flex-row items-center p-4">
          <MaterialCommunityIcons
            name="exit-to-app"
            size={24}
            color={theme.text}
          />
          <Text className="ml-2 text-sm flex-1" style={{ color: theme.text }}>
            Log Out
          </Text>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
