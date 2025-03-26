import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

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
    <LinearGradient colors={['#87fcf4', '#3f78de']} style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Consulta de Saldo</Text>
      </View>

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

      {/* Modal para mostrar el historial de viajes */}
      <Modal visible={mostrarHistorial} animationType="slide" transparent={true} onRequestClose={() => setMostrarHistorial(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Historial de Viajes</Text>
            <FlatList
              data={historialViajes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historialItem}>
                  <Text style={styles.historialId}>ID: {item.id}</Text>
                  <Text style={styles.historialText}>  |{item.ruta}</Text>
                  <Text style={styles.historialText}>| Pago: ${item.pago.toFixed(2)}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setMostrarHistorial(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Barra inferior con botones */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setMostrarHistorial(!mostrarHistorial)}
        >
          <MaterialIcons name="history" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Ver historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={recargarSaldo}>
          <MaterialIcons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Recargar saldo</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    backgroundColor: "#a0dcf8",
    paddingVertical: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  
  title: {
    color: "white",
    fontSize: width * 0.07,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  clabeContainer: {
    backgroundColor: "#daedf5",
    padding: height * 0.02,
    borderRadius: 10,
    marginBottom: height * 0.03,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  clabeLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#060606",
  },
  clabe: {
    fontSize: width * 0.045,
    color: "#060606",
    fontWeight: "bold",
    marginTop: height * 0.01,
  },
  balanceContainer: {
    backgroundColor: "rgba(232, 177, 177, 0.1)",
    padding: height * 0.03,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: width * 0.045,
    color: "#FFF",
  },
  balance: {
    fontSize: width * 0.1, // Aumento del tamaño del saldo
    fontWeight: "bold",
    color: "#FFF",
    marginVertical: height * 0.02,
  },
  pasajes: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#007AFF",
  },
  historialItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  historialText: {
    fontSize: width * 0.04,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#333",
    paddingVertical: height * 0.02,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: width * 0.05,
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomButtonText: {
    color: "white",
    fontSize: width * 0.045,
    marginLeft: width * 0.02,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    padding: height * 0.03,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  modalClabe: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: height * 0.02,
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: height * 0.015,
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  closeButtonText: {
    color: "white",
    fontSize: width * 0.045,
  },
});
