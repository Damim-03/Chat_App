import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";


const SalesScreen: React.FC = () => {
    return(
        <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => console.log("Get Data of Products pressed")}
          >
            <Image
              source={require("../../../assets/icons/excel.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Get Data of Products</Text>
          </TouchableOpacity>
    )
}

export default SalesScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f4f6f8",
      paddingHorizontal: 16,
      paddingTop: 5,
    },
    header: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 20,
      color: "#333",
      textAlign: "center",
    },
    menu: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    cardBtn: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 12,
      elevation: 3,
      marginVertical: 10,
      width: "95%",
      flexDirection: "row", // <-- icon + text inline
      alignItems: "center",
      justifyContent: "flex-start",
    },
    icon: {
      width: 38,
      height: 38,
      marginRight: 12,
      resizeMode: "contain",
    },
    cardText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#007AFF",
    },
  });