import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, push, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

const Calificaciones = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);

  // Obtener las calificaciones de Firebase
  useEffect(() => {
    const ratingsRef = ref(database, 'ratings');
    onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ratingsArray = Object.values(data);
        setRatings(ratingsArray);
      }
    });
  }, []);

  // Función para calcular los promedios
  const calculateAverages = () => {
    const averages = {};

    ratings.forEach((rating) => {
      const route = rating.route;
      const stars = rating.stars;

      if (!averages[route]) {
        averages[route] = { total: 0, count: 0 };
      }

      averages[route].total += stars;
      averages[route].count += 1;
    });

    // Calcular el promedio para cada ruta
    for (const route in averages) {
      averages[route].average = (averages[route].total / averages[route].count).toFixed(1);
    }

    return averages;
  };

  // Guardar la calificación en Firebase
  const saveRating = async (route, stars) => {
    try {
      const ratingData = {
        route: `Ruta ${route}`,
        stars: stars,
        timestamp: new Date().toISOString(),
      };

      const ratingsRef = ref(database, 'ratings');
      await push(ratingsRef, ratingData);

      Alert.alert(
        'Calificación enviada',
        'Gracias por calificar la ruta. Tu opinión es muy importante para mejorar.',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setShowRating(false);
              setSelectedRoute(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar la calificación. Inténtalo de nuevo.'
      );
    }
  };

  const handleRouteSelection = (route) => {
    setSelectedRoute(route);
    setShowRating(true);
  };

  const handleRatingSelection = (stars) => {
    setRating(stars);
    saveRating(selectedRoute, stars);
  };

  const averages = calculateAverages();

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Calificaciones</Text>
        {/* Botón de corbata */}
        <TouchableOpacity
          style={styles.tieButton}
          onPress={() => navigation.navigate('Administrador')} // Navegar a Admin
        >
          <Ionicons name="bowtie" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Lista de rutas */}
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {Array.from({ length: 51 }, (_, i) => i + 1).map((route) => {
          const routeKey = `Ruta ${route}`;
          const average = averages[routeKey]?.average || 'Sin calificaciones';

          return (
            <TouchableOpacity
              key={route}
              style={styles.optionButton}
              onPress={() => handleRouteSelection(route)}
            >
              <Ionicons name="bus-outline" size={24} color="#FFA500" />
              <Text style={styles.optionText}>Ruta {route}</Text>
              <Text style={styles.averageText}>{average} ⭐</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ventana de calificación con estrellas */}
      {showRating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            Califica la Ruta {selectedRoute}
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingSelection(star)}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFA500', // Naranja
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tieButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  averageText: {
    marginLeft: 'auto',
    fontSize: 16,
    color: '#FFD700', // Color dorado para las estrellas
    fontWeight: '500',
  },
  ratingContainer: {
    padding: 16,
    backgroundColor: '#1a1a1a', // Fondo gris oscuro
    borderTopWidth: 1,
    borderTopColor: '#FFA500', // Borde naranja
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#fff', // Texto blanco
    marginBottom: 16,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default Calificaciones;