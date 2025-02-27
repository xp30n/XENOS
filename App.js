import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import { supabase } from "./lib/Supabase";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import ExecutingScreen from "./ExecutingScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import HomeScreen from "./HomeScreen";
import Notifications from "./Notifications";
import Profile from "./Profile";
import NewPost from "./NewPost";
import EditProfile from "./EditProfile";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, setAuth } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuth(session?.user || null);
        setIsAuthChecked(true);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [setAuth]);

  if (!isAuthChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* If user is not logged in */}
        {!user ? (
          <>
            <Stack.Screen name="ExecutingScreen" component={ExecutingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          </>
        ) : (
          // If user is logged in
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        )}

        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="NewPost" component={NewPost} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Abnes: require("./assets/fonts/abnes.ttf"),
    IBMPlexMono: require("./assets/fonts/IBMPlexMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}