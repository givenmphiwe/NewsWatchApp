import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import LogoHeader from "../../components/LogoHeader";
import SocialIcons from "../../components/SocialICon";
import SignInButton from "../../components/SingInButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { getDatabase, ref, onValue, orderByChild, query, get, equalTo } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import loaderStore from "../../state/LoaderStore";

const LoginScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
  const newErrors = {
    username: username.trim() ? "" : "Username is required",
    email: email.trim() ? "" : "Email is required",
    password: password.trim() ? "" : "Password is required",
  };

  setErrors(newErrors);

  const hasError = Object.values(newErrors).some((err) => err !== "");
  if (hasError) return;

  loaderStore.showLoader();

  try {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const usernameQuery = query(usersRef, orderByChild("username"), equalTo(username));
    const snapshot = await get(usernameQuery);

    if (!snapshot.exists()) {
      setErrors((prev) => ({ ...prev, username: "Username does not exist" }));
      loaderStore.hideLoader();
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);

  } catch (error) {
    console.error("Login error:", error);
    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code: string };
      if (err.code === "auth/user-not-found") {
        setErrors((prev) => ({ ...prev, email: "User not found" }));
      } else if (err.code === "auth/wrong-password") {
        setErrors((prev) => ({ ...prev, password: "Incorrect password" }));
      }
    }
  } finally {
    loaderStore.hideLoader();
  }
};


  return (
    <KeyboardAvoidingView
      className="flex-1 px-5"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ backgroundColor: theme.background }}
    >
      <View className="items-center mt-10">
        <LogoHeader />
      </View>

      <View className="flex-1 justify-center">
        <View>
          <View className="mb-4">
            <Text
              className="text-sm mb-1"
              style={{ color: theme.textSecondary }}
            >
              Username
            </Text>
            <TextInput
              className="border-b border-gray-400 py-2"
              placeholder="JohnSmith"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: "" }));
                }
              }}
              placeholderTextColor={theme.text}
            />
            {errors.username ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.username}
              </Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text
              className="text-sm mb-1"
              style={{ color: theme.textSecondary }}
            >
              Email
            </Text>
            <TextInput
              className="border-b border-gray-400 py-2"
              placeholder="email@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              placeholderTextColor={theme.text}
            />
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </View>
          <View className="mb-4">
            <Text
              className="text-sm mb-1"
              style={{ color: theme.textSecondary }}
            >
              Password
            </Text>
            <View className="flex-row items-center border-b border-gray-400">
              <TextInput
                className="flex-1 py-2"
                placeholder={showPassword ? "Password" : "*********"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                placeholderTextColor={theme.text}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Entypo
                  name={showPassword ? "eye" : "eye-with-line"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.password}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-right mb-8" style={{ color: theme.text }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
        <SignInButton onPress={handleSignIn} title="Sign In" />
      </View>

      <View className="items-center mb-10">
        <View className="flex-row items-center my-5 w-full">
          <View
            className="flex-1 h-px"
            style={{ backgroundColor: theme.text }}
          />
          <Text className="mx-2 " style={{ color: theme.text }}>
            or sign in with
          </Text>
          <View
            className="flex-1 h-px"
            style={{ backgroundColor: theme.text }}
          />
        </View>

        <SocialIcons theme={theme} />

        <View className="flex-row items-center">
          <Text style={{ color: theme.text }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="font-bold" style={{ color: theme.text }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
