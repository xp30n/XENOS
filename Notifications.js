import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
  } from "react-native";
  import React from "react";
  import { FontAwesome5 } from "@expo/vector-icons";
  
  const Notifications = ({ navigation }) => {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
  
          <Text style={styles.text}>Notifications</Text>
        </View>
      </SafeAreaView>
    );
  };
  
  export default Notifications;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    text: {
      color: "black",
      fontSize: 20,
    },
    backButton: {
      position: "absolute",
      top: 40,
      left: 20,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 10,
      borderRadius: 5,
      zIndex: 10,
    },
  });
  