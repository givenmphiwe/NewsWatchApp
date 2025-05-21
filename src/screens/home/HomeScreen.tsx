import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { useTheme } from "../../context/ThemeContext";
import { fetchNews } from "../../api/NewsApi";
import rootStore from "../../state/RootStore";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { theme } = useTheme();
  const { uiStore } = rootStore;
  const navigation = useNavigation();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      const articles = await fetchNews({ query: `${uiStore.categories}` });
      setNews(articles);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTabSelect = async (tabName: string) => {
    setLoading(true);
    await loadNews();
  };

  useEffect(() => {
    loadNews();
  }, [uiStore.categories]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
  };

  const handleArticlePress = (article: any) => {
    uiStore.setSelectedArticle(article);
    navigation.navigate("Article");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <Header onTabSelect={handleTabSelect} />
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007AFF" className="mt-6" />
      ) : error ? (
        <Text className="text-red-600 p-4">{error}</Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={["#007AFF"]}
            />
          }
        >
          {news.map((article, index) => (
            <TouchableOpacity
              onPress={() => handleArticlePress(article)}
              key={index}
              className="rounded-xl overflow-hidden mb-4 shadow-xl"
              style={{
                backgroundColor: theme.background,
                borderRadius: 12,
                marginBottom: 16,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {article.urlToImage ? (
                <Image
                  source={{ uri: article.urlToImage }}
                  className="w-full h-52"
                  resizeMode="cover"
                />
              ) : null}
              <View className="p-4">
                <Text
                  className="text-lg font-bold mb-1"
                  style={{ color: theme.text, lineHeight: 23 }}
                >
                  {article.title}
                </Text>
                <View className="flex-row font-bold justify-between items-center mb-1">
                  <Text className="text-xs" style={{ color: theme.text }}>
                    Published:{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text className=" mb-4" style={{ color: theme.secondary }}>
                  {article.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
