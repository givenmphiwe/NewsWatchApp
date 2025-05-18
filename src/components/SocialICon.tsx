import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { SimpleLineIcons, AntDesign } from "@expo/vector-icons";

type Theme = {
  text: string;
};

type IconType = {
  Icon: React.ComponentType<any>;
  name: string;
};

const SocialIcons: React.FC<{ theme: Theme }> = ({ theme }) => {
  const icons: IconType[] = [
    { Icon: SimpleLineIcons, name: "social-google" },
    { Icon: SimpleLineIcons, name: "social-facebook" },
    { Icon: SimpleLineIcons, name: "social-twitter" },
    { Icon: AntDesign, name: "apple-o" },
  ];

  const handlePress = () => {
    Alert.alert("Notice", "⚠️ Still under construction");
  };

  return (
    <View className="flex-row justify-around w-full mb-12">
      {icons.map(({ Icon, name }, index) => (
        <TouchableOpacity
          key={index}
          className="p-3 rounded-lg border border-gray-400"
          onPress={handlePress}
        >
          <Icon name={name} size={24} color={theme.text} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SocialIcons;
