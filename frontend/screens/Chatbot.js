import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';

const truckIcon = require('../assets/truck-icon.png'); // Asegúrate de tener esta imagen en tu proyecto

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "¡Hola!! Soy Chofi, tu asistente virtual de YoVoy. ¿En qué puedo servirte?", sender: 'bot' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const handleMessageSelect = (message) => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    setIsBotTyping(true);

    // Animación de escritura
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(() => {
      let botResponse = "";

      switch (message) {
        case "¿Cómo funciona BusLink?":
          botResponse = "BusLink es una plataforma que te permite conocer todas las rutas y horarios de las unidades de transporte público. Así puedes planificar mejor tus viajes.";
          break;
        case "¿Cómo puedo recargar mi tarjeta YoVoy?":
          botResponse = "Para recargar tu tarjeta YoVoy, puedes hacerlo a través de la aplicación YoVoy o en puntos físicos autorizados.";
          break;
        case "¿Cómo puedo llegar a mi destino?":
          botResponse = "Puedes usar la función de BusLink para ver las rutas que te llevan a tu destino y elegir la opción más rápida y conveniente.";
          break;
        case "¿Dónde hago un reporte?":
          botResponse = "Puedes hacer reportes a través de nuestra página web o usando la aplicación YoVoy en la sección de 'Reportes'.";
          break;
        case "¿Cómo ayudo a que las rutas sean más eficientes?":
          botResponse = "Puedes ayudarnos sugiriendo mejoras en las rutas a través de la aplicación YoVoy. ¡Tu opinión cuenta!";
          break;
        default:
          botResponse = "Lo siento, no tengo información sobre eso. ¿Hay algo más en lo que pueda ayudarte?";
          break;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: 'bot' },
        { text: "¿Puedo ayudarte con algo más?", sender: 'bot' }
      ]);
      setIsBotTyping(false);
      Animated.timing(typingAnimation).stop(); // Detener la animación
    }, 4000);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const options = [
    "¿Cómo funciona BusLink?",
    "¿Cómo puedo recargar mi tarjeta YoVoy?",
    "¿Cómo puedo llegar a mi destino?",
    "¿Dónde hago un reporte?",
    "¿Cómo ayudo a que las rutas sean más eficientes?"
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={truckIcon} style={styles.truckIcon} />
        <Text style={styles.title}>Chofi tu asistente YoVoy</Text>
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
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        {isBotTyping && (
          <Animated.View
            style={[
              styles.typingIndicator,
              { opacity: typingAnimation }
            ]}
          >
            <Text style={styles.typingText}>Chofi está escribiendo...</Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Opciones de mensaje */}
      <View style={styles.optionContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleMessageSelect(option)}
            activeOpacity={0.7} // Efecto al presionar
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Estilos actualizados con colores negro y azul
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#023265', // Azul oscuro
    padding: 10,
    borderRadius: 10,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  truckIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: '#fff', // Texto blanco
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatbox: {
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    borderRadius: 10,
    width: '100%',
    marginTop: 70, // Espacio para el header fijo
    height: '75%', // Altura ajustada para el header y el espacio inferior
  },
  chatContent: {
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
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
    color: '#fff', // Texto blanco
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
  optionContainer: {
    padding: 10,
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    borderTopWidth: 1,
    borderTopColor: '#023265', // Borde azul oscuro
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#023265', // Azul oscuro para botones
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Chatbot;