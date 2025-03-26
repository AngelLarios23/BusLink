import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Administrador = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar el PIN
  const verifyPin = () => {
    if (pin === '123456') { // Cambia '123456' por el PIN que desees
      setIsAuthenticated(true);
    } else {
      Alert.alert('Error', 'PIN incorrecto. Inténtalo de nuevo.');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ingresa tu huella</Text>
        <TextInput
          style={styles.pinInput}
          placeholder="PIN"
          placeholderTextColor="#888"
          keyboardType="numeric"
          maxLength={6}
          secureTextEntry
          value={pin}
          onChangeText={setPin}
        />
        <TouchableOpacity style={styles.verifyButton} onPress={verifyPin}>
          <Text style={styles.verifyButtonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.adminContainer}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.halfWidth]}
          onPress={() => navigation.navigate('AnalisisReportes')} // Navegar a AnalisisReportes
        >
          <Ionicons name="document-text-outline" size={32} color="#6A5ACD" /> {/* Morado cenizo */}
          <Text style={styles.buttonText}>Reportes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.halfWidth]}
          onPress={() => navigation.navigate('Buzonsugerencias')}
        >
          <Ionicons name="bulb-outline" size={32} color="#6A5ACD" /> {/* Morado cenizo */}
          <Text style={styles.buttonText}>Sugerencias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles actualizados con colores negro y morado cenizo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#6A5ACD', // Texto morado cenizo
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pinInput: {
    backgroundColor: '#1A1A1A', // Fondo gris oscuro
    color: '#FFF', // Texto blanco
    fontSize: 18,
    padding: 10,
    borderRadius: 10,
    width: '80%',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6A5ACD', // Borde morado cenizo
  },
  verifyButton: {
    backgroundColor: '#6A5ACD', // Morado cenizo
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#FFF', // Texto blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminContainer: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1A1A1A', // Fondo gris oscuro
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6A5ACD', // Borde morado cenizo
  },
  halfWidth: {
    width: '48%',
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    color: '#6A5ACD', // Texto morado cenizo
    fontSize: 16,
    marginTop: 10,
  },
});

export default Administrador;