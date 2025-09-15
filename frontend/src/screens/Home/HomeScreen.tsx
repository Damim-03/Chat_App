import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Sales: undefined;
  Purchases: undefined;
  Stock: undefined;
  Client: undefined;
  Inquiries: undefined;
  Barcode: undefined;
  Raports: undefined;
  Gateway: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface DashboardItem {
  id: string;
  title: string;
  screen: keyof RootStackParamList;
  icon: any;
}

// ✅ Add icons (place your PNGs in assets/icons folder)
const dashboardItems: DashboardItem[] = [
  { id: "1", title: "Sales", screen: "Sales", icon: require("../../../assets/icons/purchase.png") },
  { id: "2", title: "Purchases", screen: "Purchases", icon: require("../../../assets/icons/sales.png") },
  { id: "3", title: "Stock", screen: "Stock", icon: require("../../../assets/icons/stock.png") },
  { id: "4", title: "Client", screen: "Client", icon: require("../../../assets/icons/client.png") },
  { id: "5", title: "Inquiries", screen: "Inquiries", icon: require("../../../assets/icons/positive.png") },
  { id: "6", title: "Raports", screen: "Raports", icon: require("../../../assets/icons/bill.png") },
  { id: "7", title: "Barcode", screen: "Barcode", icon: require("../../../assets/icons/barcode.png") },
  { id: "8", title: "Gateway", screen: "Gateway", icon: require("../../../assets/icons/product.png") },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();

  // calculate card size dynamically (2 columns with padding & spacing)
  const CARD_MARGIN = 10;
  const CARD_SIZE = (width - 40 - CARD_MARGIN * 2) / 2;

  const renderItem = ({ item }: { item: DashboardItem }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_SIZE, height: CARD_SIZE }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Image source={item.icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dashboardItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        key={"2-cols"}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    textAlign: "center",
  },
});
