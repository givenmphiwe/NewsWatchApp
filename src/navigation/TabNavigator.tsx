import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/Polls/PollScreen";
import { useTheme } from "../context/ThemeContext";
import { NavigationHelpersContext } from "@react-navigation/native";
import { TabParamList } from "./types";
import PostScreen from "../screens/post/PostArticleScreen";
import ArticleScreen from "../screens/home/ArticleScreen";
import PollScreen from "../screens/Polls/PollScreen";

const Tab = createBottomTabNavigator<TabParamList>();

const CustomTabBar = ({ state, navigation }: any) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index];
  if (
    currentRoute.name === "AddPost" ||
    currentRoute.name === "Profile" ||
    currentRoute.name === "Article"
  ) {
    return null;
  }

  return (
    <View
      className="flex-row justify-around items-center pt-2 pb-3 border-t border-gray-200"
      style={{
        paddingBottom: insets.bottom,
        backgroundColor: theme.background,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        if (route.name === "Article") return null;
        const isFocused = state.index === index;
        const onPress = () => navigation.navigate(route.name);
        const color = isFocused ? "#3B82F6" : "#A1A1AA";

        const getIcon = () => {
          switch (route.name) {
            case "Home":
              return "home";
            case "Ads":
              return "adversal";
            case "AddPost":
              return "add";
            case "Poll":
              return "poll-h";
            case "Profile":
              return "user-alt";
            default:
              return "user-alt";
          }
        };

        if (route.name === "AddPost") {
          return (
            <View key={route.key} className="items-center -mt-10">
              <TouchableOpacity
                onPress={onPress}
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{
                  backgroundColor: "#007AFF",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 10,
                  borderWidth: 6,
                  borderColor: "white",
                }}
              >
                <FontAwesome5 name="plus" size={25} color="white" />
              </TouchableOpacity>
              <Text
                className={`text-xs mt-1 ${
                  isFocused ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Add Post
              </Text>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="items-center justify-center"
          >
            <FontAwesome5 name={getIcon()} size={22} color={color} />
            <Text
              className={`text-xs ${
                isFocused ? "text-blue-500" : "text-gray-400"
              }`}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigator = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props: any) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ads" component={SettingsScreen} />
      <Tab.Screen
        name="AddPost"
        component={PostScreen}
        options={({
          navigation,
        }: NavigationHelpersContext<TabParamList, "AddPost">) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.background,
          },

          title: "",
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="ml-5"
            >
              <FontAwesome5 name="arrow-left" size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="Poll" component={PollScreen} options={({
          navigation,
        }: NavigationHelpersContext<TabParamList, "Profile">) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.background,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 10,
          },
          headerTitleAlign: "center",
          title: "Create Poll",
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="ml-5"
            >
              <FontAwesome5 name="arrow-left" size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({
          navigation,
        }: NavigationHelpersContext<TabParamList, "Profile">) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.background,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 10,
          },
          headerTitleAlign: "center",
          title: "My Profile",
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="ml-5"
            >
              <FontAwesome5 name="arrow-left" size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Article"
        component={ArticleScreen}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
