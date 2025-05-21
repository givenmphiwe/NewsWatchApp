import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "../../context/ThemeContext";
import { fetchNews } from "../../api/NewsApi";
import rootStore from "../../state/RootStore";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../utils/formatDate";

const CategoryScreen = () => {
  const { theme } = useTheme();
  const { uiStore } = rootStore;
  const navigation = useNavigation();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("all");

  const loadNews = async (query = searchQuery) => {
    try {
      setLoading(true);
      const articles = await fetchNews({ query });
      setNews(articles);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const tags = [
    "FridayMorning",
    "CollegeColorsDay",
    "Bitcoin",
    "instagramDown",
    "FridayFeeling",
    "knifeTalk",
    "ThursdayVibes",
    "DigitalCurrency",
    "Cryptocurrency",
  ];

  const handleArticlePress = (article: any) => {
    uiStore.setSelectedArticle(article);
    navigation.navigate("Article");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
  };

  return (
    <View className="flex-1 bg-white px-4 py-3">
      <View className="mb-4 mt-5 flex-row items-center bg-gray-100 rounded-xl px-3">
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 py-3"
        />
        <TouchableOpacity onPress={() => loadNews(searchQuery)}>
          <Entypo name="magnifying-glass" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#007AFF"
                    colors={["#007AFF"]}
                  />
                }
      >
        {/* Popular Tags */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">Popular Tags</Text>
            <Text className="text-blue-500 font-bold">View All</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap">
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedTag(tag);
                    setSearchQuery(tag);
                    loadNews(tag);
                  }}
                  className={`px-2 py-1 mr-2 mb-2 rounded ${
                    selectedTag === tag ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      selectedTag === tag ? "text-white" : "text-gray-700"
                    }`}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Latest News */}
        <View className="h-px bg-gray-300 mb-1" />
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">Latest News</Text>
            <Text className="text-blue-500 font-bold">View All</Text>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {news.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="mr-4 w-64"
                  onPress={() => handleArticlePress(item)}
                >
                  <Image
                    source={{
                      uri: item.urlToImage || "https://via.placeholder.com/150",
                    }}
                    className="h-36 rounded-xl mb-2"
                  />
                  <Text
                    className="font-medium text-base"
                    style={{ color: theme.text, lineHeight: 15 }}
                    numberOfLines={2}
                  >
                    {item.title}{" "}
                  </Text>
                  <View className="flex-row items-center space-x-1">
                    <Text
                      className="text-blue-500 text-xs font-light"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ maxWidth: "50%" }}
                    >
                      {item.source?.name || "Source"}
                    </Text>
                    <Text className="text-gray-400 text-xs ">
                      {formatDate(item.publishedAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recommendation Topics */}
        <View className="h-px bg-gray-300 mb-4" />
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">Recomendation Topic</Text>
            <Text className="text-blue-500 font-bold">View All</Text>
          </View>
          {news.slice(5, 10).map((item, index) => (
            <TouchableOpacity
              onPress={() => handleArticlePress(item)}
              key={index}
              className="flex-row mb-4 items-center"
            >
              <View className="flex-1">
                <Text
                  className="font-medium"
                  style={{ color: theme.text, lineHeight: 15 }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                <View className="flex-row items-center justify-between">
                  <Text className="text-blue-500 text-xs font-light">
                    {item.source?.name || "Source"}
                  </Text>

                  <Text className="text-gray-400 text-xs font-light mr-6">
                    {formatDate(item.publishedAt)}
                  </Text>
                </View>
              </View>
              <Image
                source={{
                  uri: item.urlToImage || "https://via.placeholder.com/100",
                }}
                className="w-20 h-20 rounded-lg mr-3"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryScreen;
