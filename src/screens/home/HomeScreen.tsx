import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  DimensionValue,
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
  child,
  get,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import CategoryScreen from "./CategoryScreen";
import { Ionicons } from "@expo/vector-icons";
import { retrievePollVoted, storePollVoted } from "../../utils/storage";
import { formatDate } from "../../utils/formatDate";
import { WebView } from "react-native-webview";

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
  const [showProgress, setShowProgress] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollInsertIndex, setPollInsertIndex] = useState<number | null>(null);

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

        const randomIndex =
          Math.floor(Math.random() * (news.length > 1 ? news.length - 1 : 1)) +
          1;
        setPollInsertIndex(randomIndex);

        (async () => {
          const voted = await retrievePollVoted(key);
          setHasVoted(voted);
        })();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (optionKey: string) => {
    if (!poll || !pollId) return;

    const db = getDatabase();
    const optionPath = `polls/${pollId}/options/${optionKey}`;
    const currentVotes = poll.options[optionKey] || 0;

    try {
      await update(ref(db), {
        [optionPath]: currentVotes + 1,
      });

      await storePollVoted(pollId);
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to update vote:", error);
    }
  };
  const fetchFirebaseNews = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, "News"));

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, value]: any) => ({
      id,
      ...value,
      source: "firebase",
    }));
  };
  const loadNews = async () => {
    try {
      const [apiArticles, firebaseArticles] = await Promise.all([
        fetchNews({ query: uiStore.categories }),
        fetchFirebaseNews(),
      ]);

      const combined = [...apiArticles, ...firebaseArticles].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNews(combined);
      setError(null);

      const randomIndex = Math.floor(Math.random() * (combined.length - 1)) + 1;
      setPollInsertIndex(randomIndex);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setRole(data.role || "media");
            // Now that role is set, loading can be released
            setLoading(false);
          } else {
            // Optional: handle the case where user data is missing
            setError("User data not found");
            setLoading(false);
          }
        });
      } else {
        // Handle not authenticated
        setError("User not authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
                {article.videoLink ? (
                  <View className="w-full h-52">
                    <WebView
                      source={{ uri: article.videoLink }}
                      style={{ flex: 1 }}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                    />
                  </View>
                ) : null}
                <View className="p-4">
                  <Text
                    className="text-lg font-bold mb-1"
                    style={{ color: theme.text, lineHeight: 23 }}
                  >
                    {article.title}
                  </Text>
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs" style={{ color: theme.text }}>
                      Published: {formatDate(article.publishedAt)}
                    </Text>
                  </View>
                  <Text className="mb-4" style={{ color: theme.secondary }}>
                    {article.description}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Insert poll after the 2nd article (index === 1) */}
              {index === pollInsertIndex && poll && (
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

                  {(() => {
                    const options = poll?.options as Record<string, number>;
                    const totalVotes =
                      Object.values(options).reduce((sum, v) => sum + v, 0) ||
                      1;

                    return (
                      <>
                        {Object.entries(options).map(([key, value]) => {
                          const percentage = (
                            (value / totalVotes) *
                            100
                          ).toFixed(1);
                          const selected = selectedOption === key;

                          return (
                            <View key={key} className="mb-4">
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedOption(key);
                                  handleVote(key);
                                }}
                                className="flex-row items-center mb-1"
                              >
                                <Ionicons
                                  name={
                                    selected
                                      ? "radio-button-on"
                                      : "radio-button-off"
                                  }
                                  size={20}
                                  color={selected ? "#007bff" : "#999"}
                                  className="mr-2"
                                />
                                <Text className="text-black dark:text-white flex-1">
                                  {key}
                                </Text>
                              </TouchableOpacity>

                              {showProgress && (
                                <View className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden relative">
                                  <View
                                    className="h-full bg-blue-500"
                                    style={{
                                      width: `${percentage}%` as DimensionValue,
                                    }}
                                  />
                                  <Text className="absolute text-white text-xs w-full text-center top-0">
                                    {percentage}%
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}

                        <TouchableOpacity
                          onPress={() => setShowProgress((prev) => !prev)}
                          className="mt-2"
                        >
                          <Text className="text-blue-500 text-sm">
                            {showProgress ? "Hide Results" : "Show Results"}
                          </Text>
                        </TouchableOpacity>
                      </>
                    );
                  })()}
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
