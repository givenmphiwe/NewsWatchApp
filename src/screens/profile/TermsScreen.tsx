import React from "react";
import { ScrollView, Text, View } from "react-native";
import termsData from "../../utils/termsData.json";
import { useTheme } from "../../context/ThemeContext";

const TermsScreen = () => {
  const { theme } = useTheme();
  return (
    <ScrollView
      className="flex-1  px-5 py-6"
      style={[{ backgroundColor: theme.background }]}
    >
      <Text className="text-2xl font-bold mb-4">Terms and Policies</Text>

      {termsData.map((section, idx) => (
        <View key={idx} className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            {section.section}
          </Text>

          {section.items.map((item, index) => (
            <View key={index} className="mb-3">
              <Text className="font-bold text-gray-700 mb-1">{item.title}</Text>
              <Text className="text-gray-600 text-sm leading-relaxed">
                {item.content}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <Text className="text-sm text-gray-500 mb-5">
        If you have any questions regarding our terms or policies, feel free to
        contact our support team.
      </Text>
    </ScrollView>
  );
};

export default TermsScreen;
