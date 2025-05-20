import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import LogoHeader from "../../components/LogoHeader";
import SignInButton from "../../components/SingInButton";
import loaderStore from "../../state/LoaderStore";
import { sendOtp } from "../../api/sendOtp";
import otpStore from "../../state/OtpStore";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({ email: "", code: "" });
  const [status, setStatus] = useState("");

  const handleSendOtp = async () => {
    console.log("Sending OTP to:", email);
    loaderStore.showLoader();
    try {
      const result = await sendOtp(email);
      setStatus(`OTP sent successfully: ${result.otp}`);
      console.log("OTP sent successfully:", result);
      otpStore.setOtp(result.otp);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      loaderStore.hideLoader();
    }
  };
  const handleVerify = async () => {
    const newErrors = {
      email: email.trim() ? "" : "Email is required",
      code: code.trim() ? "" : "Verification code is required",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (!hasError) {
      loaderStore.showLoader();
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (code === otpStore.otp) {
          navigation.navigate("ResetPassword");
        } else {
          setStatus("Incorrect OTP");
        }
      } finally {
        loaderStore.hideLoader();
      }
    }
  };

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
        <View className="items-center mt-10">
          <LogoHeader />
        </View>

        <View className="flex-1 justify-center">
          <View className="mb-4">
            <Text style={{ color: theme.textSecondary }} className="mb-1">
              Enter Your Email
            </Text>

            <View className="relative">
              <TextInput
                className="border-b border-gray-300 py-2 pr-20 text-base"
                placeholder="email@email.com"
                placeholderTextColor={theme.text}
                value={email}
                keyboardType="email-address"
                style={{ color: theme.text }}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />

              {email.trim().length > 5 &&
                /^[^\s@]+@[^\s@]+\.(com|co\.za|net|org|edu|gov|io|info)$/.test(
                  email
                ) && (
                  <TouchableOpacity
                    style={{ backgroundColor: "#00AFFF" }}
                    onPress={handleSendOtp}
                    className="absolute -top-3 right-0 px-2 py-1 rounded-full"
                  >
                    <Text className="text-white text-xs font-medium">
                      Get OTP?
                    </Text>
                  </TouchableOpacity>
                )}
            </View>

            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : status && !status.startsWith("Error") ? (
              <Text className="text-green-600 text-xs mt-1">
                OTP sent successfully
              </Text>
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
                if (errors.code) {
                  setErrors((prev) => ({ ...prev, code: "" }));
                }
              }}
            />
            {errors.code ? (
              <Text className="text-red-500 text-xs mt-1">{errors.code}</Text>
            ) : null}
          </View>

          <SignInButton onPress={handleVerify} title="Verify" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
