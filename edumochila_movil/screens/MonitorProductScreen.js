// src/screens/MonitorProductScreen.jsx
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
  Modal,
  TextInput,
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
export const API_MYSQL = "https://edumochila-api-mysql.onrender.com";

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

async function bootstrapAuth() {
  const existingMongo = await AsyncStorage.getItem("mongo_token");
  if (existingMongo) return;
  const mysqlToken =
    (await AsyncStorage.getItem("mysql_token")) ||
    (await AsyncStorage.getItem("token"));
  if (mysqlToken) {
    await AsyncStorage.setItem("mongo_token", mysqlToken);
  }
}

async function ensureMongoTokenOnce() {
  const existingMongo = await AsyncStorage.getItem("mongo_token");
  if (existingMongo) return true;
  const mysqlToken =
    (await AsyncStorage.getItem("mysql_token")) ||
    (await AsyncStorage.getItem("token"));
  if (mysqlToken) {
    await AsyncStorage.setItem("mongo_token", mysqlToken);
    return true;
  }
  return false;
}

async function authHeadersForMongo() {
  const token = await AsyncStorage.getItem("mongo_token");
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

  // ===== límite de peso =====
  const [limiteModal, setLimiteModal] = useState(false);
  const [kgSel, setKgSel] = useState(0); // 0..5
  const [gSel, setGSel] = useState(0); // 0..900 (step 50)
  const [limiteGramos, setLimiteGramos] = useState(null); // null o número en gramos

  // evitar alertas repetidas
  const warnedRef = useRef(false);
  const ultimoEnviadoRef = useRef({ fecha: null, valorGr: null });

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    bootstrapAuth();
    (async () => {
      const stored = await AsyncStorage.getItem("peso_limit_grams");
      if (stored) {
        const grams = parseInt(stored, 10);
        setLimiteGramos(grams);
        const kg = Math.min(5, Math.floor(grams / 1000));
        const g = grams % 1000;
        setKgSel(kg);
        setGSel(Math.min(900, Math.round(g / 50) * 50));
      }
    })();
  }, []);

  /** Obtiene y cachea el producto_id del usuario */
  const getProductoId = async () => {
    const cached = await AsyncStorage.getItem("producto_id");
    if (cached) return cached;

    // 1) Mongo
    try {
      const { ok, data } = await fetchJSON(`${API_MONGO}/api/productos/my`, {
        headers: await authHeadersForMongo(),
      });
      if (ok && data?.producto_id) {
        await AsyncStorage.setItem("producto_id", data.producto_id);
        return data.producto_id;
      }
    } catch (e) {}

    // 2) MySQL (fallback)
    try {
      const mysqlToken =
        (await AsyncStorage.getItem("mysql_token")) ||
        (await AsyncStorage.getItem("token"));
      const { ok, data } = await fetchJSON(`${API_MYSQL}/api/user-product/my`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(mysqlToken ? { Authorization: `Bearer ${mysqlToken}` } : {}),
        },
      });
      if (ok && data?.producto_id) {
        await AsyncStorage.setItem("producto_id", data.producto_id);
        return data.producto_id;
      }
    } catch (e) {}

    return null;
  };

  /** Envía alerta/ mensaje cuando el límite se excede */
  const enviarAlertaPeso = async (producto_id, pesoKg, limiteKg) => {
    try {
      const body = {
        tipo: "peso_limite",
        producto_id,
        texto: `Límite de peso excedido. Peso: ${pesoKg.toFixed(2)} kg`,
        peso_kg: Number(pesoKg),
        limite_kg: Number(limiteKg),
        fecha: new Date().toISOString(),
      };

      const { ok, status, data } = await fetchJSON(`${API_MONGO}/api/mensajes`, {
        method: "POST",
        headers: await authHeadersForMongo(),
        body: JSON.stringify(body),
      });

      if (!ok) {
        console.log("Error enviando mensaje de límite:", status, data);
      }
    } catch (e) {
      console.log("Excepción enviando mensaje:", e?.message);
    }
  };

  /** Carga pesos/ubicaciones por fecha y verifica el límite */
  const cargarDatos = async (fecha) => {
    const hasToken = await ensureMongoTokenOnce();
    if (!hasToken && !warnedRef.current) {
      warnedRef.current = true;
      Alert.alert("Sesión", "No hay token válido. Inicia sesión para ver datos protegidos.");
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

    try {
      // ---- Pesos por fecha ----
      {
        const { ok, data, status } = await fetchJSON(
          `${API_MONGO}/api/pesos/${encodeURIComponent(
            producto_id
          )}?fecha=${encodeURIComponent(fechaStr)}`,
          { headers: await authHeadersForMongo() }
        );

        if (status === 401 && !warnedRef.current) {
          warnedRef.current = true;
          Alert.alert("Permisos", "Tu sesión de Mongo no es válida (401).");
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

          const ultimoKg = pesos[pesos.length - 1];
          setPesoActual(ultimoKg);

          // ===== Verificar límite (si está configurado) =====
          if (limiteGramos != null) {
            const limiteKg = limiteGramos / 1000;
            const actualGr = Math.round(Number(ultimoKg || 0) * 1000);

            const keyDia = fechaStr;
            if (
              actualGr > limiteGramos &&
              !(
                ultimoEnviadoRef.current.fecha === keyDia &&
                ultimoEnviadoRef.current.valorGr === actualGr
              )
            ) {
              await enviarAlertaPeso(producto_id, ultimoKg, limiteKg);
              ultimoEnviadoRef.current = { fecha: keyDia, valorGr: actualGr };
              await AsyncStorage.setItem(
                "last_peso_alert_ts",
                String(Date.now())
              );
              Alert.alert("Alerta", `Límite excedido. Peso: ${ultimoKg} kg`);
            }
          }
        } else {
          setDatosGrafica({ labels: [], data: [] });
          setPesoActual(null);
        }
      }

      // ---- Ubicaciones por fecha ----
      {
        const { ok, data, status } = await fetchJSON(
          `${API_MONGO}/api/ubicaciones/${encodeURIComponent(
            producto_id
          )}/por-fecha?fecha=${encodeURIComponent(fechaStr)}`,
          { headers: await authHeadersForMongo() }
        );
        if (status === 401 && !warnedRef.current) {
          warnedRef.current = true;
          Alert.alert("Permisos", "Tu sesión de Mongo no es válida (401).");
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
              .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
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
    cargarDatos(fechaSeleccionada);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada, limiteGramos]);

  /** ===== UI selector de límite ===== */
  const KG_OPTS = [0, 1, 2, 3, 4, 5];
  const STEP_G = 50; // tamaño de paso en gramos

  // normaliza gramos escritos a mano
  const normalizeGrams = (val) => {
    let n = parseInt(String(val).replace(/[^\d]/g, ""), 10);
    if (Number.isNaN(n)) n = 0;
    n = Math.max(0, Math.min(900, n));
    // redondea al múltiplo más cercano del paso
    n = Math.round(n / STEP_G) * STEP_G;
    return n;
  };

  const incG = () => {
    if (kgSel === 5) return; // 5 kg -> g bloqueado en 0
    setGSel((prev) => Math.min(900, prev + STEP_G));
  };
  const decG = () => setGSel((prev) => Math.max(0, prev - STEP_G));

  const onKgPress = (k) => {
    setKgSel(k);
    // si top 5 kg, fuerza 0 g
    if (k === 5) setGSel(0);
  };

  const guardarLimite = async () => {
    // si 5 kg, gramos debe ser 0
    const grams = kgSel * 1000 + (kgSel === 5 ? 0 : gSel);
    if (grams > 5000) {
      return Alert.alert("Límite", "El máximo permitido es 5,000 g (5 kg).");
    }
    setLimiteGramos(grams);
    await AsyncStorage.setItem("peso_limit_grams", String(grams));
    setLimiteModal(false);
  };

  const limpiarLimite = async () => {
    setLimiteGramos(null);
    await AsyncStorage.removeItem("peso_limit_grams");
    setLimiteModal(false);
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <MaterialCommunityIcons name="chart-line" size={60} color="#00cfff" style={{ marginBottom: 10 }} />
          <Text style={styles.title}>Monitoreo del producto</Text>

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

          {/* Peso actual + Límite */}
          <View style={[styles.section, { gap: 8 }]}>
            <Text style={styles.label}>Peso actual:</Text>
            <Text style={styles.pesoActual}>
              {pesoActual !== null && pesoActual !== undefined ? `${pesoActual} kg` : "Sin datos"}
            </Text>

            <View style={styles.limiteRow}>
              <Text style={styles.limiteText}>
                Límite:{" "}
                {limiteGramos == null
                  ? "—"
                  : `${Math.floor(limiteGramos / 1000)} kg ${limiteGramos % 1000} g`}
              </Text>
              <TouchableOpacity
                style={styles.limiteBtn}
                onPress={() => {
                  if (limiteGramos != null) {
                    const kg = Math.min(5, Math.floor(limiteGramos / 1000));
                    const g = limiteGramos % 1000;
                    setKgSel(kg);
                    setGSel(kg === 5 ? 0 : Math.min(900, Math.round(g / STEP_G) * STEP_G));
                  } else {
                    setKgSel(0);
                    setGSel(0);
                  }
                  setLimiteModal(true);
                }}
              >
                <Ionicons name="speedometer-outline" size={16} color="#fff" />
                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "bold" }}>Definir límite</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Gráfica */}
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

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.label}>Última ubicación GPS:</Text>
            <Text style={styles.pesoActual}>{ubicacion || "Sin datos de GPS"}</Text>
          </View>

          {/* Recorrido */}
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

      {/* Modal selector de límite */}
      <Modal visible={limiteModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Definir límite de peso</Text>

            <View style={styles.selectorRow}>
              {/* KILOS */}
              <View style={{ alignItems: "center" }}>
                <Text style={styles.selectorLabel}>kg</Text>
                <View style={styles.chipsRow}>
                  {KG_OPTS.map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={[styles.chip, kgSel === k && styles.chipActive]}
                      onPress={() => onKgPress(k)}
                    >
                      <Text style={[styles.chipText, kgSel === k && styles.chipTextActive]}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.separator}>—</Text>

              {/* GRAMOS con stepper + input */}
              <View style={{ alignItems: "center", width: 150 }}>
                <Text style={styles.selectorLabel}>g</Text>

                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { opacity: gSel <= 0 ? 0.5 : 1 }]}
                    onPress={decG}
                    disabled={gSel <= 0}
                  >
                    <Ionicons name="remove" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TextInput
                    style={styles.gramInput}
                    keyboardType="numeric"
                    value={String(gSel)}
                    onChangeText={(t) => {
                      if (kgSel === 5) {
                        setGSel(0);
                        return;
                      }
                      setGSel(normalizeGrams(t));
                    }}
                    editable={kgSel !== 5}
                  />

                  <TouchableOpacity
                    style={[styles.stepBtn, { opacity: kgSel === 5 || gSel >= 900 ? 0.5 : 1 }]}
                    onPress={incG}
                    disabled={kgSel === 5 || gSel >= 900}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.helperG}>
                  {kgSel === 5 ? "Con 5 kg los gramos deben ser 0" : "Paso de 50 g (0–900)"}
                </Text>
              </View>
            </View>

            <Text style={styles.previewText}>
              Límite seleccionado: {kgSel} kg {kgSel === 5 ? 0 : gSel} g
            </Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.limiteBtn, { backgroundColor: "#00cfff" }]} onPress={guardarLimite}>
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "bold" }}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.limiteBtn, { backgroundColor: "#555" }]}
                onPress={() => setLimiteModal(false)}
              >
                <Ionicons name="close-outline" size={18} color="#fff" />
                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "bold" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.limiteBtn, { backgroundColor: "#d9534f" }]}
                onPress={limpiarLimite}
              >
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "bold" }}>Quitar límite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom menu */}
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

  // fecha
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

  // límite
  limiteRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  limiteText: { color: "#ccc", fontSize: 14 },
  limiteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00a3c4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
  },

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: { color: "#00cfff", fontWeight: "bold", fontSize: 18, textAlign: "center", marginBottom: 12 },

  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  selectorLabel: { color: "#9ad4e3", fontSize: 13, marginBottom: 6 },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    maxWidth: 220,
    justifyContent: "center",
  },
  chip: { backgroundColor: "#222", borderRadius: 14, paddingVertical: 6, paddingHorizontal: 10 },
  chipActive: { backgroundColor: "#00cfff" },
  chipText: { color: "#ddd", fontSize: 14 },
  chipTextActive: { color: "#fff", fontWeight: "bold" },

  separator: { color: "#ccc", fontSize: 28, marginHorizontal: 6 },

  // stepper gramos
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBtn: {
    backgroundColor: "#00a3c4",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  gramInput: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 70,
    textAlign: "center",
    fontSize: 16,
  },
  helperG: { color: "#999", fontSize: 11, marginTop: 6 },

  previewText: { color: "#ddd", textAlign: "center", marginVertical: 8 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },

  // bottom nav
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
});
