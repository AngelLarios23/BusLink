import * as React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Home(props) {
  
  return (
    <LinearGradient colors={['#1E1E1E', '#333333']} style={styles .container}>
      <StatusBar style="light" />
      {/* Barra superior con perfil y saldo */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.profileButton} onPress={() => alert('Perfil')}>
          <Ionicons name="person-circle-outline" size={40} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.balanceButton} onPress={() => alert('Saldo: $500')}>
          <Text style={styles.balanceText}>💰 $500</Text>
        </TouchableOpacity>
      </View>

      {/* Mapa en el centro con funcionalidad de botón */}
      <View style={styles.mapContainer}>
  <MapView 
    style={styles.map} 
    onPress={() => alert('Mapa presionado')} 
  />
   </View>

      {/* Barra inferior con botones */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.smallButton} onPress={() => props.navigation.navigate('Diseno')}>

          <MaterialIcons name="route" size={30} color="white" />
          <Text style={styles.buttonText}>Rutas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigButton} onPress={() => props.navigation.navigate('Payment')}>
          <Ionicons name="cash-outline" size={45} color="white" />
          <Text style={styles.bigButtonText}>Pagos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={() => alert('Comunidad')}>
          <MaterialIcons name="group" size={30} color="white" />
          <Text style={styles.buttonText}>Comunidad</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: '5%',
    left: width * 0.05,
    right: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  profileButton: {
    padding: 5,
  },
  balanceButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  balanceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Contenedor del mapa con funcionalidad de botón
  mapContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.1,
  },

  // Estilos del mapa ajustados dinámicamente
  map: {
    width: '110%',
    height: '72%', // Ajuste proporcional
    borderRadius: 20,
    overflow: 'hidden',
  },

  bottomBar: {
    position: 'absolute',
    bottom: height * 0.02,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  smallButton: {
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    width: width * 0.25,
    height: width * 0.25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  bigButton: {
    backgroundColor: '#FF5722',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  bigButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});