import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../context/ThemeContext";
import { storeProfileImage, retrieveProfileImage } from "../../utils/storage"; // adjust path as needed

const ProfileScreen = () => {
  const { theme } = useTheme();
  const roles = [
    { id: "1", label: "Media Reporter", value: "media" },
    { id: "2", label: "Visitor", value: "visitor" },
  ];
  const [selectedRole, setSelectedRole] = useState("media");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access gallery is required!");
        }
      }

      const savedImage = await retrieveProfileImage();
      if (savedImage) {
        setImage(savedImage);
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await storeProfileImage(uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
        style={{ backgroundColor: theme.background }}
      >
        <Image
          source={{
            uri:
              image || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          className="w-28 h-28 rounded-full mt-6"
        />
        <TouchableOpacity onPress={pickImage}>
          <Text className="text-blue-500 mt-2">Change Profile Photo</Text>
        </TouchableOpacity>

        {[
          "Username",
          "First Name",
          "Last Name",
          "Email Id",
          "Change Password",
        ].map((placeholder, index) => (
          <TextInput
            key={index}
            className="w-[90%] h-12 bg-gray-100 rounded-full px-4 mt-4 text-gray-700"
            placeholder={placeholder}
            placeholderTextColor="#999"
          />
        ))}

        {/* Role Selection */}
        <View className="w-[90%] mt-6">
          <Text className="text-lg font-medium mb-2">I am a</Text>
          <View className="flex-row gap-8">
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                className="flex-row items-center mr-6"
                onPress={() => setSelectedRole(role.value)}
              >
                <View
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === role.value
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedRole === role.value && (
                    <View className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  )}
                </View>
                <Text
                  className={`ml-2 ${
                    selectedRole === role.value
                      ? "font-bold text-black"
                      : "text-gray-700"
                  }`}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
