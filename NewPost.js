import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
  } from "react-native";
  import React, { useEffect, useState, useRef } from "react";
  import Icon from "react-native-vector-icons/FontAwesome6";
  import { supabase } from "./lib/Supabase";
  import { useAuth } from "./contexts/AuthContext";
  import { useNavigation } from "@react-navigation/native";
  import {
    actions,
    RichEditor,
    RichToolbar,
  } from "react-native-pell-rich-editor";
  import * as ImagePicker from "expo-image-picker";
  import { Video } from "expo-av";
  import { Audio } from "expo-av";
  import * as FileSystem from "expo-file-system";
  
  const NewPost = () => {
    const navigation = useNavigation();
    const [postText, setPostText] = useState("");
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ image: null });
    const editorRef = useRef(null);
  
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
  
    const styles = getDynamicStyles(selectedMedia);
  
    useEffect(() => {
      const requestPermission = async () => {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Permission status:", status);
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "We need access to your media library."
          );
        }
      };
  
      requestPermission();
    }, []);
  
    useEffect(() => {
      const fetchProfile = async () => {
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("image, username")
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
  
    useEffect(() => {
      const setAudioMode = async () => {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
          });
        } catch (error) {
          console.error("Error setting audio mode:", error);
        }
      };
  
      setAudioMode();
    }, []);
  
    const pickMedia = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.7,
      });
  
      if (!result.canceled) {
        const mediaUri = result.assets[0].uri;
        console.log("Selected Media URI:", mediaUri);
        setSelectedMedia(mediaUri);
        setMediaType(result.assets[0].type);
      } else {
        console.log("No media selected.");
      }
    };
  
    const uploadMedia = async () => {
      if (!selectedMedia || !selectedMedia.uri) return null;
  
      try {
        const fileExt = selectedMedia.uri.split(".").pop().toLowerCase();
        const fileName = `posts/${user.id}_${Date.now()}.${fileExt}`;
        const fileUri = selectedMedia.uri.startsWith("file://")
          ? selectedMedia.uri
          : `file://${selectedMedia.uri}`;
  
        const response = await fetch(fileUri);
        const fileBlob = await response.blob();
  
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(fileName, fileBlob, {
            contentType:
              selectedMedia.type === "image" ? "image/jpeg" : "video/mp4",
          });
  
        if (error) {
          console.error("Upload error:", error);
          throw error;
        }
  
        const { data: publicUrlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(fileName);
  
        const mediaUrl = publicUrlData.publicUrl;
  
        return mediaUrl;
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("Upload failed", error.message);
        return null;
      }
    };
  
    const stripHtml = (html) => {
      return html.replace(/<\/?[^>]+(>|$)/g, "");
    };
  
    const createPost = async () => {
      try {
        let mediaUrl = null;
        let mediaType = null;
  
        if (selectedMedia && selectedMedia.uri) {
          const mediaExtension = selectedMedia.uri.split(".").pop().toLowerCase();
          const imageExtensions = ["jpg", "jpeg", "png", "gif"];
          const videoExtensions = ["mp4", "mov", "avi"];
  
          if (imageExtensions.includes(mediaExtension)) {
            mediaType = "image";
          } else if (videoExtensions.includes(mediaExtension)) {
            mediaType = "video";
          } else {
            throw new Error("Unsupported media type");
          }
  
          mediaUrl = await uploadMedia();
        }
  
        const cleanBody = stripHtml(postText).replace(/&nbsp;/g, " ");
  
        const { error } = await supabase.from("posts").insert([
          {
            userId: user.id,
            body: cleanBody,
            file: mediaUrl,
          },
        ]);
  
        if (error) {
          throw error;
        }
  
        Alert.alert("Success", "Your post has been created!");
        navigation.goBack();
      } catch (error) {
        console.error("Post creation failed:", error);
        Alert.alert("Error", "There was an error creating your post.");
      }
    };
  
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("./assets/background.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
  
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.createPostTitle}>Create Post</Text>
        </View>
  
        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={styles.scrollableContent}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          style={[styles.scrollView, { marginBottom: 50 }]}
        >
          <View style={styles.profileContainer}>
            <Text style={styles.usernameText}>
              {profileData?.username || "Unknown User"}
            </Text>
            <Image
              source={{ uri: profileData.image }}
              style={styles.profilePicture}
            />
  
            <View style={styles.postOwnerText}>
              <Text style={styles.postOwnerTextText}>Post Owner</Text>
            </View>
          </View>
  
          <KeyboardAvoidingView
            style={styles.textEditorContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.toolbarContainer}>
              <RichToolbar
                editor={editorRef}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.insertOrderedList,
                  actions.setStrikethrough,
                  actions.setUnderline,
                  actions.removeFormat,
                  actions.alignCenter,
                  actions.alignLeft,
                  actions.alignRight,
                  actions.code,
                ]}
                style={styles.richBar}
                selectedIconTintColor="blue"
              />
            </View>
  
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.editorScroll}
            >
              <RichEditor
                ref={editorRef}
                editorStyle={{
                  contentCSSText: `
                            font-family: 'IBMPlexMono', monospace; 
                            font-size: 18px; 
                            color: black;`,
                }}
                style={styles.editor}
                placeholder="What's on your mind?"
                onChange={(body) => setPostText(body)}
              />
            </ScrollView>
          </KeyboardAvoidingView>
  
          {selectedMedia && (
            <View style={styles.selectedMediaContainer}>
              {mediaType === "image" ? (
                <Image
                  source={{ uri: selectedMedia }}
                  style={styles.selectedMedia}
                />
              ) : mediaType === "video" ? (
                <Video
                  source={{ uri: selectedMedia }}
                  style={styles.selectedMedia}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay={true}
                  isLooping={true}
                  isMuted={false}
                  volume={1.0}
                />
              ) : null}
            </View>
          )}
  
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setSelectedMedia(null)}
          >
            <Icon name="trash-can" size={24} color="red" />
          </TouchableOpacity>
  
          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post!</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => pickMedia()}>
                <Icon name="image" size={30} color={"#0002bf"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickMedia()}>
                <Icon name="video" size={30} color={"#0002bf"} />
              </TouchableOpacity>
            </View>
          </View>
  
          <TouchableOpacity style={styles.postButton} onPress={createPost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  
  const getDynamicStyles = (selectedMedia) => {
    const baseStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      },
      header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: "transparent",
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
      profilePicture: {
        width: 65,
        height: 65,
        borderRadius: 20,
        position: "absolute",
        top: "560%",
        left: "14%",
        transform: [{ translateX: -50 }],
        zIndex: 4,
      },
      backButton: {
        position: "absolute",
        top: 60,
        left: 25,
        zIndex: 10,
      },
      usernameText: {
        position: "absolute",
        top: 120,
        left: 53,
        fontFamily: "IBMPlexMono",
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        zIndex: 4,
      },
      createPostTitle: {
        fontFamily: "Abnes",
        position: "absolute",
        top: 70,
        left: 115,
        color: "white",
        zIndex: 10,
      },
      textEditorContainer: {
        height: 300,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "",
        borderRadius: 20,
        top: 190,
        overflow: "hidden",
      },
      toolbarContainer: {
        height: 50,
        backgroundColor: "#c9c9c9",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        justifyContent: "center",
        paddingHorizontal: 10,
      },
      richBar: {
        height: 40,
        backgroundColor: "#c9c9c9",
      },
      editorScroll: {
        flex: 1,
      },
      editor: {
        minHeight: 250,
        backgroundColor: "white",
        paddingHorizontal: 0,
      },
      postButton: {
        backgroundColor: "#0002bf",
        padding: 10,
        borderRadius: 15,
        width: 300,
        alignItems: "center",
        left: 25,
        marginTop: selectedMedia ? 20 : 150,
      },
      postButtonText: {
        fontFamily: "IBMPlexMono",
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
      },
      scrollableContent: {
        width: "100%",
        paddingHorizontal: 25,
      },
      selectedMediaContainer: {
        marginTop: 205,
      },
      selectedMedia: {
        width: "100%",
        height: 300,
        borderRadius: 20,
      },
      media: {
        flexDirection: "row",
        backgroundColor: "white",
        marginTop: selectedMedia ? 15 : 200,
        height: 60,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 15,
      },
      addImageText: {
        fontSize: 16,
        fontFamily: "IBMPlexMono",
        margin: 10,
      },
      mediaIcons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
        left: -12,
        gap: 15,
      },
      postOwnerText: {
        top: 175,
        left: -48,
        justifyContent: "center",
        alignItems: "center",
      },
      postOwnerTextText: {
        color: "#d2d2d2",
        fontSize: 18,
        fontFamily: "IBMPlexMono",
      },
  
      deleteButton: {
        position: "absolute",
        top: 535,
        right: 5,
        left: 330,
        borderRadius: 15,
        padding: 5,
      },
    });
  
    return baseStyles;
  };
  
  export default NewPost;  