import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, push } from 'firebase/database'; // Import Firebase Realtime Database functions
import { database } from './firebaseConfig'; // Import Firebase configuration

const Reportes = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userMessage, setUserMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  // Save report to Firebase
  const saveReport = async (route, message) => {
    try {
      const reportData = {
        route: `Ruta ${route}`,
        message: message,
        timestamp: new Date().toISOString(),
      };

      // Save to Realtime Database
      const reportsRef = ref(database, 'reports');
      await push(reportsRef, reportData);

      Alert.alert(
        'Reporte enviado',
        'Gracias por hacer el reporte, tu opinión es muy importante para mejorar.',
        [
          {
            text: 'OK',
            onPress: () => {
              setUserMessage('');
              setShowMessageInput(false);
              setSelectedRoute(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error al guardar el reporte:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar el reporte. Inténtalo de nuevo.'
      );
    }
  };

  const handleRouteSelection = (route) => {
    setSelectedRoute(route);
    setShowMessageInput(true);
  };

  const handleSendReport = () => {
    if (userMessage.trim() === '') {
      Alert.alert('Error', 'Por favor, escribe tu reporte.');
      return;
    }
    saveReport(selectedRoute, userMessage);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Reportes</Text>
      </View>

      {/* Route List */}
      <ScrollView
        contentContainerStyle={styles.optionsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {Array.from({ length: 51 }, (_, i) => i + 1).map((route) => (
          <TouchableOpacity
            key={route}
            style={styles.optionButton}
            onPress={() => handleRouteSelection(route)}
          >
            <Ionicons name="bus-outline" size={24} color="#075E54" />
            <Text style={styles.optionText}>Ruta {route}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Message Input */}
      {showMessageInput && (
        <View style={styles.messageContainer}>
          <Text style={styles.chofiMessage}>
            Chofi: ¿Cuál sería tu reporte acerca de la Ruta {selectedRoute}?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu reporte aquí..."
            placeholderTextColor="#888"
            multiline
            value={userMessage}
            onChangeText={setUserMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendReport}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

// Styles actualizados con colores negro y azul
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
  },
  header: {
    backgroundColor: '#023265', // Azul oscuro
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff', // Texto blanco
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
  messageContainer: {
    padding: 16,
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    borderTopWidth: 1,
    borderTopColor: '#023265', // Borde azul oscuro
  },
  chofiMessage: {
    fontSize: 16,
    color: '#fff', // Texto blanco
    marginBottom: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333', // Fondo gris más oscuro
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#023265', // Borde azul oscuro
    color: '#fff', // Texto blanco
    placeholderTextColor: '#888',
  },
  sendButton: {
    backgroundColor: '#023265', // Azul oscuro
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Reportes;