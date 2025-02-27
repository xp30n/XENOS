import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Image,
  } from "react-native";
  import { Dimensions } from "react-native";
  import React, { useState } from "react";
  import { supabase } from "./lib/Supabase";
  
  const { width, height } = Dimensions.get("window");
  
  export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert("Error!", "Please fill in both fields!");
        return;
      }
  
      setLoading(true);
  
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        setLoading(false);
  
        if (error) {
          console.error("Supabase login error:", error);
          setError(error.message);
          Alert.alert("Login failed", error.message);
          return;
        }
        console.log("Data:", data);
        console.log("Error:", error);
        console.log("User logged in:", data);
        Alert.alert("Success!", "Logged in successfully!");
        navigation.navigate("HomeScreen");
        console.log(navigation);
      } catch (err) {
        setLoading(false);
        console.error("Unexpected error:", err);
        setError("Something went wrong. Please try again.");
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };
  
    const LoginButton = ({ onPress }) => (
      <TouchableOpacity style={styles.loginButton} onPress={onPress}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        {/* Background Image */}
        <Image
          source={require("./assets/background.png")}
          style={styles.blueBackground}
        />
  
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("./assets/xenosE.png")}
            style={styles.logoImage}
          />
        </View>
  
        <View style={styles.overlay}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.email}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
          </View>
  
          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel2}>Password</Text>
            <TextInput
              style={styles.password}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />
          </View>
  
          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => console.log("Forgot Password Pressed")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
  
          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
  
          {/* Login Button */}
          <LoginButton onPress={handleLogin} />
        </View>
  
        {/* Social Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity onPress={() => console.log("Google login pressed")}>
            <Image
              source={require("./assets/google.png")}
              style={styles.socialButton}
            />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => console.log("Facebook login pressed")}>
            <Image
              source={require("./assets/facebook.png")}
              style={styles.socialButton}
            />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => console.log("Apple login pressed")}>
            <Image
              source={require("./assets/apple.png")}
              style={styles.socialButton}
            />
          </TouchableOpacity>
        </View>
  
        {/* Or text */}
        <View style={styles.orContainer}>
          <Text style={styles.orText}>Or</Text>
        </View>
  
        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
            <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
              <Text style={styles.signupLink}> Sign up!</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      position: "relative",
      margin: "0",
      padding: "0",
      backgroundColor: "black",
    },
  
    blueBackground: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      bottom: "0",
      resizeMode: "cover",
    },
  
    logoContainer: {
      position: "absolute",
      top: "-77%",
      width: "100%",
      alignItems: "center",
    },
  
    logoImage: {
      width: "100%",
      resizeMode: "contain",
    },
  
    overlay: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: "69%",
      backgroundColor: "rgba(38, 0, 255, 0.35)",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingVertical: 155,
      alignItems: "center",
    },
  
    inputContainer: {
      width: "79%",
      marginBottom: 20,
      alignItems: "flex-start",
    },
  
    inputLabel: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 11,
      top: "-110",
      left: "5",
      marginBottom: 5,
      textAlign: "left",
    },
  
    inputLabel2: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 12,
      top: "-100",
      left: "5",
      marginBottom: 5,
      textAlign: "left",
    },
  
    email: {
      fontFamily: "IBMPlexMono",
      width: "100%",
      height: 48,
      top: "-110",
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 30,
      fontSize: 15,
      textAlign: "center",
      color: "white",
    },
  
    password: {
      fontFamily: "IBMPlexMono",
      width: "100%",
      height: 48,
      top: "-100",
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 30,
      fontSize: 15,
      textAlign: "center",
      color: "white",
    },
  
    forgotPassword: {
      alignSelf: "flex-end",
      marginRight: "15%",
      marginBottom: 10,
    },
  
    forgotPasswordText: {
      fontFamily: "IBMPlexMono",
      left: "22%",
      color: "white",
      fontSize: 14,
      top: "-105",
    },
  
    loginButton: {
      backgroundColor: "royalblue",
      width: "79%",
      top: "-75",
      paddingVertical: 10,
      borderRadius: 30,
      alignItems: "center",
    },
  
    loginButtonText: {
      fontFamily: "IBMPlexMono",
      fontSize: 19,
      fontWeight: "bold",
      color: "white",
    },
  
    orContainer: {
      width: "100%",
      alignItems: "center",
      position: "absolute",
      top: "679",
    },
  
    orText: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 20,
    },
  
    socialButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "80%",
      marginTop: 665,
    },
  
    socialButton: {
      width: 48,
      height: 50,
      resizeMode: "contain",
    },
  
    signupContainer: {
      marginTop: 20,
      alignItems: "center",
    },
  
    signupText: {
      fontFamily: "IBMPlexMono",
      color: "white",
      fontSize: 16,
    },
  
    signupLink: {
      fontFamily: "IBMPlexMono",
      fontSize: "15",
      color: "dodgerblue",
      textDecorationLine: "underline",
      top: "3",
    },
  });
  