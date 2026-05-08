import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
        }}
      />
      <Stack.Screen
        name="/StoryGenerator"
        options={{
          headerTitle: "Story Generator",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="/ReadStory"
        options={{
          headerTitle: "Read Story",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
