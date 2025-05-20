import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import SignInButton from "../../components/SingInButton";
import { useTheme } from "../../context/ThemeContext";

const PostScreen = () => {
  const { theme } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onPost = async () => {
    // POST logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ alignItems: "center" }}
          style={{ backgroundColor: theme.background }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            className="w-full h-40 border border-gray-300 bg-gray-200 rounded-lg justify-center items-center mb-4 mt-7"
            onPress={pickImage}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
                resizeMode="cover"
              />
            ) : (
              <>
                <FontAwesome5 name="plus" size={25} color={theme.secondary} />
                <Text className="text-gray-500" style={{ color: theme.text }}>
                  Add Post Images
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TextInput
            className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4"
            placeholder="Add Heading"
            placeholderTextColor={theme.text}
          />
          <TextInput
            className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4"
            placeholder="Add Tag"
            placeholderTextColor={theme.text}
          />

          <View className="w-full border border-gray-300 rounded-lg mb-4">
            <Text className="px-3 py-2 text-gray-500">Select Category</Text>
          </View>

          <TextInput
            className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4"
            placeholder="Add Video Link"
            placeholderTextColor={theme.text}
          />

          <TextInput
            className="w-full h-28 border border-gray-300 rounded-lg px-3 mt-4 mb-5"
            placeholder="Write Articles"
            multiline={true}
            placeholderTextColor={theme.text}
          />
          <SignInButton onPress={onPost} title="POST" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PostScreen;
