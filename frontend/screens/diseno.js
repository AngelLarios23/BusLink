import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [saldo, setSaldo] = useState(11.00); // Saldo inicial en pesos
  const [mostrarHistorial, setMostrarHistorial] = useState(false); // Estado para mostrar historial
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
    <View style={styles.container}>
      <Text style={styles.header}>Consulta tu saldo YoVoy</Text>

      <View style={styles.clabeContainer}>
        <Text style={styles.clabeLabel}>Depósito a esta CLABE:</Text>
        <Text style={styles.clabe}>{clabe}</Text>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  clabeContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  clabeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  clabe: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: 5,
  },
  balanceContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#888",
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  pasajes: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    justifyContent: "center",
  },
  historyButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  historialContainer: {
    marginTop: 20,
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  historialHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historialItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  historialText: {
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
});
