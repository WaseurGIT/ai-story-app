import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <StatusBar style="auto" hidden={false} />
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
        }}
      />
      <Stack.Screen
        name="StoryGenerator"
        options={{
          headerTitle: "Story Generator",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ReadStory"
        options={{
          headerTitle: "Read Story",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
