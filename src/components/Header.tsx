import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as Location from "expo-location";
import { DrawerParamList } from "../navigation/types";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const [city, setCity] = useState("...");

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
      console.log(address);
      setCity(address[0]?.city || "Unknown city");
    };

    fetchLocation();
  }, []);

  return (
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
        <View className="flex-row items-center bg-yellow-100 border border-yellow-300 px-2 py-1 rounded-full">
          <AntDesign name="star" size={24} color="#f5b300" />
          <Text className="ml-1 font-semibold text-black text-sm">599</Text>
        </View>
        <TouchableOpacity className="ml-4">
          <Ionicons name="notifications" size={24} color="#0096ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
