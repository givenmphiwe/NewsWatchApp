import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PollScreen = () => {
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);

  const addOption = () => {
    const newOption = {
      id: Date.now(),
      text: "",
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: number) => {
    if (options.length <= 2) return; // minimum 2 options required
    setOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const updateOptionText = (id: number, newText: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, text: newText } : option
      )
    );
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className="bg-gray-100 rounded-2xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <MaterialCommunityIcons name="menu" size={20} color="black" />
          <TextInput
            placeholder="Enter your question"
            className="flex-1 mx-3 text-base"
            placeholderTextColor="#888"
          />
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color="black"
          />
        </View>
      </View>

      <View className="bg-gray-100 rounded-2xl p-4">
        {options.map((option, index) => (
          <View
            key={option.id}
            className="flex-row justify-between items-center mb-4"
          >
            <TextInput
              value={option.text}
              onChangeText={(text) => updateOptionText(option.id, text)}
              placeholder={`Option ${index + 1}`}
              className="text-base flex-1 pr-4 text-gray-800 border-b border-gray-300 pb-1"
              placeholderTextColor="#aaa"
            />
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity
                onPress={() => removeOption(option.id)}
                className="w-8 h-8 rounded-full bg-white border items-center justify-center"
              >
                <MaterialCommunityIcons name="close" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

       
        <TouchableOpacity
          onPress={addOption}
          className="bg-blue-600 mt-2 self-start px-4 py-2 rounded-full"
        >
          <Text className="text-white font-semibold text-sm">+ Add Option</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PollScreen;
