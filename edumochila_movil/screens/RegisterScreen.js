import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const API_URL = "https://edumochila-api-mysql.onrender.com";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nom1_us: "",
    nom2_us: "",
    ap_us: "",
    am_us: "",
    email_us: "",
    nom_us: "",
    pass_us: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validaciones rápidas en cliente
    if (
      !form.nom1_us.trim() ||
      !form.ap_us.trim() ||
      !form.am_us.trim() ||
      !form.email_us.trim() ||
      !form.nom_us.trim() ||
      !form.pass_us.trim()
    ) {
      Alert.alert("Campos incompletos", "Llena todos los campos obligatorios");
      return;
    }

    const emailOk = /\S+@\S+\.\S+/.test(form.email_us);
    if (!emailOk) {
      Alert.alert("Correo inválido", "Introduce un correo electrónico válido.");
      return;
    }
    if (form.pass_us.length < 6) {
      Alert.alert("Contraseña corta", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom1_us: form.nom1_us.trim(),
          nom2_us: form.nom2_us?.trim() || null,
          ap_us: form.ap_us.trim(),
          am_us: form.am_us.trim(),
          email_us: form.email_us.trim(),
          nom_us: form.nom_us.trim(),
          pass_us: form.pass_us,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.estatus === "exitoso") {
        Alert.alert("¡Registro exitoso!", data.mensaje || "Tu cuenta fue creada.");
        navigation.replace("Login");
      } else {
        const msg =
          data.mensaje ||
          (res.status === 409
            ? "El usuario o correo ya existen."
            : "Fallo en el registro");
        Alert.alert("Error", msg);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error de red", "No se pudo conectar al servidor");
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
        <Text style={styles.title}>EDUMOCHILA</Text>

        {/* Tabs: Login / Registro */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, styles.inactiveTab]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.tabText, styles.inactiveTabText]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>
              Registrarte
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
          <TextInput
            placeholder="Primer nombre*"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.nom1_us}
            onChangeText={(text) => handleChange("nom1_us", text)}
          />
          <TextInput
            placeholder="Segundo nombre (opcional)"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.nom2_us}
            onChangeText={(text) => handleChange("nom2_us", text)}
          />
          <TextInput
            placeholder="Apellido paterno*"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.ap_us}
            onChangeText={(text) => handleChange("ap_us", text)}
          />
          <TextInput
            placeholder="Apellido materno*"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.am_us}
            onChangeText={(text) => handleChange("am_us", text)}
          />
          <TextInput
            placeholder="Correo electrónico*"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email_us}
            onChangeText={(text) => handleChange("email_us", text)}
          />
          <TextInput
            placeholder="Nombre de usuario*"
            placeholderTextColor="#aaa"
            style={styles.input}
            autoCapitalize="none"
            value={form.nom_us}
            onChangeText={(text) => handleChange("nom_us", text)}
          />
          <TextInput
            placeholder="Contraseña*"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={form.pass_us}
            onChangeText={(text) => handleChange("pass_us", text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 30,
    margin: 25,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    height: "85%",
  },
  title: {
    fontSize: 26,
    color: "#00aaff",
    fontWeight: "bold",
    marginBottom: 25,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#2b2b2b",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
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
  input: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: "white",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00aaff",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
