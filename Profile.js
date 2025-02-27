import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    Image,
    Dimensions,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { supabase } from "./lib/Supabase";
  import { useAuth } from "./contexts/AuthContext";
  
  const { width, height } = Dimensions.get("window");
  
  const Profile = ({ navigation }) => {
    const { user, setAuth } = useAuth();
    const [profileData, setProfileData] = useState({ image: null, bio: "" });
  
    const onLogout = async () => {
      try {
        setAuth(null);
        const { error } = await supabase.auth.signOut();
        if (error) {
          Alert.alert("Sign out", "Error signing out!");
        } else {
          navigation.navigate("ExecutingScreen");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
  
    useEffect(() => {
      const fetchProfile = async () => {
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("image, bio, username")
            .eq("id", user.id)
            .single();
  
          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            setProfileData(data);
          }
        }
      };
  
      fetchProfile();
    }, [user]);
  
    return (
      <ImageBackground
        source={require("./assets/background.png")}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.safeContainerOverlay} />
  
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
  
          {/* Profile Picture */}
          <View style={styles.profileContainer}>
            {profileData.image ? (
              <Image
                source={{ uri: profileData.image }}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesome5 name="user-circle" size={80} color="gray" />
            )}
  
            <Text style={styles.usernameText}>
              {profileData?.username || "Unknown User"}
            </Text>
  
            <Text style={styles.text}>
              {profileData.bio || "No bio available"}
            </Text>
          </View>
  
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <FontAwesome5 name="pen" size={23} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  };
  
  export default Profile;
  
  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      alignItems: "center",
    },
  
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
  
    text: {
      color: "white",
      fontSize: 20,
      textAlign: "center",
      marginTop: 10,
    },
  
    backButton: {
      position: "absolute",
      top: 80,
      left: 20,
      padding: 5,
      zIndex: 10,
    },
  
    safeContainerOverlay: {
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgb(3, 1, 15)",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      zIndex: 2,
    },
  
    profileContainer: {
      marginTop: 120,
      alignItems: "center",
      zIndex: 3,
    },
  
    imageContainer: {
      position: "relative",
    },
  
    profileImage: {
      width: 170,
      height: 170,
      top: -40,
      borderRadius: 80,
      borderWidth: 2,
    },
  
    logoutButton: {
      position: "absolute",
      top: "10%",
      left: "78%",
      backgroundColor: "rgb(1, 7, 124)",
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
      zIndex: "4",
    },
  
    logoutText: {
      color: "white",
      fontSize: 15,
    },
  
    editButton: {
      position: "absolute",
      top: "36%",
      left: 227,
      padding: 8,
      borderRadius: 20,
      backgroundColor: "rgb(0, 7, 138)",
      zIndex: 4,
    },
  
    usernameText: {
      fontFamily: "IBMPlexMono",
      color: "white",
      fontSize: 30,
      fontWeight: "bold",
      marginTop: -40,
      textAlign: "center",
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 10,
      zIndex: 4,
    },
  
    bioText: {
      color: "white",
      fontSize: 16,
      marginTop: 10,
      textAlign: "center",
    },
  });
  