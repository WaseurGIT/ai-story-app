import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReadStory() {
  const { story: storyParam } = useLocalSearchParams();

  let story = null;
  try {
    story = storyParam ? JSON.parse(storyParam as string) : null;
  } catch (error) {
    console.error("Error parsing story:", error);
  }

  if (!story) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center px-6">
        <Text className="text-white text-lg">Story not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 rounded-lg py-3 px-6 mt-4"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pb-4">
          {/* <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-blue-500 font-semibold text-base">
              ← Back
            </Text>
          </TouchableOpacity> */}

          <Text className="text-3xl font-bold text-white mb-2">
            {story.prompt}
          </Text>
          {/* <Text className="text-slate-400 text-sm">Story ID: {story.id}</Text> */}
        </View>

        {/* Story Content */}
        <View className="px-4 pb-8">
          <View className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <Text className="text-slate-100 text-base leading-7">
              {story.story}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
