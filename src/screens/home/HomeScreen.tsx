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
import { auth } from "../../../firebaseConfig";
import {
  getDatabase,
  ref,
  onValue,
  update,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import CategoryScreen from "./CategoryScreen";

const HomeScreen = () => {
  const { theme } = useTheme();
  const { uiStore } = rootStore;
  const navigation = useNavigation();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [poll, setPoll] = useState<any>(null);
  const [pollId, setPollId] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const pollsRef = query(
      ref(db, "polls"),
      orderByChild("createdAt"),
      limitToLast(1)
    );

    const unsubscribe = onValue(pollsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const key = Object.keys(data)[0];
        setPollId(key);
        setPoll(data[key]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVote = (optionKey: string) => {
    if (!poll || !pollId) return;

    const db = getDatabase();
    const optionPath = `polls/${pollId}/options/${optionKey}`;
    const currentVotes = poll.options[optionKey] || 0;

    update(ref(db), {
      [optionPath]: currentVotes + 1,
    });
  };

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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setRole(data.role || "media");
            // other setUserData, etc.
          }
        });
      }
    });
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
      {role === "media" && <Header onTabSelect={handleTabSelect} />}
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007AFF" className="mt-6" />
      ) : error ? (
        <Text className="text-red-600 p-4">{error}</Text>
      ) : role === "media" ? (
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
            <View key={index}>
              <TouchableOpacity
                onPress={() => handleArticlePress(article)}
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
                {article.urlToImage && (
                  <Image
                    source={{ uri: article.urlToImage }}
                    className="w-full h-52"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4">
                  <Text
                    className="text-lg font-bold mb-1"
                    style={{ color: theme.text, lineHeight: 23 }}
                  >
                    {article.title}
                  </Text>
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs" style={{ color: theme.text }}>
                      Published:{" "}
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="mb-4" style={{ color: theme.secondary }}>
                    {article.description}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Insert poll after the 2nd article (index === 1) */}
              {index === 1 && poll && (
                <View
                  className="p-4 mb-4 rounded-lg bg-white shadow-md"
                  style={{ backgroundColor: theme.background }}
                >
                  <Text
                    className="text-xl font-semibold mb-3"
                    style={{ color: theme.text }}
                  >
                    {poll.question}
                  </Text>
                  {poll && (
                    <View className="rounded-xl overflow-hidden mb-4 shadow-xl">
                      {(() => {
                        const options = poll?.options as Record<string, number>;
                        const totalVotes =
                          Object.values(options).reduce(
                            (sum, v) => sum + v,
                            0
                          ) || 1;

                        return Object.entries(options).map(([key, value]) => {
                          const percentage = (value / totalVotes) * 100;

                          return (
                            <TouchableOpacity
                              key={key}
                              onPress={() => handleVote(key)}
                              className="mb-4"
                            >
                              <Text className="mb-1 text-black dark:text-white">
                                {key} ({value} votes)
                              </Text>

                              <View className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                <View
                                  className="h-full bg-blue-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </View>
                            </TouchableOpacity>
                          );
                        });
                      })()}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <CategoryScreen />
      )}
    </View>
  );
};

export default HomeScreen;
