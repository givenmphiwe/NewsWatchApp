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
import { storeProfileImage, retrieveProfileImage } from "../../utils/storage";
import { auth } from "../../../firebaseConfig";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import SignInButton from "../../components/SingInButton";
import loaderStore from "../../state/LoaderStore";

const ProfileScreen = () => {
  const { theme } = useTheme();
  const roles = [
    { id: "1", label: "Media Reporter", value: "media" },
    { id: "2", label: "Visitor", value: "visitor" },
  ];
  const navigation = useNavigation();

  const [selectedRole, setSelectedRole] = useState("media");
  const [image, setImage] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });


  const [originalData, setOriginalData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    role: "media",
  });

  const [hasChanges, setHasChanges] = useState(false);

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

      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          const db = getDatabase();
          const userRef = ref(db, `users/${uid}`);
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const loadedData = {
                username: data.username || "",
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || user.email || "",
                password: "",
              };

              setUserData(loadedData);
              setSelectedRole(data.role || "media");

              setOriginalData({
                username: loadedData.username,
                firstName: loadedData.firstName,
                lastName: loadedData.lastName,
                role: data.role || "media",
              });
              setHasChanges(false);
            }
          });
        }
      });
    })();
  }, []);

  const checkChanges = (
    currentData: typeof userData,
    currentRole: string,
    original: typeof originalData
  ) => {
    return (
      currentData.username !== original.username ||
      currentData.firstName !== original.firstName ||
      currentData.lastName !== original.lastName ||
      currentRole !== original.role
    );
  };

  const updateUserData = (field: keyof typeof userData, value: string) => {
    const newUserData = { ...userData, [field]: value };
    setUserData(newUserData);
    setHasChanges(checkChanges(newUserData, selectedRole, originalData));
  };

  const updateRole = (roleValue: string) => {
    setSelectedRole(roleValue);
    setHasChanges(checkChanges(userData, roleValue, originalData));
  };

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

  const handleSaveProfile = () => {
    const user = auth.currentUser;
    loaderStore.showLoader();
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      update(userRef, {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: selectedRole,
      })
        .then(() => {
          loaderStore.hideLoader();
          setOriginalData({
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: selectedRole,
          });
          setHasChanges(false);
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          alert("Failed to update profile.");
          loaderStore.hideLoader();
        });
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

        <TextInput
          value={userData.username}
          onChangeText={(text) => updateUserData("username", text)}
          className="w-[90%] h-12 bg-gray-100 rounded-full px-4 mt-4 text-gray-700"
          placeholder="Username"
          placeholderTextColor="#999"
        />
        <TextInput
          value={userData.firstName}
          onChangeText={(text) => updateUserData("firstName", text)}
          className="w-[90%] h-12 bg-gray-100 rounded-full px-4 mt-4 text-gray-700"
          placeholder="First Name"
          placeholderTextColor="#999"
        />
        <TextInput
          value={userData.lastName}
          onChangeText={(text) => updateUserData("lastName", text)}
          className="w-[90%] h-12 bg-gray-100 rounded-full px-4 mt-4 text-gray-700"
          placeholder="Last Name"
          placeholderTextColor="#999"
        />
        <TextInput
          value={userData.email}
          editable={false}
          className="w-[90%] h-12 bg-gray-100 rounded-full px-4 mt-4 text-gray-500"
          placeholder="Email Id"
          placeholderTextColor="#999"
        />
        <TextInput
          value={userData.password}
          secureTextEntry
          editable={false}
          onPress={() => navigation.navigate("Register")}
          onChangeText={(text) => updateUserData("password", text)}
          className="w-[90%] h-12 bg-gray-100 rounded-full px-4 mt-4 text-gray-700"
          placeholder="Change Password"
          placeholderTextColor="#999"
        />

        {/* Role Selection */}
        <View className="w-[90%] mt-6">
          <Text className="text-lg font-medium mb-2">I am a</Text>
          <View className="flex-row gap-8 mb-6">
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                className="flex-row items-center mr-6"
                onPress={() => updateRole(role.value)}
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

          {hasChanges ? (
            <SignInButton onPress={handleSaveProfile} title="Update" />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
