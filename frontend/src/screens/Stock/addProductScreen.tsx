  import React, { useState, useEffect } from "react";
  import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
    Modal,
    FlatList,
  } from "react-native";
  import * as ImagePicker from "expo-image-picker";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import { BarCodeScanner } from "expo-barcode-scanner";

  const AddProductScreen: React.FC = () => {
    const [barcode, setBarcode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price1, setPrice1] = useState("");
    const [price2, setPrice2] = useState("");
    const [price3, setPrice3] = useState("");
    const [fabDate, setFabDate] = useState<Date>(new Date());
    const [expDate, setExpDate] = useState<Date>(new Date());
    const [showFabPicker, setShowFabPicker] = useState(false);
    const [showExpPicker, setShowExpPicker] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState("1");

    // Unit and Category states
    const [selectedUnit, setSelectedUnit] = useState<{ id: string; name: string }>({
      id: "1",
      name: "Piece",
    });
    
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string }>({
      id: "1",
      name: "General",
    });
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([
      { id: "1", name: "General" },
    ]);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [units, setUnits] = useState<{ id: string; name: string }[]>([
      { id: "1", name: "Piece" },
    ]);
    const [showAddUnitModal, setShowAddUnitModal] = useState(false);
    const [newUnitName, setNewUnitName] = useState("");

    // Load units and categories on component mount
    useEffect(() => {
      loadUnits();
      loadCategories();
    }, []);

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }, []);
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }, []);
    
    // Load categories from backend
    const loadCategories = async () => {
      try {
        const response = await fetch("http://192.168.100.6:5000/api/product/category/get");

        if (response.ok) {
          const data = await response.json();

          const mappedCategories = data.map((cat: any) => ({
            id: cat.id, // UUID from backend
            name: cat.name_of_category, // ✅ use name_of_category only
          }));          

          setCategories(mappedCategories);

          if (mappedCategories.length > 0) {
            setSelectedCategory(mappedCategories[0]);
          }
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    const loadUnits = async () => {
      try {
        const response = await fetch("http://192.168.100.6:5000/api/product/unit/get");
    
        if (response.ok) {
          const data = await response.json();
    
          const mappedUnits = data.map((unit: any) => ({
            id: unit.id,                 // UUID from backend
            name: unit.unit_name,        // ✅ use unit_name from backend response
          }));
    
          setUnits(mappedUnits);
    
          if (mappedUnits.length > 0) {
            setSelectedUnit(mappedUnits[0]);
          }
        } else {
          console.error("Failed to fetch units:", response.status);
        }
      } catch (error) {
        console.error("Error loading units:", error);
      }
    };    

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

    const handleSave = async () => {
      if (!barcode || !name || !price1) {
        Alert.alert("Error", "Please fill all required fields");
        return;
      }

      const product = {
        barcode,
        product_name: name,
        description,
        price1,
        price2,
        price3,
        production_date: fabDate,
        expiration_date: expDate,
        image_path: image,
        unitId: selectedUnit.id,
        categoryId: selectedCategory.id,
        quantity: parseInt(quantity),
      };

      try {
        const response = await fetch("http://192.168.100.6:5000/api/product/product/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });

        if (response.ok) {
          const data = await response.json();
          Alert.alert("✅ Success", "Product added successfully!");
          console.log("Saved:", data);

          setBarcode("");
          setName("");
          setDescription("");
          setPrice1("");
          setPrice2("");
          setPrice3("");
          setQuantity("1");
          setImage(null);
        } else {
          const errorData = await response.json();
          Alert.alert("❌ Error", errorData.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("❌ Error", "Failed to connect to backend");
      }
    };

    // Add new category
    const handleAddCategory = async () => {
      if (!newCategoryName.trim()) {
        Alert.alert("Error", "Please enter a category name");
        return;
      }

      try {
        const response = await fetch("http://192.168.100.6:5000/api/product/category/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name_of_category: newCategoryName.trim() }),
        });

        if (response.ok) {
          await loadCategories();
          setNewCategoryName("");
          setShowAddCategoryModal(false);
          Alert.alert("Success", "Category added successfully!");
        } else {
          const errorData = await response.json();
          Alert.alert("Error", errorData.message || "Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        Alert.alert("Error", "Failed to connect to server");
      }
    };

    const handleAddUnit = async () => {
      if (!newUnitName.trim()) {
        Alert.alert("Error", "Please enter a unit name");
        return;
      }
    
      try {
        const response = await fetch("http://192.168.100.6:5000/api/product/unit/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unit_name: newUnitName.trim() }), // 👈 FIXED
        });
    
        if (response.ok) {
          await loadUnits();
          setNewUnitName("");
          setShowAddUnitModal(false);
          Alert.alert("Success", "Unit added successfully!");
        } else {
          const errorData = await response.json();
          Alert.alert("Error", errorData.message || "Failed to add unit");
        }
      } catch (error) {
        console.error("Error adding unit:", error);
        Alert.alert("Error", "Failed to connect to server");
      }
    };    

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Product</Text>

        {/* Barcode field */}
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
          style={[styles.input, styles.textArea]}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
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

        {/* Quantity */}
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        {/* Unit selection */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowUnitModal(true)}>
          <Text style={styles.dropdownText}>Unit: {selectedUnit.name}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Category selection */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowCategoryModal(true)}>
          <Text style={styles.dropdownText}>Category: {selectedCategory.name}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Fab date */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowFabPicker(true)}>
          <Text style={styles.dateText}>Fab Date: {fabDate.toLocaleDateString("en-GB")}</Text>
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
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowExpPicker(true)}>
          <Text style={styles.dateText}>Exp Date: {expDate.toLocaleDateString("en-GB")}</Text>
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
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text style={styles.imageText}>Pick Product Image</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Product</Text>
        </TouchableOpacity>

        {/* Category Modal */}
        <Modal visible={showCategoryModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddCategoryModal(true)}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.modalItemRow}>
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedCategory(item);
                        setShowCategoryModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Category Modal */}
        <Modal visible={showAddCategoryModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setNewCategoryName("");
                    setShowAddCategoryModal(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addButton]}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.addButtonText}>Add Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Unit Modal */}
        <Modal visible={showUnitModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Unit</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddUnitModal(true)}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
        
              <FlatList
                data={units}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.modalItemRow}>
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedUnit(item);
                        setShowUnitModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
        
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowUnitModal(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Add Unit Modal */}
        <Modal visible={showAddUnitModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter unit name"
                value={newUnitName}
                onChangeText={setNewUnitName}
                autoFocus
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setNewUnitName("");
                    setShowAddUnitModal(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addButton]}
                  onPress={handleAddUnit}
                >
                  <Text style={styles.addButtonText}>Add Unit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  };

  export default AddProductScreen;

  const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 15,
    },
    textArea: { height: 80, textAlignVertical: "top" },
    row: { flexDirection: "row", alignItems: "baseline", marginBottom: 4 },
    smallButton: {
      marginLeft: 8,
      backgroundColor: "#28a745",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    smallButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
    dateButton: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
      backgroundColor: "#f9f9f9",
    },
    dateText: { fontSize: 16 },
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
    image: { width: "100%", height: "100%", borderRadius: 8 },
    imageText: { fontSize: 16, color: "#666" },
    button: {
      backgroundColor: "#007bff",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    dropdown: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
      backgroundColor: "#f9f9f9",
    },
    dropdownText: { fontSize: 16, flex: 1 },
    dropdownArrow: { fontSize: 12, color: "#666" },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      width: "80%",
      maxHeight: "70%",
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    modalItem: { flex: 1, padding: 15 },
    modalItemText: { fontSize: 16 },
    modalItemRow: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    deleteButton: { padding: 10, marginRight: 10 },
    deleteButtonText: { fontSize: 18 },
    modalCloseButton: {
      backgroundColor: "#007bff",
      padding: 12,
      borderRadius: 8,
      marginTop: 15,
      alignItems: "center",
    },
    modalCloseText: { color: "white", fontSize: 16, fontWeight: "600" },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
    addButton: { backgroundColor: "#28a745", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    addButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
    modalButtonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
    cancelButton: { backgroundColor: "#6c757d" },
    cancelButtonText: { color: "white", fontWeight: "600" },
  });
