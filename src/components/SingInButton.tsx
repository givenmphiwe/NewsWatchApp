import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SignInButtonProps = {
  onPress: () => void;
  title: string;
};

const SignInButton: React.FC<SignInButtonProps> = ({ onPress, title }) => {
  return (
    <View className="flex items-center justify-center">
      <TouchableOpacity
        style={{ backgroundColor: "#00AFFF" }}
        className="py-3 px-10 rounded-full"
        onPress={onPress}
      >
        <Text className="text-white text-lg font-semibold">{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInButton;
