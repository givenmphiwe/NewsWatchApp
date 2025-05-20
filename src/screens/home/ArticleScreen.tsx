import React, { useRef } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { observer } from "mobx-react-lite";
import rootStore from "../../state/RootStore";
import { useTheme } from "../../context/ThemeContext";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "../../utils/formatDate";
import { useNavigation } from "@react-navigation/native";

const ArticleScreen = observer(() => {
  const { uiStore } = rootStore;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const article = uiStore.selectedArticle;
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View className="flex-1 relative">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-12 pb-3 bg-white">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row space-x-7">
          <TouchableOpacity
            onPress={() => {
              /* bookmark */
            }}
          >
            <Feather name="bookmark" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /* share */
            }}
          >
            <Feather name="share" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 60 }}
      >
        {article.urlToImage && (
          <Image source={{ uri: article.urlToImage }} className="w-full h-52" />
        )}

        <View className="p-4">
          <Text
            className="text-lg font-bold mb-2 leading-tight"
            style={{ color: theme.text, lineHeight: 23 }}
          >
            {article.title}
          </Text>

          <View className="flex-row items-center mb-3">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              className="w-7 h-7 rounded-full mr-2"
            />
            <Text
              className="text-sm mr-3"
              style={{ color: theme.text, flex: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {article.author}
            </Text>
            <Text className="text-xs opacity-60" style={{ color: theme.text }}>
              {formatDate(article.publishedAt)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity className="flex-row items-center space-x-1">
              <FontAwesome name="comment-o" size={16} color={theme.text} />
              <Text className="text-sm" style={{ color: theme.text }}>
                8 comments
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center space-x-1">
              <Feather name="heart" size={16} color={theme.text} />
              <Text className="text-sm" style={{ color: theme.text }}>
                34 likes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center space-x-1">
              <Feather name="share" size={16} color={theme.text} />
              <Text className="text-sm" style={{ color: theme.text }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm" style={{ color: theme.secondary }}>
            {article.content}
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={handleScrollToTop}
        className="absolute bottom-10 right-5 border p-2 rounded-full shadow"
      >
        <MaterialIcons name="arrow-upward" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
});

export default ArticleScreen;
