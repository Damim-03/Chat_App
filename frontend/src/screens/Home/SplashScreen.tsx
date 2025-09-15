// src/screens/Splash/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Stock: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

const { width } = Dimensions.get("window");

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current; // start smaller
  const fadeOutAnim = useRef(new Animated.Value(1)).current; // overlay

  useEffect(() => {
    Animated.sequence([
      // Step 1: Fade-in + zoom logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Step 2: Fade overlay away
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 1000,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // ✅ Step 3: Wait 1s before navigating to Home
      setTimeout(() => {
        navigation.replace("Home");
      }, 1000);
    });
  }, [fadeAnim, scaleAnim, fadeOutAnim, navigation]);

  return (
    <View style={styles.container}>
      {/* Logo Animation */}
      <Animated.Image
        source={require("../../../assets/icons/SKK-1.png")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />

      {/* White overlay for smooth transition */}
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeOutAnim },
        ]}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // white background
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.75, // bigger logo
    height: width * 0.75,
  },
  overlay: {
    position: "absolute",
    width: "200%",
    height: "200%",
    backgroundColor: "#fff", // white overlay
  },
});
