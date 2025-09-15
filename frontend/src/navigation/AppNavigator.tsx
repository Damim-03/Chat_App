// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Image } from "react-native";

// Import your screens
import SplashScreen from "../screens/Home/SplashScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import StockScreen from "../screens/Stock/StockScreen";
import SalesScreen from "../screens/Sales/SalesScreen";
import addProductScreen from "../screens/Stock/addProductScreen";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Stock: undefined;
  Sales: undefined;
  AddProduct: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: "#4d8ef7" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          headerTitleAlign: "center",
        }}
      >
        {/* Splash screen (no header) */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Home with logo */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <Image
                source={require("../../assets/icons/SKK-1.png")}
                style={{ width: 250, height: 55, resizeMode: "contain" }}
              />
            ),
          }}
        />

        {/* Stock screen */}
        <Stack.Screen
          name="Stock"
          component={StockScreen}
          options={{ headerShown: true, title: "📦 Stock Management" }}
        />

        {/* Stock screen */}
        <Stack.Screen
          name="AddProduct"
          component={addProductScreen}
          options={{ headerShown: true, title: "Add Product" }}
        />

        {/* Sales screen */}
        <Stack.Screen
          name="Sales"
          component={SalesScreen}
          options={{ headerShown: true, title: "Sales" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
