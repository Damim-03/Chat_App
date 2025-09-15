import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddProductScreen: React.FC = () => {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [price3, setPrice3] = useState("");
  const [fabDate, setFabDate] = useState<Date>(new Date());
  const [expDate, setExpDate] = useState<Date>(new Date());
  const [showFabPicker, setShowFabPicker] = useState(false);
  const [showExpPicker, setShowExpPicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!barcode || !name || !price1) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const product = {
      barcode,
      name,
      price1,
      price2,
      price3,
      fabDate,
      expDate,
      image,
    };

    // 🚀 Send this to backend
    console.log(product);

    Alert.alert("Success", "Product added successfully!");
    setBarcode("");
    setName("");
    setPrice1("");
    setPrice2("");
    setPrice3("");
    setImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      {/* Barcode field with button */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Barcode"
          value={barcode}
          onChangeText={setBarcode}
        />
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => Alert.alert("Barcode", "Scan or generate barcode here")}
        >
          <Text style={styles.smallButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>


      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Price 1"
        value={price1}
        onChangeText={setPrice1}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price 2"
        value={price2}
        onChangeText={setPrice2}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price 3"
        value={price3}
        onChangeText={setPrice3}
        keyboardType="numeric"
      />

      {/* Fab date */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowFabPicker(true)}
      >
        <Text style={styles.dateText}>
          Fab Date: {fabDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showFabPicker && (
        <DateTimePicker
          value={fabDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFabPicker(false);
            if (date) setFabDate(date);
          }}
        />
      )}

      {/* Exp date */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowExpPicker(true)}
      >
        <Text style={styles.dateText}>
          Exp Date: {expDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showExpPicker && (
        <DateTimePicker
          value={expDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowExpPicker(false);
            if (date) setExpDate(date);
          }}
        />
      )}

      {/* Product Image */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Pick Product Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageText: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  smallButton: {
    marginLeft: 8,
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  
});
