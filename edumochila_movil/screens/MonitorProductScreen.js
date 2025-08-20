import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const screenWidth = Dimensions.get("window").width;

/** ====== BASES DE API ====== */
export const API_MONGO = "https://edumochila-api-mongo.onrender.com";
export const API_MYSQL = "https://TU-API-MYSQL.com"; // <-- cámbiala

/** ====== HELPERS ====== */
const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function authHeadersForMongo() {
  const token = await AsyncStorage.getItem("mongo_token"); // token emitido por la API de Mongo
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** ====== COMPONENTE ====== */
export default function MonitorProductScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [pesoActual, setPesoActual] = useState(null);
  const [datosGrafica, setDatosGrafica] = useState({ labels: [], data: [] });
  const [ubicacion, setUbicacion] = useState(null);
  const [recorrido, setRecorrido] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  /** Obtiene y cachea el producto_id del usuario */
  const getProductoId = async () => {
    const cached = await AsyncStorage.getItem("producto_id");
    if (cached) return cached;

    // 1) Intentar en API Mongo (si ahí expones /api/productos/my)
    try {
      const { ok, data, status } = await fetchJSON(
        `${API_MONGO}/api/productos/my`,
        { headers: await authHeadersForMongo() }
      );
      if (ok && data?.producto_id) {
        await AsyncStorage.setItem("producto_id", data.producto_id);
        return data.producto_id;
      } else if (status === 401) {
        console.log("Mongo 401 en /api/productos/my → token inválido o ausente");
      }
    } catch (e) {
      console.log("Error consultando /api/productos/my (Mongo):", e?.message);
    }

    // 2) Fallback en API MySQL
    try {
      const mysqlToken = await AsyncStorage.getItem("mysql_token"); // guarda este tras login MySQL
      const { ok, data, status } = await fetchJSON(
        `${API_MYSQL}/api/user-product/my`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(mysqlToken ? { Authorization: `Bearer ${mysqlToken}` } : {}),
          },
        }
      );
      if (ok && data?.producto_id) {
        await AsyncStorage.setItem("producto_id", data.producto_id);
        return data.producto_id;
      } else if (status === 401) {
        console.log("MySQL 401 en /api/user-product/my → token inválido o ausente");
      }
    } catch (e) {
      console.log("Error consultando /api/user-product/my (MySQL):", e?.message);
    }

    return null;
  };

  /** Carga pesos y ubicaciones por fecha desde la API de Mongo */
  const cargarDatos = async (fecha) => {
    try {
      // Verificar sesión de Mongo (puedes redirigir si no hay token)
      const mongoToken = await AsyncStorage.getItem("mongo_token");
      if (!mongoToken) {
        Alert.alert("Sesión", "Inicia sesión de nuevo (Mongo).");
        navigation.replace("Login");
        return;
      }

      const producto_id = await getProductoId();
      const fechaStr = toISODate(fecha);

      if (!producto_id) {
        setPesoActual("No registrado");
        setUbicacion("Sin producto asignado");
        setDatosGrafica({ labels: [], data: [] });
        setRecorrido([]);
        return;
      }

      // --- Pesos por fecha ---
      {
        const { ok, data, status } = await fetchJSON(
          `${API_MONGO}/api/pesos/${encodeURIComponent(
            producto_id
          )}?fecha=${encodeURIComponent(fechaStr)}`,
          { headers: await authHeadersForMongo() }
        );

        if (status === 401) {
          console.log("401 en /api/pesos → revisa mongo_token o middleware");
        }

        if (ok && Array.isArray(data) && data.length > 0) {
          const etiquetas = data.map((p) => {
            const f = new Date(p.fecha);
            const hh = String(f.getHours()).padStart(2, "0");
            const mm = String(f.getMinutes()).padStart(2, "0");
            return `${hh}:${mm}`;
          });
          const pesos = data.map((p) => Number(p.peso));
          setDatosGrafica({ labels: etiquetas, data: pesos });
          setPesoActual(pesos[pesos.length - 1]); // último del día
        } else {
          setDatosGrafica({ labels: [], data: [] });
          setPesoActual(null);
        }
      }

      // --- Ubicaciones por fecha ---
      {
        const { ok, data, status } = await fetchJSON(
          `${API_MONGO}/api/ubicaciones/${encodeURIComponent(
            producto_id
          )}/por-fecha?fecha=${encodeURIComponent(fechaStr)}`,
          { headers: await authHeadersForMongo() }
        );

        if (status === 401) {
          console.log("401 en /api/ubicaciones → revisa mongo_token o middleware");
        }

        if (ok && Array.isArray(data) && data.length > 0) {
          const ultimo = data[data.length - 1];
          if (typeof ultimo.lat === "number" && typeof ultimo.lng === "number") {
            setUbicacion(`${ultimo.lat.toFixed(6)}, ${ultimo.lng.toFixed(6)}`);
          } else {
            setUbicacion("Sin datos de GPS");
          }

          setRecorrido(
            data
              .filter(
                (p) => typeof p.lat === "number" && typeof p.lng === "number"
              )
              .map((p) => ({ lat: p.lat, lng: p.lng }))
          );
        } else {
          setUbicacion("Sin datos de GPS");
          setRecorrido([]);
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setPesoActual(null);
      setDatosGrafica({ labels: [], data: [] });
      setUbicacion("Error");
      setRecorrido([]);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    cargarDatos(fechaSeleccionada);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada]);

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <MaterialCommunityIcons name="chart-line" size={60} color="#00cfff" style={{ marginBottom: 10 }} />
          <Text style={styles.title}>Monitoreo del producto</Text>

          {/* Selector de fecha */}
          <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.fechaBtn}>
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.fechaText}>Filtrar por: {toISODate(fechaSeleccionada)}</Text>
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

          <View style={styles.section}>
            <Text style={styles.label}>Peso actual:</Text>
            <Text style={styles.pesoActual}>
              {pesoActual !== null && pesoActual !== undefined ? `${pesoActual} kg` : "Sin datos"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Peso diario</Text>
            {datosGrafica.data && datosGrafica.data.length > 0 ? (
              <ScrollView horizontal>
                <LineChart
                  data={{ labels: datosGrafica.labels, datasets: [{ data: datosGrafica.data }] }}
                  width={screenWidth * 1.5}
                  height={160}
                  yAxisSuffix="kg"
                  chartConfig={{
                    backgroundColor: "#2c5364",
                    backgroundGradientFrom: "#203a43",
                    backgroundGradientTo: "#0f2027",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 207, 255, ${opacity})`,
                    labelColor: () => "#ccc",
                    style: { borderRadius: 16 },
                    propsForDots: { r: "5", strokeWidth: "3", stroke: "#00cfff" },
                  }}
                  bezier
                  style={{ borderRadius: 15 }}
                />
              </ScrollView>
            ) : (
              <Text style={styles.placeholderText}>Sin datos de peso en esta fecha</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Última ubicación GPS:</Text>
            <Text style={styles.pesoActual}>{ubicacion || "Sin datos de GPS"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Recorrido GPS</Text>
            {recorrido.length > 0 ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: recorrido[0].lat,
                  longitude: recorrido[0].lng,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
              >
                {recorrido.map((coord, index) => {
                  const esUltimo = index === recorrido.length - 1;
                  return (
                    <Marker
                      key={index}
                      coordinate={{ latitude: coord.lat, longitude: coord.lng }}
                      title={esUltimo ? "Última ubicación" : `Punto ${index + 1}`}
                      pinColor={esUltimo ? "blue" : "red"}
                    />
                  );
                })}
                <Polyline
                  coordinates={recorrido.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
                  strokeColor="#00cfff"
                  strokeWidth={3}
                />
              </MapView>
            ) : (
              <Text style={styles.placeholderText}>Sin recorrido en esta fecha</Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>

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

/** ====== ESTILOS ====== */
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 120 },
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
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#00cfff", marginBottom: 20, textAlign: "center" },
  section: { width: "100%", marginBottom: 20 },
  label: { color: "#ccc", fontSize: 14, marginBottom: 8 },
  pesoActual: { color: "white", fontSize: 22, fontWeight: "bold" },
  placeholderText: { color: "#888", fontSize: 14 },
  map: { width: "100%", height: 180, borderRadius: 15 },
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
  menuItem: { alignItems: "center", justifyContent: "center" },
  menuText: { marginTop: 4, color: "#00cfff", fontSize: 13 },
  fechaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cfff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  fechaText: { color: "white", fontSize: 14, marginLeft: 8 },
});
