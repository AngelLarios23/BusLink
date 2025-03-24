import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Chats = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats y Soporte</Text>
      </View>

      {/* Lista de opciones */}
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {/* Botón 1: Quejas */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Reportes')}
        >
          <Ionicons name="sad-outline" size={24} color="#FF6B6B" />
          <Text style={styles.optionText}>Hacer un reporte</Text>
        </TouchableOpacity>

        {/* Botón 2: Sugerencias */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Sugerencias')}
        >
          <Ionicons name="bulb-outline" size={24} color="#4ECDC4" />
          <Text style={styles.optionText}>Enviar una sugerencia</Text>
        </TouchableOpacity>

        {/* Botón 3: Reportes */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <Ionicons name="alert-circle-outline" size={24} color="#FFD166" />
          <Text style={styles.optionText}>Chofi a tus ordenes</Text>
        </TouchableOpacity>

        {/* Botón 4: Cuestionarios */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Cuestionario')}
        >
          <Ionicons name="document-text-outline" size={24} color="#6B5B95" />
          <Text style={styles.optionText}>Completar cuestionario</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Estilos actualizados con colores naranja y negro
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
  },
  header: {
    backgroundColor: '#FFA500', // Naranja
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    padding: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#fff', // Texto blanco
    fontWeight: '500',
  },
});

export default Chats;