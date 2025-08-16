import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔧 Ajusta la IP de tu PC si pruebas en dispositivo físico
const MONGO_API_URL = Platform.select({
  ios: "http://localhost:5000",       // iOS Simulator
  android: "http://192.168.1.103:5000",    // Android Emulator
  default: "http://192.168.1.103:5000" // Dispositivo físico
});
// Fallback opcional a la API MySQL (si quieres obtener producto de ahí)
const MYSQL_API_URL = MONGO_API_URL.replace(":5000", ":4000");

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default function RegisterProductScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [productoRegistrado, setProductoRegistrado] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        // 1) intenta desde AsyncStorage
        const pid = await AsyncStorage.getItem("producto_id");
        if (pid) {
          setProductoRegistrado(pid);
          return;
        }

        // 2) intenta desde la API Mongo
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        let { ok, data } = await fetchJSON(`${MONGO_API_URL}/api/productos/my`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (ok && data?.producto_id) {
          setProductoRegistrado(data.producto_id);
          await AsyncStorage.setItem("producto_id", data.producto_id);
          return;
        }

        // 3) fallback opcional: API MySQL
        ({ ok, data } = await fetchJSON(`${MYSQL_API_URL}/api/user-product/my`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }));

        if (ok && data?.producto_id) {
          setProductoRegistrado(data.producto_id);
          await AsyncStorage.setItem("producto_id", data.producto_id);
        }
      } catch (err) {
        console.error("Error al obtener producto:", err);
      }
    };

    obtenerProducto();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleRegistro = async () => {
    if (!codigo.trim()) {
      Alert.alert("Campos", "El código del producto es obligatorio.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Sesión", "No estás autenticado. Inicia sesión nuevamente.");
      navigation.replace("Login");
      return;
    }

    try {
      const { ok, status, data } = await fetchJSON(
        `${MONGO_API_URL}/api/productos/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ producto_id: codigo.trim() }),
        }
      );

      if (ok) {
        Alert.alert("Éxito", "Producto registrado correctamente.");
        setProductoRegistrado(codigo.trim());
        await AsyncStorage.setItem("producto_id", codigo.trim());
        setCodigo("");
        setNombre(""); // no se usa en la API, solo limpiamos el campo
      } else {
        const msg =
          data?.message ||
          (status === 409
            ? "Ese producto_id ya fue registrado."
            : "No se pudo registrar el producto.");
        Alert.alert("Error", msg);
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons
          name="clipboard-edit-outline"
          size={70}
          color="#00cfff"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.title}>Registrar Producto</Text>

        {productoRegistrado ? (
          <>
            <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }}>
              Ya tienes un producto registrado:
            </Text>
            <Text
              style={{
                color: "#00cfff",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 30,
              }}
            >
              {productoRegistrado}
            </Text>

            {/* (Opcional) Botón para cambiar de producto:
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#444" }]}
              onPress={() => {
                setProductoRegistrado(null);
                AsyncStorage.removeItem("producto_id");
              }}
            >
              <Text style={styles.buttonText}>Cambiar producto</Text>
            </TouchableOpacity> */}
          </>
        ) : (
          <>
            <TextInput
              placeholder="Nombre del producto (opcional)"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              placeholder="Código del producto"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={codigo}
              onChangeText={setCodigo}
              autoCapitalize="characters"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegistro}>
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>

      {/* Menú inferior */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.replace("Home")}
        >
          <Ionicons name="home-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.replace("RegisterProduct")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Registrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.replace("MonitorProduct")}
        >
          <Ionicons name="analytics-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Monitoreo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.replace("Alert")}
        >
          <Ionicons name="alert-circle-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Alertas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.replace("Schedule")}
        >
          <Ionicons name="calendar-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Horario</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00cfff",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: "white",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#00cfff",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00cfff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomMenu: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    marginTop: 4,
    color: "#00cfff",
    fontSize: 13,
  },
});
