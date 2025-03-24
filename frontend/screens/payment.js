import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [saldo, setSaldo] = useState(11.00); // Saldo inicial en pesos
  const [mostrarHistorial, setMostrarHistorial] = useState(false); // Estado para mostrar historial
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para mostrar el modal de CLABE
  const pasajes = Math.floor(saldo / 11); // Conversión de saldo a pasajes
  const clabe = "1234 5678 9012 3456"; // CLABE para depósitos

  // Datos simulados del historial de viajes
  const historialViajes = [
    { id: "324324", ruta: "Ruta 2", pago: 11.00 },
    { id: "234234", ruta: "Ruta 5", pago: 11.00 },
    { id: "346757", ruta: "Ruta 51", pago: 11.00 },
    { id: "987766", ruta: "Ruta 11", pago: 11.00 },
  ];

  const recargarSaldo = () => {
    setSaldo((prevSaldo) => prevSaldo + 11);
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#333333']} style={styles.container}>
      <Text style={styles.header}>Consulta tu saldo YoVoy</Text>

      {/* TouchableOpacity para todo el contenedor de CLABE */}
      <TouchableOpacity
        style={styles.clabeContainer}
        onPress={() => setMostrarModal(true)} // Abre el modal cuando se presiona
      >
        <Text style={styles.clabeLabel}>Depósito a esta CLABE:</Text>
        <Text style={styles.clabe}>{clabe}</Text>
      </TouchableOpacity>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balance}>${saldo.toFixed(2)}</Text>
        <Text style={styles.pasajes}>Pasajes disponibles: {pasajes}</Text>
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => setMostrarHistorial(!mostrarHistorial)}
      >
        <MaterialIcons name="history" size={24} color="white" />
        <Text style={styles.historyButtonText}>Ver historial de viajes</Text>
      </TouchableOpacity>

      {mostrarHistorial && (
        <View style={styles.historialContainer}>
          <Text style={styles.historialHeader}>Historial de viajes</Text>
          <FlatList
            data={historialViajes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historialItem}>
                <Text style={styles.historialId}>ID: {item.id}</Text>
                <Text style={styles.historialText}>Ruta: {item.ruta}</Text>
                <Text style={styles.historialText}>Pago: ${item.pago.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={recargarSaldo}>
        <MaterialIcons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Recargar saldo</Text>
      </TouchableOpacity>

      {/* Modal para mostrar la CLABE en grande */}
      <Modal
        visible={mostrarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Depósito a esta CLABE:</Text>
            <Text style={styles.modalClabe}>{clabe}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMostrarModal(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.05, // Ajuste con porcentaje
  },
  header: {
    fontSize: width * 0.06, // Ajuste con porcentaje
    fontWeight: "bold",
    color: "white",
    marginBottom: height * 0.03, // Ajuste con porcentaje
  },
  clabeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: height * 0.02, // Ajuste con porcentaje
    borderRadius: 10,
    marginBottom: height * 0.03, // Ajuste con porcentaje
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  clabeLabel: {
    fontSize: width * 0.04, // Ajuste con porcentaje
    fontWeight: "bold",
    color: "#FFF",
  },
  clabe: {
    fontSize: width * 0.045, // Ajuste con porcentaje
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: height * 0.01, // Ajuste con porcentaje
  },
  balanceContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: height * 0.03, // Ajuste con porcentaje
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    marginBottom: height * 0.03, // Ajuste con porcentaje
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: width * 0.045, // Ajuste con porcentaje
    color: "#FFF",
  },
  balance: {
    fontSize: width * 0.08, // Ajuste con porcentaje
    fontWeight: "bold",
    color: "#FFF",
    marginVertical: height * 0.02, // Ajuste con porcentaje
  },
  pasajes: {
    fontSize: width * 0.045, // Ajuste con porcentaje
    fontWeight: "bold",
    color: "#007AFF",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: height * 0.02, // Ajuste con porcentaje
    borderRadius: 10,
    marginTop: height * 0.03, // Ajuste con porcentaje
    width: "90%",
    justifyContent: "center",
  },
  historyButtonText: {
    color: "white",
    fontSize: width * 0.045, // Ajuste con porcentaje
    marginLeft: width * 0.02, // Ajuste con porcentaje
  },
  historialContainer: {
    marginTop: height * 0.03, // Ajuste con porcentaje
    width: "90%",
    backgroundColor: "#fff",
    padding: height * 0.02, // Ajuste con porcentaje
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  historialHeader: {
    fontSize: width * 0.045, // Ajuste con porcentaje
    fontWeight: "bold",
    marginBottom: height * 0.02, // Ajuste con porcentaje
  },
  historialItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: height * 0.015, // Ajuste con porcentaje
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  historialText: {
    fontSize: width * 0.04, // Ajuste con porcentaje
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: height * 0.02, // Ajuste con porcentaje
    borderRadius: 10,
    marginBottom: height * 0.02, // Ajuste con porcentaje
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.045, // Ajuste con porcentaje
    marginLeft: width * 0.02, // Ajuste con porcentaje
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    padding: height * 0.03, // Ajuste con porcentaje
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: width * 0.06, // Ajuste con porcentaje
    fontWeight: "bold",
  },
  modalClabe: {
    fontSize: width * 0.08, // Ajuste con porcentaje
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: height * 0.02, // Ajuste con porcentaje
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: height * 0.015, // Ajuste con porcentaje
    borderRadius: 10,
    marginTop: height * 0.02, // Ajuste con porcentaje
  },
  closeButtonText: {
    color: "white",
    fontSize: width * 0.045, // Ajuste con porcentaje
  },
});
