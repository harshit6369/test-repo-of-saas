import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/providers/auth-provider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }} initialRouteName="(auth)">
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="campaign/[id]" options={{ 
        title: "Campaign Details",
        headerStyle: { backgroundColor: "#6B46C1" },
        headerTintColor: "#fff"
      }} />
      <Stack.Screen name="contact/[id]" options={{ 
        title: "Contact Details",
        headerStyle: { backgroundColor: "#6B46C1" },
        headerTintColor: "#fff"
      }} />
      <Stack.Screen name="workflow/[id]" options={{ 
        title: "Workflow Editor",
        headerStyle: { backgroundColor: "#6B46C1" },
        headerTintColor: "#fff"
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
