import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async (prompt: string) => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a prompt");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/generate-story`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        },
      );
      const data = await response.json();
      setStory(data.story);
      return data.story;
    } catch (error) {
      Alert.alert("Error", "Failed to generate story. Please try again.");
      console.error("Error generating story:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveStory = async (prompt: string, story: string) => {
    try {
      const existing = await AsyncStorage.getItem("stories");
      let stories = existing ? JSON.parse(existing) : [];
      const newStory = {
        id: Date.now().toString(),
        prompt,
        story,
      };
      stories.push(newStory);
      await AsyncStorage.setItem("stories", JSON.stringify(stories));
      Alert.alert("Success", "Story saved successfully!");
      setPrompt("");
      setStory("");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save story. Please try again.");
      console.error("Error saving story:", error);
    }
  };

  return (
    <SafeAreaView className="w-full flex-1 bg-slate-900">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
      >
        {/* Header Section */}
        <View className="px-4 pb-6 items-center">
          <Text className="text-4xl font-bold text-white mb-2">
            Story Generator
          </Text>
          <Text className="text-slate-400 text-base">
            Bring your imagination to life with AI-powered stories
          </Text>
        </View>

        {/* Input Section */}
        <View className="px-4 mb-6">
          <Text className="text-white font-semibold text-sm mb-3">
            Your Prompt
          </Text>
          <TextInput
            placeholder="Enter your story prompt..."
            placeholderTextColor="#94a3b8"
            className="w-full border border-slate-600 rounded-lg py-4 px-4 text-white bg-slate-700 text-base"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Generate Button */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            onPress={() => generateStory(prompt)}
            disabled={loading}
            className={`w-full rounded-lg py-4 px-6 items-center justify-center ${
              loading ? "bg-blue-600 opacity-70" : "bg-blue-600"
            }`}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-2">
                  Generating...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg">
                Generate Story
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Story Display Section */}
        {story && (
          <View className="px-4 mb-6">
            <Text className="text-white font-semibold text-sm mb-3">
              Generated Story
            </Text>
            <View className="bg-slate-700 border border-slate-600 rounded-lg p-4 min-h-48 max-h-96">
              <ScrollView>
                <Text className="text-slate-100 text-base leading-6">
                  {story}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!story && !loading && (
          <View className="px-4 mb-6">
            <View className="bg-slate-700 border border-dashed border-slate-600 rounded-lg p-8 items-center justify-center min-h-48">
              <Text className="text-slate-400 text-base text-center">
                Your story will appear here after generation
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {story && (
        <View className="absolute bottom-16 left-10 right-10">
          <TouchableOpacity
            onPress={() => saveStory(prompt, story)}
            className="w-full bg-green-600 rounded-lg py-2 px-12 items-center"
          >
            <Text className="text-white font-semibold text-lg">Save Story</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default StoryGenerator;
