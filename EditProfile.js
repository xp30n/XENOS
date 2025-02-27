import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome6";
import { supabase } from "./lib/Supabase";
import { useAuth } from "./contexts/AuthContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";

const { width, height } = Dimensions.get("window");

const EditProfile = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name, email, bio")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
      }
    };

    fetchUserDetails();
  }, [user.id]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("image, username")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setProfilePic(data.image ? { uri: data.image } : null);
        setUsername(data.username || "Unknown");
      }
    };
    fetchProfileData();
  }, [user.id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ name, email, username, bio })
        .eq("id", user.id);

      if (error) throw error;

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const fileName = `${uuidv4()}.jpg`;
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const file = `data:image/jpeg;base64,${base64}`;
      const arrayBuff = decode(base64);

      const { data, error } = await supabase.storage
        .from("profile_pictures")
        .upload(fileName, arrayBuff, { contentType: "image/jpeg" });

      if (error) throw error;

      const { data: publicURLData } = supabase.storage
        .from("profile_pictures")
        .getPublicUrl(fileName);
      const imageUrl = publicURLData.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ image: imageUrl })
        .eq("id", user.id);
      if (updateError) throw updateError;

      setProfilePic({ uri: imageUrl });
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("./assets/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.safeContainer} />
        {profilePic ? (
          <Image source={profilePic} style={styles.profilePicture} />
        ) : (
          <View style={[styles.profilePicture, styles.defaultProfile]}>
            <Icon name="user" size={80} color="white" />
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.editImage} onPress={pickImage}>
          <Icon name="camera-rotate" size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.username}>{username}</Text>

        <View style={styles.updateInfo}>
          <TextInput
            style={styles.input}
            placeholder="Update Name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Update Username"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Update Email"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.bio}
            placeholder="Tell us about yourself..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
            value={bio}
            onChangeText={setBio}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },

  safeContainer: {
    position: "absolute",
    top: height * 0.08,
    width: "100%",
    height: height * 1.2,
    backgroundColor: "rgb(3, 1, 15)",
    borderTopLeftRadius: width * 0.08,
    borderTopRightRadius: width * 0.08,
    zIndex: 2,
  },

  profilePicture: {
    position: "absolute",
    width: width * 0.38,
    height: width * 0.38,
    top: height * 0.13,
    left: "49%",
    borderRadius: width * 0.19,
    transform: [{ translateX: -width * 0.19 }],
    zIndex: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  defaultProfile: {
    backgroundColor: "gray",
  },

  backButton: {
    position: "absolute",
    top: height * 0.1,
    left: width * 0.05,
    zIndex: 10,
  },

  editImage: {
    position: "absolute",
    top: height * 0.27,
    left: width * 0.56,
    zIndex: 10,
  },

  username: {
    fontFamily: "IBM Plex Mono",
    fontSize: width * 0.1,
    position: "absolute",
    top: height * 0.31,
    left: "46%",
    transform: [{ translateX: -width * 0.1 }],
    color: "white",
    textAlign: "center",
    zIndex: 4,
  },

  updateInfo: {
    position: "absolute",
    top: height * 0.36,
    width: "100%",
    alignItems: "center",
  },

  input: {
    fontFamily: "IBM Plex Mono",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    width: "78%",
    height: 55,
    top: 15,
    fontSize: 20,
    textAlign: "left",
    borderRadius: 15,
    color: "white",
    marginBottom: 20,
    zIndex: 4,
    padding: 10,
  },

  bio: {
    fontFamily: "IBM Plex Mono",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    width: "78%",
    height: 200,
    fontSize: 18,
    padding: 10,
    top: 20,
    borderRadius: 15,
    color: "white",
    textAlignVertical: "top",
    zIndex: 4,
  },

  updateButton: {
    backgroundColor: "#0c03b8",
    width: "52%",
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
    zIndex: 4,
  },

  updateButtonText: {
    fontSize: 21,
    color: "white",
    fontFamily: "Abnes",
  },
});

export default EditProfile;
