import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import LogoHeader from "../../components/LogoHeader";
import SignInButton from "../../components/SingInButton";
import loaderStore from "../../state/LoaderStore";
import otpStore from "../../state/OtpStore";
import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; 

const ResetPasswordScreen = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    const newErrors = {
      email: email.trim() ? "" : "Email is required",
      code: code.trim() ? "" : "Verification code is required",
      newPassword: newPassword.trim() ? "" : "New password is required",
      confirmPassword: confirmPassword.trim()
        ? newPassword === confirmPassword
          ? ""
          : "Passwords do not match"
        : "Please confirm your password",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (!hasError) {
      loaderStore.showLoader();
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (code !== otpStore.otp) {
          setStatus("Incorrect OTP");
        } else {
          setStatus("OTP verified and password updated!");
          console.log("Password updated for:", email);
          // You can proceed to call your password update API here
        }
      } finally {
        loaderStore.hideLoader();
      }
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5"
      >
        {!keyboardVisible && (
          <View className="items-center mt-10">
            <LogoHeader />
          </View>
        )}

        <View className="flex-1 justify-center">
          <View className="mb-4">
            <Text style={{ color: theme.textSecondary }} className="mb-1">
              Enter Your Email
            </Text>
            <TextInput
              className="border-b border-gray-300 py-2 pr-20 text-base"
              placeholder="email@email.com"
              placeholderTextColor={theme.text}
              value={email}
              keyboardType="email-address"
              style={{ color: theme.text }}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text style={{ color: theme.textSecondary }} className="mb-1">
              Verification Code
            </Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-base"
              placeholder="Enter code"
              placeholderTextColor={theme.text}
              value={code}
              keyboardType="numeric"
              style={{ color: theme.text }}
              onChangeText={(text) => {
                setCode(text);
                if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
              }}
            />
            {errors.code ? (
              <Text className="text-red-500 text-xs mt-1">{errors.code}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text style={{ color: theme.textSecondary }} className="mb-1">
              Enter New Password
            </Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-base"
              placeholder="New password"
              placeholderTextColor={theme.text}
              secureTextEntry
              value={newPassword}
              style={{ color: theme.text }}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword)
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
            />
            {errors.newPassword ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.newPassword}
              </Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text style={{ color: theme.textSecondary }} className="mb-1">
              Re-Enter Password
            </Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-base"
              placeholder="Confirm password"
              placeholderTextColor={theme.text}
              secureTextEntry
              value={confirmPassword}
              style={{ color: theme.text }}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            {errors.confirmPassword ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </Text>
            ) : null}
          </View>

          <SignInButton onPress={handleVerify} title="Sign in" />

          {status ? (
            <Text className="text-center mt-4 text-sm text-gray-600">
              {status}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
