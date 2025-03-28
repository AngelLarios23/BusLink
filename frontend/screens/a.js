import * as React from 'react';
import { auth } from '../firebaseConfig';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Home(props) {
  const { saldo, pasajes } = props.route.params || { saldo: 0, pasajes: 0 };
  const [showPinModal, setShowPinModal] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const correctPin = '1234'; // Cambia esto por tu PIN real

  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  // Obtener la ubicación del usuario
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const verifyPin = () => {
    if (!auth) {
      Alert.alert('Error', 'Error de configuración. Intente nuevamente.');
      return;
    }

    if (pin === correctPin) {
      setShowPinModal(false);
      setPin('');
      props.navigation.navigate('Administrador');
    } else {
      Alert.alert('Error', 'PIN incorrecto');
      setPin('');
    }
  };

  const perfil = async () => {
    try {
      props.navigation.navigate('Perfil');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se puede acceder al perfil');
    }
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#333333']} style={styles.container}>
      <StatusBar style="light" />

      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.profileButton} onPress={perfil}>
          <Ionicons name="person-circle-outline" size={40} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.balanceButton} onPress={() => props.navigation.navigate('BalanceScreen')}>
          <Text style={styles.balanceText}>💰. ${saldo} - {pasajes} pasajes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpButton} onPress={() => setShowPinModal(true)}>
          <Ionicons name="help-circle-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Mapa con ubicación del usuario */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: location ? location.latitude : 20.6597,
            longitude: location ? location.longitude : -103.3496,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {location && (
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Tu ubicación"
              description="Aquí estás ahora"
            />
          )}
        </MapView>
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.smallButton} onPress={() => props.navigation.navigate('Rutas')}>
          <MaterialIcons name="route" size={30} color="white" />
          <Text style={styles.buttonText}>Rutas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigButton} onPress={() => props.navigation.navigate('Payment')}>
          <Ionicons name="cash-outline" size={45} color="white" />
          <Text style={styles.bigButtonText}>Pagos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={() => props.navigation.navigate('Chats')}>
          <MaterialIcons name="group" size={30} color="white" />
          <Text style={styles.buttonText}>Ayuda</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para el PIN */}
      <Modal visible={showPinModal} transparent={true} animationType="slide" onRequestClose={() => setShowPinModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ingrese PIN de administrador</Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              placeholder="PIN"
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowPinModal(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSubmit} onPress={verifyPin}>
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderColor: 'orange',
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
  helpButton: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.1,
  },
  map: {
    width: '110%',
    height: '72%',
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
  },
  bigButton: {
    backgroundColor: '#FF5722',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

