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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import loaderStore from "../../state/LoaderStore";

const RegisterScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("media");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  const roles = [
    { id: "1", label: "Media Reporter", value: "media" },
    { id: "2", label: "Visitor", value: "visitor" },
  ];

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isStrongPassword = (password: string) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    const newErrors = {
      username: username.trim() ? "" : "Username is required",
      email: email.trim()
        ? isValidEmail(email)
          ? ""
          : "Enter a valid email"
        : "Email is required",
      password: password.trim()
        ? isStrongPassword(password)
          ? ""
          : "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
        : "Password is required",
      mobile: mobile.trim() ? "" : "Mobile number is required",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (!hasError) {
      loaderStore.showLoader();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        // Store user details in Realtime Database
        const db = getDatabase();
        await set(ref(db, `users/${user.uid}`), {
          username,
          email,
          mobile,
          role: selectedRole,
          createdAt: new Date().toISOString(),
        });

        navigation.navigate("Home");
      } catch (error) {
        console.error("Registration error:", error);
        if (typeof error === "object" && error !== null && "code" in error) {
          const err = error as { code: string };
          if (err.code === "auth/email-already-in-use") {
            setErrors((prev) => ({ ...prev, email: "Email already in use" }));
          }
        }
      } finally {
        loaderStore.hideLoader();
      }
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
            {username.length > 0 && (
              <Text
                className="text-sm mb-1"
                style={{ color: theme.textSecondary }}
              >
                Username
              </Text>
            )}
            <TextInput
              className="border-b border-gray-400 py-2"
              placeholder="Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: "" }));
                }
              }}
              placeholderTextColor={theme.textSecondary}
            />
            {errors.username ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.username}
              </Text>
            ) : null}
          </View>

          <View className="mb-4">
            {email.length > 0 && (
              <Text
                className="text-sm mb-1"
                style={{ color: theme.textSecondary }}
              >
                Email
              </Text>
            )}
            <TextInput
              className="border-b border-gray-400 py-2"
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              placeholderTextColor={theme.textSecondary}
            />
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            {mobile.length > 0 && (
              <Text
                className="text-sm mb-1"
                style={{ color: theme.textSecondary }}
              >
                Mobile Number
              </Text>
            )}
            <TextInput
              className="border-b border-gray-400 py-2"
              placeholder="Mobile Number"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                if (errors.mobile) {
                  setErrors((prev) => ({ ...prev, mobile: "" }));
                }
              }}
              placeholderTextColor={theme.textSecondary}
            />
            {errors.mobile ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            {password.length > 0 && (
              <Text
                className="text-sm mb-1"
                style={{ color: theme.textSecondary }}
              >
                Password
              </Text>
            )}
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
                placeholderTextColor={theme.textSecondary}
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

          <View className="w-[90%] mt-1 mb-5">
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
        </View>
        <SignInButton onPress={handleRegister} title="Sign Up" />
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
          <Text style={{ color: theme.text }}>
            By signing up to News24 you are accepting our{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
          ></TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.navigate("Terms")}>
            <Text className="font-bold" style={{ color: theme.text }}>
              Terms and Condition
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
