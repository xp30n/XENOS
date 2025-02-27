import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import { Dimensions } from "react-native";
  import React, { useState } from "react";
  import { supabase } from "./lib/Supabase";
  
  const { width, height } = Dimensions.get("window");
  
  export default function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmedPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleSignUp = async () => {
      if (!email || !password || !username || !confirmPassword) {
        Alert.alert("Error!", "Please fill in all fields!");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error!", "Passwords do not match!");
        return;
      }
  
      setLoading(true);
  
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });
  
        setLoading(false);
  
        if (error) {
          // console.error("Supabase sign-up error:", error);
  
          console.log("Signup response:", data);
          setError(error.message);
          Alert.alert("Sign up failed", error.message);
          return;
        }
  
        console.log("User signed up:", data);
        console.log("User metadata:", data.user?.user_metadata);
  
        Alert.alert("Success!", "Account created successfully.");
        navigation.navigate("LoginScreen");
      } catch (err) {
        setLoading(false);
        console.error("Unexpected error:", err);
        setError("Something went wrong. Please try again.");
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require("./assets/background.png")}
          style={styles.blueBackground}
        />
  
        <View style={styles.logoContainer}>
          <Image
            source={require("./assets/xenosE.png")}
            style={styles.logoImage}
          />
        </View>
  
        <View style={styles.overlay}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.username}
              placeholder="Create your username"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel2}>Email</Text>
            <TextInput
              style={styles.email}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel3}>Password</Text>
            <TextInput
              style={styles.password}
              placeholder="Create new password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel4}>Confirm Password</Text>
            <TextInput
              style={styles.confirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmedPassword}
              autoCapitalize="none"
            />
          </View>
  
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              handleSignUp();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
  
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.loginLink}> Log In!</Text>
            </TouchableOpacity>
          </Text>
        </View>
  
        <View style={styles.orContainer}>
          <Text style={styles.orText}>Or</Text>
        </View>
  
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity onPress={() => console.log("Google sign up pressed")}>
            <Image
              source={require("./assets/google.png")}
              style={styles.socialButton}
            />
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() => console.log("Facebook sign up pressed")}
          >
            <Image
              source={require("./assets/facebook.png")}
              style={styles.socialButton}
            />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => console.log("Apple sign up pressed")}>
            <Image
              source={require("./assets/apple.png")}
              style={styles.socialButton}
            />
          </TouchableOpacity>
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
      top: "-86%",
      width: "80%",
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
      height: "82%",
      backgroundColor: "rgba(38, 0, 255, 0.35)",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingVertical: 145,
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
      top: "-111",
      left: "5",
      marginBottom: 5,
      textAlign: "left",
    },
  
    inputLabel2: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 12,
      top: "-115",
      left: "5",
      marginBottom: 5,
      textAlign: "left",
    },
  
    inputLabel3: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 12,
      top: "-115",
      left: "7",
      marginBottom: 5,
      textAlign: "left",
    },
  
    inputLabel4: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 11,
      top: "-116",
      marginBottom: 5,
      textAlign: "left",
    },
  
    username: {
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
  
    email: {
      fontFamily: "IBMPlexMono",
      width: "100%",
      height: 48,
      top: "-112",
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
      top: "-112",
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 30,
      fontSize: 15,
      textAlign: "center",
      color: "white",
    },
  
    confirmPassword: {
      fontFamily: "IBMPlexMono",
      width: "100%",
      height: 48,
      top: "-114",
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 30,
      fontSize: 15,
      textAlign: "center",
      color: "white",
    },
  
    signUpButton: {
      backgroundColor: "royalblue",
      width: "79%",
      top: "-100",
      paddingVertical: 10,
      borderRadius: 30,
      alignItems: "center",
    },
  
    signUpButtonText: {
      fontFamily: "IBMPlexMono",
      fontSize: 19,
      fontWeight: "bold",
      color: "white",
    },
  
    loginContainer: {
      marginTop: 735,
      alignItems: "center",
    },
  
    loginText: {
      fontFamily: "IBMPlexMono",
      color: "white",
      fontSize: 16,
    },
  
    loginLink: {
      fontFamily: "IBMPlexMono",
      fontSize: "15",
      color: "dodgerblue",
      textDecorationLine: "underline",
      top: "3",
    },
  
    orContainer: {
      width: "100%",
      alignItems: "center",
      position: "absolute",
      top: "687",
    },
  
    orText: {
      fontFamily: "Abnes",
      color: "white",
      fontSize: 17,
    },
  
    socialButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "80%",
      marginTop: -94,
    },
  
    socialButton: {
      width: 45,
      height: 50,
      resizeMode: "contain",
    },
  });
  