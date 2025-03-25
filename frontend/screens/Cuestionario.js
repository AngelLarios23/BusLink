import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Cuestionario = () => {
  // Estado para almacenar las respuestas
  const [answers, setAnswers] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
  });

  // Preguntas del cuestionario
  const questions = [
    "¿Has notado que las rutas tienen un movimiento más rápido?",
    "¿Ha cambiado para bien el servicio de los conductores en las rutas?",
    "¿Las rutas van con un número de personas menor o igual al de su capacidad?",
    "¿Has tenido una buena experiencia en nuestra aplicación?",
    "¿Todas las áreas de la aplicación funcionan correctamente para ti?",
    "¿Es de utilidad la ayuda que se te ofrece dentro de la aplicación?",
    "¿Utilizas la sección del mapa en la pantalla principal?",
    "¿La aplicación es más fácil de utilizar que otras?",
  ];

  // Función para manejar la selección de respuesta
  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  // Función para enviar el cuestionario
  const handleSubmit = () => {
    // Verifica si todas las preguntas han sido respondidas
    const allAnswered = Object.values(answers).every((answer) => answer !== null);
    if (!allAnswered) {
      Alert.alert('Error', 'Por favor, responde todas las preguntas.');
      return;
    }

    // Aquí puedes agregar la lógica para enviar las respuestas a un servidor o almacenarlas localmente
    Alert.alert(
      'Gracias',
      'Gracias por tus opiniones, tratamos de mejorar para ti cada día.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reinicia el cuestionario
            setAnswers({
              1: null,
              2: null,
              3: null,
              4: null,
              5: null,
              6: null,
              7: null,
              8: null,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={24} color="white" />
        <Text style={styles.headerText}>Cuestionario</Text>
      </View>

      {/* Lista de preguntas */}
      <ScrollView contentContainerStyle={styles.questionsContainer}>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.answerButtons}>
              <TouchableOpacity
                style={[
                  styles.answerButton,
                  answers[index + 1] === true && styles.selectedButton,
                ]}
                onPress={() => handleAnswer(index + 1, true)}
              >
                <Text style={styles.answerText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.answerButton,
                  answers[index + 1] === false && styles.selectedButton,
                ]}
                onPress={() => handleAnswer(index + 1, false)}
              >
                <Text style={styles.answerText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón de enviar */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
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
  questionsContainer: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#fff', // Texto blanco
    marginBottom: 10,
    fontWeight: '500',
  },
  answerButtons: {
    flexDirection: 'row',
  },
  answerButton: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#023265', // Azul oscuro para botón seleccionado
  },
  answerText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#023265', // Azul oscuro
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    margin: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Cuestionario;