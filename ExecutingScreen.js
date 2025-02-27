import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const TypingDots = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 4 ? 0 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.dotsWrapper}>
      <Text style={styles.typingText}>{".".repeat(dotCount)}</Text>
    </View>
  );
};

export default function ExecutingHomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeHomeAnim] = useState(new Animated.Value(0));
  const [showHomeScreen, setShowHomeScreen] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setShowHomeScreen(true);
      Animated.timing(fadeHomeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 5500);
  }, [fadeAnim]);

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {!showHomeScreen ? (
          <>
            <View style={styles.textWrapper}>
              <Text style={styles.executingText}>executing{"\n"}XENOS.exe</Text>
              <TypingDots />
            </View>
          </>
        ) : (
          <Animated.View
            style={[styles.homeContainer, { opacity: fadeHomeAnim }]}
          >
            <Image source={require("./assets/logo.png")} style={styles.logo} />
            <Image
              source={require("./assets/tagline.png")}
              style={styles.slogan}
            />
            <TouchableOpacity
              style={styles.startedButton}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.startedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },

  executingText: {
    fontSize: 32,
    color: "white",
    fontFamily: "Abnes",
    marginBottom: 10,
    whiteSpace: "nowrap",
  },

  typingText: {
    fontSize: 40,
    color: "white",
    fontFamily: "Abnes",
    textAlign: "center",
    marginBottom: 10,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },

  textWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  dotsWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  homeContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },

  logo: {
    position: "absolute",
    width: "100%",
    height: "55%",
    transform: [{ translateX: -100 }],
    top: "17%",
    left: "-25%",
    resizeMode: "contain",
  },

  slogan: {
    position: "absolute",
    width: "79%",
    height: "15%",
    top: "42%",
    left: "-120",
    resizeMode: "contain",
  },

  startedButton: {
    position: "absolute",
    top: "87%",
    width: "70%",
    height: 50,
    left: "1-0%",
    backgroundColor: "#0000A0",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  startedButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Abnes",
  },
});
