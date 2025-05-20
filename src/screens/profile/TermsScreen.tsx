import React from "react";
import { ScrollView, Text, View } from "react-native";
import termsData from "../../utils/termsData.json";
import { useTheme } from "../../context/ThemeContext";

const TermsScreen = () => {
  const { theme } = useTheme();

  return (
    <ScrollView
      className="flex-1 px-5 py-6"
      style={{ backgroundColor: theme.background }}
    >
      <Text className="text-3xl font-bold text-gray-900 mb-6">Terms and Policies</Text>

      {termsData.map((section, idx) => (
        <View key={idx} className="mb-1">
          <Text className="text-xl font-semibold text-gray-800 mb-3">
            {section.section}
          </Text>

          {section.items.map((item, index) => (
            <View key={index} className="mb-8">
              <Text className="text-base font-semibold text-gray-700 mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 leading-relaxed">
                {item.content}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default TermsScreen;
