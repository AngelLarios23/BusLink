import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Reportes = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userMessage, setUserMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateReport = (route, message) => {
    if (!route || !Number.isInteger(route) || route < 1 || route > 51) {
      throw new Error('La ruta seleccionada no es válida');
    }
    
    if (!message || message.trim().length < 10) {
      throw new Error('El mensaje debe tener al menos 10 caracteres');
    }
    
    return true;
  };

  const saveReport = async (route, message) => {
    setIsSubmitting(true);
    try {
      validateReport(route, message);
      
      const reportData = {
        route: `Ruta ${route}`,
        message: message.trim(),
        timestamp: serverTimestamp(),
        status: 'pending'
      };

      const reportsRef = ref(db, 'reports');
      await push(reportsRef, reportData);

      Alert.alert(
        'Reporte enviado',
        'Gracias por tu reporte. Tu opinión es muy importante para mejorar nuestro servicio.',
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
      console.error('Error saving report:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar el reporte. Inténtalo de nuevo más tarde.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRouteSelection = (route) => {
    setSelectedRoute(route);
    setShowMessageInput(true);
  };

  const handleSendReport = () => {
    if (!userMessage.trim()) {
      Alert.alert('Error', 'Por favor, escribe tu reporte antes de enviar.');
      return;
    }
    saveReport(selectedRoute, userMessage);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Reportes de Rutas</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.optionsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {Array.from({ length: 51 }, (_, i) => i + 1).map((route) => (
          <TouchableOpacity
            key={route}
            style={[
              styles.optionButton,
              selectedRoute === route && styles.selectedOption
            ]}
            onPress={() => handleRouteSelection(route)}
          >
            <Ionicons name="bus-outline" size={24} color="#806480" />
            <Text style={styles.optionText}>Ruta {route}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showMessageInput && (
        <View style={styles.messageContainer}>
          <Text style={styles.promptText}>
            Por favor, describe tu reporte sobre la Ruta {selectedRoute}:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: El autobús llegó 20 minutos tarde..."
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            value={userMessage}
            onChangeText={setUserMessage}
            editable={!isSubmitting}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowMessageInput(false);
                setSelectedRoute(null);
              }}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton, (!userMessage.trim() || isSubmitting) && styles.disabledButton]}
              onPress={handleSendReport}
              disabled={isSubmitting || !userMessage.trim()}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enviar Reporte</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#121212',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#806480',
  },
  headerText: {
    color: '#806480',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  selectedOption: {
    borderColor: '#806480',
    backgroundColor: '#252525',
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#806480',
  },
  promptText: {
    color: '#806480',
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 16,
    borderRadius: 8,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#2D2D2D',
  },
  submitButton: {
    backgroundColor: '#806480',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Reportes;