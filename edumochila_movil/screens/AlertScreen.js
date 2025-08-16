import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const MONGO_API_URL = Platform.select({
  ios: "http://localhost:5000",       // iOS Simulator
  android: "http://192.168.1.103:5000",    // Android Emulator
  default: "http://192.168.1.103:5000" // Dispositivo físico: cambia por la IP de tu PC
});

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function toISODate(date) {
  // YYYY-MM-DD
  return date.toISOString().split("T")[0];
}

export default function AlertScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [alertas, setAlertas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const getProductoId = async () => {
    // 1) Intenta desde AsyncStorage
    let pid = await AsyncStorage.getItem("producto_id");
    if (pid) return pid;

    // 2) Intenta desde la API Mongo
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return null;
      const { ok, data } = await fetchJSON(`${MONGO_API_URL}/api/productos/my`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (ok && data?.producto_id) {
        await AsyncStorage.setItem("producto_id", data.producto_id);
        return data.producto_id;
      }
    } catch {}
    return null;
  };

  const obtenerAlertas = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setAlertas([]);
      navigation.replace("Login");
      return;
    }

    const producto_id = await getProductoId();
    if (!producto_id) {
      setAlertas([]);
      return;
    }

    const fecha = toISODate(fechaSeleccionada);

    const { ok, status, data } = await fetchJSON(
      `${MONGO_API_URL}/api/mensajes/${encodeURIComponent(
        producto_id
      )}/${encodeURIComponent(fecha)}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (ok && Array.isArray(data)) {
      // El backend ordena asc; mostramos los más recientes primero
      setAlertas([...data].reverse());
    } else {
      if (status === 401) navigation.replace("Login");
      setAlertas([]);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    obtenerAlertas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada]);

  const renderItem = ({ item }) => (
    <View style={styles.alertItem}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={28}
        color="#00cfff"
        style={{ marginRight: 12 }}
      />
      <View>
        <Text style={styles.alertType}>{item.message}</Text>
        <Text style={styles.alertTime}>
          {item.fecha ? new Date(item.fecha).toLocaleString() : "Fecha no disponible"}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons
          name="alert-decagram-outline"
          size={60}
          color="#00cfff"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.title}>Alertas y actividad</Text>

        <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.dateButton}>
          <Ionicons name="calendar-outline" size={20} color="#00cfff" />
          <Text style={styles.dateText}>{fechaSeleccionada.toLocaleDateString("es-MX")}</Text>
        </TouchableOpacity>

        {mostrarPicker && (
          <DateTimePicker
            value={fechaSeleccionada}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setMostrarPicker(false);
              if (selectedDate) setFechaSeleccionada(selectedDate);
            }}
          />
        )}

        <FlatList
          data={alertas}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item?._id ? String(item._id) : String(index))}
          ListEmptyComponent={
            <Text style={styles.alertTime}>No hay alertas para esta fecha</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </Animated.View>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace("Home")}>
          <Ionicons name="home-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace("RegisterProduct")}>
          <Ionicons name="add-circle-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace("MonitorProduct")}>
          <Ionicons name="analytics-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Monitoreo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace("Alert")}>
          <Ionicons name="alert-circle-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Alertas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace("Schedule")}>
          <Ionicons name="calendar-outline" size={24} color="#00cfff" />
          <Text style={styles.menuText}>Horario</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 30, justifyContent: "space-between" },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00cfff",
    marginBottom: 20,
    textAlign: "center",
  },
  alertItem: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    width: "100%",
    alignItems: "flex-start",
    minHeight: 100,
  },
  alertType: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  alertTime: {
    color: "#aaa",
    fontSize: 15,
  },
  dateButton: {
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
    color: "#00cfff",
    fontSize: 15,
    marginLeft: 8,
  },
  bottomMenu: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 15,
  },
  menuItem: { alignItems: "center", justifyContent: "center" },
  menuText: { marginTop: 4, color: "#00cfff", fontSize: 13 },
});
