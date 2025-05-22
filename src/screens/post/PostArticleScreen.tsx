import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import SignInButton from "../../components/SingInButton";
import { useTheme } from "../../context/ThemeContext";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { Picker } from "@react-native-picker/picker";
import loaderStore from "../../state/LoaderStore";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const PostScreen = () => {
  const { theme } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [heading, setHeading] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("General");
  const [videoLink, setVideoLink] = useState("");
  const [article, setArticle] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({
    heading: "",
    tag: "",
    article: "",
  });
  const [userData, setUserData] = useState({
    username: "",
  });

  useEffect(() => {
    (async () => {
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
              };

              setUserData(loadedData);
            }
          });
        }
      });
    })();
  }, []);

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
    const newErrors = {
      heading: heading.trim() ? "" : "Heading is required",
      tag: tag.trim() ? "" : "Tag is required",
      article: article.trim() ? "" : "Article is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg !== "")) {
      return;
    }

    loaderStore.showLoader();

    try {
      const db = getDatabase();
      const postsRef = ref(db, "News");
      const newPostRef = push(postsRef);

      const sanitizedTag = tag.replace(/#/g, "");

      await set(newPostRef, {
        title: heading,
        author: userData.username,
        tag: sanitizedTag,
        Published: "time and date",
        category,
        videoLink,
        description: article.slice(0, 120),
        content: article,
        image: "Image not uploaded due to cost limitation",
        createdAt: new Date().toISOString(),
      });

      setSuccessMsg("Post submitted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);

      setHeading("");
      setTag("");
      setCategory("General");
      setVideoLink("");
      setArticle("");
      setImageUri(null);
      setErrors({ heading: "", tag: "", article: "" });
    } catch (error) {
      console.error(error);
    } finally {
      loaderStore.hideLoader();
    }
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
            value={heading}
            onChangeText={(text) => {
              setHeading(text);
              if (text.trim()) setErrors((e) => ({ ...e, heading: "" }));
            }}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-1"
            placeholder="Add Heading"
            placeholderTextColor={theme.text}
          />
          {errors.heading ? (
            <Text style={{ color: "red", marginBottom: 8 }}>
              {errors.heading}
            </Text>
          ) : null}

          <TextInput
            value={tag}
            onChangeText={(text) => {
              setTag(text);
              if (text.trim()) setErrors((e) => ({ ...e, tag: "" }));
            }}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-1"
            placeholder="Add Tag"
            placeholderTextColor={theme.text}
          />
          {errors.tag ? (
            <Text style={{ color: "red", marginBottom: 8 }}>{errors.tag}</Text>
          ) : null}

          <View className="w-full border border-gray-300 rounded-lg mb-4 bg-white">
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={{ height: 50 }}
              dropdownIconColor={theme.text}
            >
              <Picker.Item label="General" value="General" />
              <Picker.Item label="Technology" value="Technology" />
              <Picker.Item label="Health" value="Health" />
              <Picker.Item label="Business" value="Business" />
              <Picker.Item label="Sports" value="Sports" />
              <Picker.Item label="Entertainment" value="Entertainment" />
              <Picker.Item label="Education" value="Education" />
            </Picker>
          </View>

          <TextInput
            value={article}
            onChangeText={(text) => {
              setArticle(text);
              if (text.trim()) setErrors((e) => ({ ...e, article: "" }));
            }}
            className="w-full h-28 border border-gray-300 rounded-lg px-3 mt-5 mb-1"
            placeholder="Write Articles"
            multiline={true}
            placeholderTextColor={theme.text}
          />
          {errors.article ? (
            <Text style={{ color: "red", marginBottom: 16 }}>
              {errors.article}
            </Text>
          ) : null}

          <SignInButton onPress={onPost} title="POST" />

          {successMsg ? (
            <Text className="text-green-600 mt-2 font-bold">{successMsg}</Text>
          ) : null}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PostScreen;
