import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./lib/Supabase";
import { Video } from "expo-av";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { user, setAuth } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("id, body, created_at, file, users(id, username, image)")
      .order("created_at", { ascending: false })
      .limit(5);
  
    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }
  
    console.log("Fetched posts:", posts);
    setPosts(posts);
  };

  const formatTime = (timestamp) => {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - postDate) / (1000 * 60 * 60));
    return diff < 1 ? "Just now" : `${diff}hrs ago`;
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/background.png")}
        style={styles.backgroundImage}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.safeContainerOverlay} />
          <View style={styles.logoContainer}>
            <Image source={require("./assets/logo.png")} style={styles.logo} />
          </View>

          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => navigation.navigate("Notifications")}
            >
              <FontAwesome5 name="heart" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => navigation.navigate("NewPost")}
            >
              <FontAwesome5 name="plus-square" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => navigation.navigate("Profile")}
            >
              <FontAwesome5 name="user" size={25} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.postContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.post}>
                <View style={styles.postHeader}>
                  {post.users ? (
                    <>
                      <Image
                        source={{ uri: post.users.image }}
                        style={styles.profilePicture}
                      />
                      <Text style={styles.username}>{post.users.username}</Text>
                    </>
                  ) : (
                    <Text style={styles.username}>Unknown User</Text>
                  )}
                </View>
                {post.file && typeof post.file === "string" && (
                  <Image
                    source={{ uri: post.file }}
                    style={styles.postImage}
                  />
                )}
                {post.video && typeof post.video === "string" && (
                  <Video
                    source={{ uri: post.file }}
                    style={styles.postImage}
                    shouldPlay
                    useNativeControls
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.caption}>{post.body}</Text>
                <Text style={styles.postTime}>
                  {formatTime(post.created_at)}
                </Text>
                <View style={styles.mediaIcons}>
                  <FontAwesome5 name="heart" size={20} color="white" />
                  <FontAwesome5 name="globe" size={20} color="white" />
                  <FontAwesome5 name="link" size={20} color="white" />
                </View>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    resizeMode: "cover",
  },

  safeContainer: {
    flex: 1,
    alignItems: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 50,
  },

  safeContainerOverlay: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "rgb(3, 1, 15)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    top: height * 0.07,
    zIndex: 2,
  },

  logoContainer: {
    top: -500,
    left: -110,
  },

  logo: {
    width: 145,
    resizeMode: "contain",
    zIndex: 20,
  },

  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
    top: -1080,
    left: 105,
    gap: -15,
    zIndex: 20,
  },

  icon: {
    padding: 20,
  },

  postContainer: {
    width: "230%",
    marginTop: -990,
    zIndex: 50,
  },

  post: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 50,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingBottom: 5,
  },

  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  username: {
    fontSize: 18,
    color: "white",
  },

  postImage: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginTop: 10,
    zIndex: 50,
  },

  caption: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },

  postTime: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },

  mediaIcons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "50%",
    marginTop: 10,
  },
});

export default HomeScreen;
