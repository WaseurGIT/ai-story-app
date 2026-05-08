import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getStories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("stories");
      const parsedStories = data ? JSON.parse(data) : [];
      setStories(parsedStories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getStories();
    }, [getStories]),
  );

  const deleteStory = async (id: string) => {
    Alert.alert("Delete Story", "Are you sure you want to delete this story?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const data = await AsyncStorage.getItem("stories");
            let parsedStories = JSON.parse(data as string) || [];
            const updated = parsedStories.filter(
              (item: { id: string }) => item.id !== id,
            );
            await AsyncStorage.setItem("stories", JSON.stringify(updated));
            setStories(updated);
          } catch (error) {
            console.log(error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const viewStory = (id: string) => {
    const story = stories.find((s) => s.id === id);
    router.push({
      pathname: "/ReadStory",
      params: { story: JSON.stringify(story) },
    });
  };

  {
    loading && (
      <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center z-10">
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  const renderStoryCard = ({ item }: { item: any }) => (
    <View className="bg-slate-700 rounded-lg p-4 mb-4 border border-slate-600">
      <Text className="text-white font-bold text-lg mb-2 line-clamp-2">
        {item.prompt}
      </Text>
      <Text className="text-slate-300 text-sm mb-4 line-clamp-3">
        {item.story}
      </Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => viewStory(item.id)}
          className="flex-1 bg-blue-600 rounded py-2 items-center"
        >
          <Text className="text-white font-semibold">View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteStory(item.id)}
          className="flex-1 bg-red-600 rounded py-2 items-center"
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1"
      >
        <View className="px-4 pt-4 pb-6 items-center">
          <Text className="text-4xl font-bold text-white mb-2">
            AI Story Generator
          </Text>
          <Text className="text-slate-400 text-base">
            Create and manage your AI-generated stories
          </Text>
        </View>

        {/* Stories List */}
        <View className="px-4 mb-6">
          {stories.length > 0 ? (
            <>
              <Text className="text-white font-semibold text-lg mb-4">
                Your Stories ({stories.length})
              </Text>
              <FlatList
                data={stories}
                renderItem={renderStoryCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          ) : (
            <View className="bg-slate-700 border border-dashed border-slate-600 rounded-lg p-8 items-center justify-center">
              <Text className="text-slate-400 text-base text-center">
                No stories yet. Create your first story!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-16 left-10 right-10">
        <TouchableOpacity
          onPress={() => router.push("/StoryGenerator")}
          className="w-full bg-blue-600 rounded-lg py-3 items-center shadow-lg"
        >
          <Text className="text-white font-bold text-lg">Create New Story</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
