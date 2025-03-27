import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import { Ionicons } from '@expo/vector-icons'; // Importar íconos

const BuzonSugerencias = () => {
  const [sugerencias, setSugerencias] = useState([]); // Estado para almacenar las sugerencias
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar/ocultar el modal de filtros
  const [filtro, setFiltro] = useState("masActual"); // Estado para almacenar el filtro seleccionado

  // Obtener las sugerencias de Firebase
  useEffect(() => {
    const sugerenciasRef = ref(database, 'suggestions'); // Ruta correcta: 'suggestions'
    console.log("Ruta de Firebase:", sugerenciasRef.toString()); // Depuración: Verifica la ruta

    onValue(sugerenciasRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Datos obtenidos de Firebase:", data); // Depuración: Verifica qué datos se están obteniendo

      if (data) {
        // Convertir el objeto de sugerencias en un array
        const sugerenciasArray = Object.keys(data).map((key) => ({
          id: key, // Usar el ID único de Firebase como clave
          ...data[key], // Copiar el resto de los datos de la sugerencia
        }));

        console.log("Sugerencias antes de ordenar:", sugerenciasArray); // Depuración: Verifica los datos antes de ordenar

        // Aplicar el filtro seleccionado
        const sugerenciasFiltradas = aplicarFiltro(sugerenciasArray, filtro);

        // Actualizar el estado con las sugerencias filtradas y ordenadas
        setSugerencias(sugerenciasFiltradas);
      } else {
        // Si no hay datos, establecer el estado como un array vacío
        setSugerencias([]);
      }
      setLoading(false); // Finalizar la carga
    }, (error) => {
      console.error("Error al obtener las sugerencias:", error); // Manejo de errores
      setLoading(false); // Finalizar la carga incluso si hay un error
    });
  }, [filtro]); // El efecto se ejecuta cuando cambia el filtro

  // Función para aplicar el filtro seleccionado
  const aplicarFiltro = (sugerenciasArray, filtro) => {
    let sugerenciasFiltradas = [...sugerenciasArray]; // Crear una copia del array original

    switch (filtro) {
      case "masActual":
        sugerenciasFiltradas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Más actual primero
        break;
      case "masAntigua":
        sugerenciasFiltradas.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Más antigua primero
        break;
      default:
        break;
    }

    return sugerenciasFiltradas;
  };

  // Formatear la fecha y hora
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = new Date(timestamp); // Convertir la cadena a un objeto Date
    return date.toLocaleString(); // Formato legible (fecha y hora local)
  };

  // Renderizar cada sugerencia
  const renderSugerencia = ({ item }) => (
    <View style={styles.sugerenciaItem}>
      <Text style={styles.sugerenciaText}>Sugerencia: {item.message}</Text> {/* Usar `message` */}
      <Text style={styles.sugerenciaText}>Fecha y Hora: {formatDateTime(item.timestamp)}</Text>
    </View>
  );

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7B68EE" /> {/* Morado más opaco */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de filtro */}
      <TouchableOpacity style={styles.filtroButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="filter" size={24} color="#7B68EE" /> {/* Morado más opaco */}
      </TouchableOpacity>

      {/* Modal de filtros */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por:</Text>
            <TouchableOpacity onPress={() => { setFiltro("masActual"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Más actual primero</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFiltro("masAntigua"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Más antigua primero</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Buzón de Sugerencias</Text>
      {sugerencias.length > 0 ? (
        <FlatList
          data={sugerencias}
          renderItem={renderSugerencia}
          keyExtractor={(item) => item.id} // Usar el ID único de Firebase como clave
          contentContainerStyle={styles.sugerenciasList}
        />
      ) : (
        <Text style={styles.noSugerenciasText}>No hay sugerencias registradas.</Text>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 16,
  },
  title: {
    color: '#7B68EE', // Morado más opaco
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sugerenciasList: {
    paddingBottom: 20,
  },
  sugerenciaItem: {
    backgroundColor: '#2E2E2E', // Fondo gris oscuro
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#7B68EE', // Borde morado
    borderWidth: 1,
  },
  sugerenciaText: {
    color: '#FFF', // Texto blanco
    fontSize: 14,
    marginBottom: 5,
  },
  noSugerenciasText: {
    color: '#7B68EE', // Morado más opaco
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  filtroButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semitransparente
  },
  modalContent: {
    backgroundColor: '#2E2E2E', // Fondo gris oscuro
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderColor: '#7B68EE', // Borde morado
    borderWidth: 1,
  },
  modalTitle: {
    color: '#7B68EE', // Morado más opaco
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    color: '#FFF', // Texto blanco
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default BuzonSugerencias;