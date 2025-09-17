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
  const [selectedUnit, setSelectedUnit] = useState({ id: 1, name: "Piece" });
  const [selectedCategory, setSelectedCategory] = useState({ id: 1, name: "General" });
  const [units, setUnits] = useState([{ id: 1, name: "Piece" }]);
  const [categories, setCategories] = useState([{ id: 1, name: "General" }]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load units and categories on component mount
  useEffect(() => {
    loadCategories();
    // TODO: Add loadUnits() when unit API is ready
    setUnits([
      { id: 1, name: "Piece" },
      { id: 2, name: "Kg" },
      { id: 3, name: "Liter" },
      { id: 4, name: "Box" },
      { id: 5, name: "Pack" },
    ]);
  }, []);

  // Load categories from backend
  const loadCategories = async () => {
    try {
      console.log("Loading categories from:", "http://localhost:5000/api/product/category/get");
      const response = await fetch("http://localhost:5000/api/product/category/get");
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Categories data:", data);
        
        // Map backend data to frontend format
        const mappedCategories = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name_of_category || cat.name
        }));
        
        console.log("Mapped categories:", mappedCategories);
        setCategories(mappedCategories);
        
        if (mappedCategories.length > 0) {
          setSelectedCategory(mappedCategories[0]);
        }
      } else {
        console.error("Failed to load categories, status:", response.status);
        // Fallback to hardcoded data
        const fallbackCategories = [
          { id: 1, name: "General" },
          { id: 2, name: "Electronics" },
          { id: 3, name: "Food" },
          { id: 4, name: "Clothing" },
          { id: 5, name: "Books" },
        ];
        setCategories(fallbackCategories);
        setSelectedCategory(fallbackCategories[0]);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to hardcoded data
      const fallbackCategories = [
        { id: 1, name: "General" },
        { id: 2, name: "Electronics" },
        { id: 3, name: "Food" },
        { id: 4, name: "Clothing" },
        { id: 5, name: "Books" },
      ];
      setCategories(fallbackCategories);
      setSelectedCategory(fallbackCategories[0]);
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
      product_name: name,  // backend expects product_name
      description,
      price1,
      price2,
      price3,
      production_date: fabDate,  // backend expects production_date
      expiration_date: expDate,  // backend expects expiration_date
      image_path: image,  // backend expects image_path
      unitId: selectedUnit.id,
      categoryId: selectedCategory.id,
      quantity: parseInt(quantity),
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/product/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
  
      if (response.ok) {
        const data = await response.json();
        Alert.alert("✅ Success", "Product added successfully!");
        console.log("Saved:", data);
  
        // reset form
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
        console.error("Backend error:", errorData);
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
      const response = await fetch("http://localhost:5000/api/product/category/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_of_category: newCategoryName.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Reload categories from backend to get the latest data
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

  // Delete category
  const handleDeleteCategory = (categoryId: number) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:5000/api/product/category/delete/${categoryId}`, {
                method: "DELETE",
              });

              if (response.ok) {
                // Reload categories from backend
                await loadCategories();
                Alert.alert("Success", "Category deleted successfully!");
              } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to delete category");
              }
            } catch (error) {
              console.error("Error deleting category:", error);
              Alert.alert("Error", "Failed to connect to server");
            }
          }
        }
      ]
    );
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

      {/* Quantity field */}
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Unit selection */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowUnitModal(true)}
      >
        <Text style={styles.dropdownText}>
          Unit: {selectedUnit.name}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Category selection */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          console.log("Opening category modal, categories:", categories);
          setShowCategoryModal(true);
        }}
      >
        <Text style={styles.dropdownText}>
          Category: {selectedCategory.name}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Fab date */}
<TouchableOpacity
  style={styles.dateButton}
  onPress={() => setShowFabPicker(true)}
>
  <Text style={styles.dateText}>
    Fab Date: {fabDate.toLocaleDateString("en-GB")}
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
    Exp Date: {expDate.toLocaleDateString("en-GB")}
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

      {/* Unit Selection Modal */}
      <Modal
        visible={showUnitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Unit</Text>
            <FlatList
              data={units}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedUnit(item);
                    setShowUnitModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
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

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                console.log("Rendering category item:", item);
                return (
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
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteCategory(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
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
      <Modal
        visible={showAddCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus={true}
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
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
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    flex: 1,
    padding: 15,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalItemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deleteButton: {
    padding: 10,
    marginRight: 10,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
