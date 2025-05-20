import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as Location from "expo-location";
import { DrawerParamList } from "../navigation/types";
import { useTheme } from "../context/ThemeContext";
import rootStore from "../state/RootStore";

interface HeaderProps {
  onTabSelect: (tabName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onTabSelect }) => {
  const { theme } = useTheme();
  const { uiStore } = rootStore;
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const [city, setCity] = useState("...");
  const [activeTab, setActiveTab] = useState("Popular");

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCity("Permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const address = await Location.reverseGeocodeAsync(coords);
      setCity(address[0]?.city || "Unknown city");
    };

    fetchLocation();
  }, []);

  const handleTabSelect = (tabName: string) => {
    setActiveTab(tabName);
    onTabSelect(tabName);

    uiStore.setCategory(tabName);
  };

  return (
    <>
      <View
        className="flex-row justify-between items-center px-4 pt-10 pb-3"
        style={{ backgroundColor: theme.background }}
      >
        {/* Left section */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            className="mr-2"
          >
            <Ionicons name="menu" size={24} color={theme.BtnPrimary} />
          </TouchableOpacity>
          <Ionicons
            name="location-sharp"
            size={16}
            color={theme.text}
            className="ml-3"
          />
          <Text
            className="ml-1 font-medium text-xs"
            style={{ color: theme.text }}
          >
            {city}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.text} />
        </View>

        {/* Right section */}
        <View className="flex-row items-center">
          <View
            className="flex-row items-center border border-gray-400 px-2 py-1 rounded-full"
            style={{ backgroundColor: theme.background }}
          >
            <View className="w-6 h-6 rounded-full bg-yellow-300 items-center justify-center">
              <AntDesign name="star" size={14} color="white" />
            </View>
            <Text
              className="ml-2 font-semibold text-sm"
              style={{ color: theme.text }}
            >
              599
            </Text>
          </View>

          <TouchableOpacity className="ml-4">
            <Ionicons name="notifications" size={24} color="#0096ff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Section */}
      <View
        className="border-b border-gray-300"
        style={{ backgroundColor: theme.background }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          className="pt-2"
        >
          {[
            "Popular",
            "All",
            "Politics",
            "Tech",
            "Healthy",
            "Science",
            "Agriculture",
          ].map((tab, index) => (
            <TouchableOpacity
              key={index}
              className="mx-2"
              onPress={() => handleTabSelect(tab)}
            >
              <Text
                className={`text-sm ${
                  activeTab === tab
                    ? "font-bold border-b-2 border-blue-500"
                    : "font-bold"
                }`}
                style={{ color: theme.secondary }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Header;
