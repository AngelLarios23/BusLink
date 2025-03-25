import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, push } from 'firebase/database'; // Para Realtime Database
import { database } from './firebaseConfig'; // Importa la configuración de Firebase

const Sugerencias = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy Chofi, tu asistente virtual de YoVoy. ¿Qué sugerencia tienes para mejorar nuestro servicio?", sender: 'bot' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Función para guardar la sugerencia en Firebase
  const saveSuggestion = async (message) => {
    try {
      const suggestionData = {
        message: message,
        timestamp: new Date().toISOString(),
      };

      // Guardar en Realtime Database
      const suggestionsRef = ref(database, 'suggestions');
      await push(suggestionsRef, suggestionData);

      // Respuesta de Chofi
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Gracias por hacer la sugerencia, tu opinión es muy importante para mejorar.", sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error al guardar la sugerencia:', error);
      Alert.alert('Error', 'No se pudo enviar la sugerencia. Inténtalo de nuevo.');
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleSendSuggestion = () => {
    if (userMessage.trim() === '') {
      Alert.alert('Error', 'Por favor, escribe tu sugerencia.');
      return;
    }

    // Agrega el mensaje del usuario al chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: 'user' },
    ]);
    setUserMessage('');

    // Simula que Chofi está escribiendo
    setIsBotTyping(true);

    // Guarda la sugerencia en Firebase
    saveSuggestion(userMessage);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={24} color="white" />
        <Text style={styles.headerText}>Sugerencias</Text>
      </View>

      {/* Chatbox */}
      <ScrollView
        style={styles.chatbox}
        ref={chatEndRef}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        {isBotTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Chofi está escribiendo...</Text>
          </View>
        )}
      </ScrollView>

      {/* Campo de texto para escribir la sugerencia */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu sugerencia aquí..."
          placeholderTextColor="#888"
          value={userMessage}
          onChangeText={setUserMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendSuggestion}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Estilos actualizados con colores negro y azul
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#023265', // Azul oscuro
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  chatbox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
  },
  chatContent: {
    paddingBottom: 80,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#023265', // Azul oscuro para mensajes del usuario
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#1a1a1a', // Fondo gris oscuro para mensajes del bot
    borderColor: '#023265', // Borde azul oscuro
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white', // Texto blanco
    fontSize: 16,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  typingText: {
    color: '#ccc', // Texto gris claro
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#023265', // Borde azul oscuro
  },
  input: {
    flex: 1,
    backgroundColor: '#333', // Fondo gris más oscuro
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    maxHeight: 100,
    textAlignVertical: 'top',
    color: 'white', // Texto blanco
  },
  sendButton: {
    backgroundColor: '#023265', // Azul oscuro
    padding: 10,
    borderRadius: 10,
  },
});

export default Sugerencias;