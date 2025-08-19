import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://edumochila-api-mysql.onrender.com";


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Campos vacíos", "Ingresa tu usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom_us: username,
          pass_us: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.estatus === "exitoso" && data.access_token) {
        await AsyncStorage.setItem("token", data.access_token);
        await AsyncStorage.setItem("user", JSON.stringify(data.usuario));
        Alert.alert("Bienvenido", data.mensaje || "Inicio de sesión correcto");
        navigation.replace("Home");
      } else {
        const msg =
          data.mensaje ||
          (res.status === 401
            ? "Usuario o contraseña incorrectos"
            : "Error al iniciar sesión");
        Alert.alert("Error", msg);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="bag-personal-outline"
          size={90}
          color="#00aaff"
        />
        <Text style={styles.title}>EDUMOCHILA</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, styles.inactiveTab]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={[styles.tabText, styles.inactiveTabText]}>
              Registrarte
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#aaa"
            style={styles.icon}
          />
          <TextInput
            placeholder="Nombre de usuario"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#aaa"
            style={styles.icon}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 30,
    margin: 25,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#00aaff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#2b2b2b",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 30,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 14,
  },
  activeTab: {
    backgroundColor: "#00aaff",
    borderRadius: 20,
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  inactiveTab: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
  },
  inactiveTabText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 18,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
  },
  loginButton: {
    backgroundColor: "#00aaff",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
