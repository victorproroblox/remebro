// src/screens/ScheduleScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 👇 Base de tu API Mongo (sin JWT)
export const API_URL = "https://edumochila-api-mongo.onrender.com";

/* Helper pequeño para fetch */
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default function ScheduleScreen({ navigation }) {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes");
  const [horario, setHorario] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hora, setHora] = useState("");
  const [materia, setMateria] = useState("");
  const [materiales, setMateriales] = useState("");
  const [productoId, setProductoId] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  /* =============== utilidades de hora =============== */

  // "6:00 am" o "06:00" → minutos
  const convertirHora = (hstr = "") => {
    const s = (hstr || "").trim();
    const [time, maybeMer] = s.split(" ");
    let [h, m] = (time || "").split(":").map((n) => parseInt(n, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN;

    if (maybeMer) {
      const mer = maybeMer.toLowerCase();
      if (mer === "pm" && h !== 12) h += 12;
      if (mer === "am" && h === 12) h = 0;
    }
    return h * 60 + m;
  };

  const ordenarClases = (clases = []) => {
    return [...clases].sort((a, b) => {
      const normA = (a.hora || "").replace(/\u2013|\u2014/g, "-");
      const normB = (b.hora || "").replace(/\u2013|\u2014/g, "-");
      const [aI] = normA.split("-").map((p) => p.trim());
      const [bI] = normB.split("-").map((p) => p.trim());
      return convertirHora(aI) - convertirHora(bI);
    });
  };

  /* =============== producto_id (local) =============== */

  // Usamos sólo AsyncStorage. Si no hay producto_id guardado, enviamos al registro.
  const getProductoId = async () => {
    const pid = await AsyncStorage.getItem("producto_id");
    return pid || null;
  };

  /* =============== cargar horario =============== */

  const cargarHorario = async (pid, diaKey) => {
    const { ok, data } = await fetchJSON(
      `${API_URL}/api/horario/${encodeURIComponent(pid)}/${encodeURIComponent(diaKey)}`
    );

    if (ok && data && Array.isArray(data.clases)) {
      setHorario(ordenarClases(data.clases));
    } else {
      setHorario([]);
    }
  };

  /* =============== efectos =============== */

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    (async () => {
      const pid = await getProductoId();
      if (!pid) {
        Alert.alert("Producto", "No tienes un producto registrado.");
        navigation.replace("RegisterProduct");
        return;
      }
      setProductoId(pid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!productoId) return;
    const diaKey = diaSeleccionado.toLowerCase();
    cargarHorario(productoId, diaKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaSeleccionado, productoId]);

  /* =============== agregar clase (POST) =============== */

  const agregarClase = async () => {
    const horaNorm = (hora || "").replace(/\u2013|\u2014/g, "-").trim();

    if (!horaNorm.includes("-")) {
      Alert.alert("Formato incorrecto", "Usa el formato: 6:00 am - 7:00 am");
      return;
    }

    const [inicioHoraStr, finHoraStr] = horaNorm.split("-").map((p) => p.trim());
    if (!inicioHoraStr || !finHoraStr) {
      Alert.alert("Hora inválida", "No se pudo dividir correctamente la hora.");
      return;
    }

    const inicioMin = convertirHora(inicioHoraStr);
    const finMin = convertirHora(finHoraStr);

    if (isNaN(inicioMin) || isNaN(finMin)) {
      Alert.alert("Hora inválida", "No se pudo interpretar el rango de hora.");
      return;
    }
    if (finMin <= inicioMin) {
      Alert.alert("Rango inválido", "La hora final debe ser mayor que la inicial.");
      return;
    }

    // Sin traslapes
    const hayTraslape = horario.some((c) => {
      const norm = (c.hora || "").replace(/\u2013|\u2014/g, "-");
      const [eI, eF] = norm.split("-").map((t) => t.trim());
      const eIMin = convertirHora(eI);
      const eFMin = convertirHora(eF);
      return inicioMin < eFMin && finMin > eIMin;
    });
    if (hayTraslape) {
      Alert.alert("Conflicto de horario", "Ya hay una clase registrada en ese horario.");
      return;
    }

    const payload = {
      producto_id: productoId,
      dia: diaSeleccionado.toLowerCase(),
      hora: horaNorm,
      materia: (materia || "").trim(),
      materiales: (materiales || "").trim(), // el backend lo normaliza a array
    };

    // IMPORTANTE: POST /clase sólo hace $push (sin $set de 'clases'), evitando conflictos.
    const { ok, data, status } = await fetchJSON(`${API_URL}/api/horario/clase`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (ok) {
      await cargarHorario(productoId, payload.dia); // refrescamos desde servidor
      setModalVisible(false);
      setHora("");
      setMateria("");
      setMateriales("");
    } else {
      Alert.alert("Error", data?.message || `No se pudo guardar (HTTP ${status})`);
    }
  };

  /* =============== eliminar clase (PUT set array) =============== */

  const eliminarClase = async (index) => {
    const actualizado = [...horario];
    actualizado.splice(index, 1);

    const payload = {
      producto_id: productoId,
      dia: diaSeleccionado.toLowerCase(),
      clases: actualizado.map((c) => ({
        hora: c.hora,
        materia: c.materia,
        materiales: c.materiales,
      })),
    };

    // IMPORTANTE: aquí SÍ usamos PUT con $set del array completo (sin $push) para evitar conflicto.
    const { ok, data, status } = await fetchJSON(`${API_URL}/api/horario`, {
      method: "PUT",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (ok) {
      setHorario(ordenarClases(actualizado));
      Alert.alert("Listo", "Clase eliminada");
    } else {
      Alert.alert("Error", data?.error || `No se pudo actualizar (HTTP ${status})`);
    }
  };

  /* =============== UI =============== */

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons name="calendar-edit" size={60} color="#00cfff" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Gestión del horario escolar</Text>

        <View style={styles.diaSelector}>
          {dias.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[styles.diaBoton, diaSeleccionado === dia && styles.diaBotonActivo]}
              onPress={() => setDiaSeleccionado(dia)}
            >
              <Text style={[styles.diaTexto, diaSeleccionado === dia && styles.diaTextoActivo]}>{dia}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={horario}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay clases asignadas</Text>}
          renderItem={({ item, index }) => (
            <View style={styles.claseItem}>
              <View>
                <Text style={styles.claseHora}>{item.hora}</Text>
                <Text style={styles.claseMateria}>{item.materia}</Text>
                <Text style={styles.claseMateriales}>
                  {Array.isArray(item.materiales) ? item.materiales.join(", ") : item.materiales}
                </Text>
              </View>
              <TouchableOpacity onPress={() => eliminarClase(index)}>
                <Ionicons name="trash-outline" size={20} color="#f55" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.agregarButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={22} color="white" />
          <Text style={styles.agregarTexto}>Agregar clase</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal agregar clase */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva clase para {diaSeleccionado}</Text>

            <TextInput
              style={styles.input}
              placeholder="Ej: 6:00 am - 7:00 am"
              placeholderTextColor="#aaa"
              value={hora}
              onChangeText={setHora}
            />
            <Text style={styles.helperText}>Formato: hora inicio - hora fin (ej. 6:00 am - 7:00 am)</Text>

            <TextInput
              style={styles.input}
              placeholder="Materia"
              placeholderTextColor="#aaa"
              value={materia}
              onChangeText={setMateria}
            />
            <TextInput
              style={styles.input}
              placeholder="Materiales (separados por coma)"
              placeholderTextColor="#aaa"
              value={materiales}
              onChangeText={setMateriales}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity style={styles.agregarButton} onPress={agregarClase}>
                <Text style={styles.agregarTexto}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.agregarButton, { backgroundColor: "#555" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.agregarTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom menu (navegación simple) */}
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

/* ====================== estilos ====================== */

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 30, justifyContent: "space-between" },
  card: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 25, padding: 25, flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#00cfff", textAlign: "center", marginBottom: 15 },
  diaSelector: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" },
  diaBoton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#333", borderRadius: 20, marginVertical: 4 },
  diaBotonActivo: { backgroundColor: "#00cfff" },
  diaTexto: { color: "#ccc", fontSize: 13 },
  diaTextoActivo: { color: "#fff", fontWeight: "bold" },
  claseItem: {
    backgroundColor: "#222",
    borderRadius: 18,
    padding: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  claseHora: { color: "#00cfff", fontWeight: "bold", fontSize: 14 },
  claseMateria: { color: "white", fontSize: 15 },
  claseMateriales: { color: "#aaa", fontSize: 13 },
  agregarButton: {
    marginTop: 15,
    backgroundColor: "#00cfff",
    padding: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  agregarTexto: { color: "white", fontWeight: "bold", fontSize: 15, marginLeft: 8 },
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
    marginTop: 10,
  },
  menuItem: { alignItems: "center", justifyContent: "center" },
  menuText: { marginTop: 4, color: "#00cfff", fontSize: 13 },
  emptyText: { color: "#aaa", fontStyle: "italic", textAlign: "center", marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { backgroundColor: "#111", borderRadius: 20, padding: 20, width: "90%" },
  modalTitle: { color: "#00cfff", fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { backgroundColor: "#222", color: "white", borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 14 },
  helperText: { color: "#aaa", fontSize: 12, marginBottom: 10, marginLeft: 5 },
});
