// screens/StockScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Mode = "menu" | "list";
type RootStackParamList = {
  Home: undefined;
  AddProduct: undefined; // 👈 screen you want to go
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StockScreen: React.FC = () => {
  const [mode, setMode] = useState<Mode>("menu");
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>

      {mode === "menu" && (
        <View style={styles.menu}>
          {/* Add Product Button */}
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => navigation.navigate("AddProduct")} // 👈 navigate instead of console.log
          >
           <Image
             source={require("../../../assets/icons/add.png")}
             style={styles.icon}
           />
           <Text style={styles.cardText}>Add Product</Text>
          </TouchableOpacity>

          {/* View Products Button */}
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => console.log("View Products pressed")}
          >
            <Image
              source={require("../../../assets/icons/products_pile.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>View Products</Text>
          </TouchableOpacity>

          {/* Add Categories Button */}
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => console.log("Add Categories pressed")}
          >
            <Image
              source={require("../../../assets/icons/category.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Add Categories</Text>
          </TouchableOpacity>

          {/* Validate of Products Button */}
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => console.log("Validate of Products pressed")}
          >
            <Image
              source={require("../../../assets/icons/date.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Validate of Products</Text>
          </TouchableOpacity>

          {/* Get Data of Products Button */}
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

          {/* Update the products Button */}
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => console.log("Update the products pressed")}
          >
            <Image
              source={require("../../../assets/icons/cycle.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Update the products</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default StockScreen;

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
