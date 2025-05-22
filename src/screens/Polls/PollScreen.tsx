import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SignInButton from "../../components/SingInButton";
import { getDatabase, ref, push, set } from "firebase/database";

const PollScreen = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [optionsErrors, setOptionsErrors] = useState<string[]>([]);

  const addOption = () => {
    const newOption = {
      id: Date.now(),
      text: "",
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const updateOptionText = (id: number, newText: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, text: newText } : option
      )
    );
  };

  type OptionsType = Record<string, number>;

  const handlePost = () => {
    let hasError = false;

    if (!question.trim()) {
      setQuestionError("Question is required");
      hasError = true;
    } else {
      setQuestionError("");
    }

    const newErrors: string[] = options.map((opt) =>
      !opt.text.trim() ? "This option cannot be empty" : ""
    );

    if (newErrors.some((err) => err)) {
      setOptionsErrors(newErrors);
      hasError = true;
    } else {
      setOptionsErrors([]);
    }

    if (hasError) return;

    // proceed to post
    const db = getDatabase();
    const pollsRef = ref(db, "polls");
    const newPollRef = push(pollsRef);

    const optionsObj: OptionsType = options.reduce((obj, opt) => {
      obj[opt.text.trim()] = 0;
      return obj;
    }, {} as OptionsType);

    const pollData = {
      question: question.trim(),
      options: optionsObj,
      createdAt: Date.now(),
    };

    set(newPollRef, pollData)
      .then(() => {
        setQuestion("");
        setOptions([
          { id: 1, text: "" },
          { id: 2, text: "" },
        ]);
        setSuccessMessage("Poll successfully posted!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        alert("Error posting poll: " + error.message);
      });
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className="bg-gray-100 rounded-2xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <MaterialCommunityIcons name="menu" size={20} color="black" />
          <TextInput
            placeholder="Enter your question"
            className="text-base flex-1 pr-4 text-gray-800 border-b border-gray-300 pb-1"
            placeholderTextColor="#888"
            value={question}
            onChangeText={(text) => {
              setQuestion(text);
              if (text.trim()) setQuestionError("");
            }}
          />

          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color="black"
          />
        </View>
        {questionError !== "" && (
          <Text className="text-red-500 ml-3 text-sm">{questionError}</Text>
        )}
      </View>

      <View className="bg-gray-100 rounded-2xl p-4 mb-5">
        {options.map((option, index) => (
          <View key={option.id} className="mb-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <TextInput
                  value={option.text}
                  onChangeText={(text) => {
                    updateOptionText(option.id, text);
                    const updatedErrors = [...optionsErrors];
                    updatedErrors[index] = text.trim()
                      ? ""
                      : "This option cannot be empty";
                    setOptionsErrors(updatedErrors);
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="text-base pr-4 text-gray-800 border-b border-gray-300 pb-1"
                  placeholderTextColor="#aaa"
                />
                {optionsErrors[index] && (
                  <Text className="text-red-500 text-sm mt-1">
                    {optionsErrors[index]}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => removeOption(option.id)}
                className="w-8 h-8 ml-2 rounded-full bg-white border items-center justify-center"
              >
                <MaterialCommunityIcons name="close" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={addOption}
          style={{ backgroundColor: "#00AFFF" }}
          className="mt-2 self-start px-4 py-2 rounded-full"
        >
          <Text className="text-white font-semibold text-sm">+ Add Option</Text>
        </TouchableOpacity>
      </View>

      <SignInButton onPress={handlePost} title="Post" />

      {successMessage !== "" && (
        <Text className="text-green-600 mt-3 text-base font-medium">
          {successMessage}
        </Text>
      )}
    </ScrollView>
  );
};

export default PollScreen;
