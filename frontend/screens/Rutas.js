import React, { useState, useEffect, useRef } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Modal} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Rutas({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBusStops, setShowBusStops] = useState(false);
  const [busStops, setBusStops] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState({});
  const [followUser, setFollowUser] = useState(true);
  
  const mapRef = useRef(null);
  
  const busRoutes = [
    { id: '1', name: 'Ruta 1', color: '#FF5722', pathCoordinates: [] },
    { id: '2', name: 'Ruta 2', color: '#4CAF50', pathCoordinates: [] },
    { id: '3', name: 'Ruta 3', color: '#2196F3', pathCoordinates: [] },
    { id: '4', name: 'Ruta 4', color: '#9C27B0', pathCoordinates: [] },
    { id: '5', name: 'Ruta 5', color: '#FFC107', pathCoordinates: [] },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se requiere permiso para acceder a la ubicación');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        updateLocation(location);
      } catch (error) {
        setErrorMsg('Error al obtener la ubicación: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    generateBusStops(newLocation);
    if (followUser && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const centerOnLocation = async () => {
    try {
      setFollowUser(true);
      const newLocation = await Location.getCurrentPositionAsync({});
      updateLocation(newLocation);
    } catch (error) {
      setErrorMsg('Error al obtener la ubicación: ' + error.message);
    }
  };

  const generateBusStops = (location) => {
    if (!location) return;
    
    const stops = [];
    const routesWithPaths = busRoutes.map(route => ({
      ...route,
      pathCoordinates: []
    }));
    
    routesWithPaths.forEach(route => {
      let lastLat = location.coords.latitude;
      let lastLng = location.coords.longitude;
      
      for (let i = 1; i <= 5; i++) {
        const latOffset = (Math.random() - 0.3) * 0.02;
        const lngOffset = (Math.random() - 0.3) * 0.02;
        
        const newStop = {
          id: `${route.id}-${i}`,
          name: `Parada ${i} - ${route.name}`,
          routeId: route.id,
          routeName: route.name,
          routeColor: route.color,
          coordinate: {
            latitude: lastLat + latOffset,
            longitude: lastLng + lngOffset
          },
          schedule: [
            { time: '07:00', status: 'En tiempo' },
            { time: '08:30', status: 'En tiempo' },
            { time: '10:00', status: 'Retrasado' },
            { time: '11:30', status: 'En tiempo' },
            { time: '13:00', status: 'En tiempo' },
          ]
        };
        
        stops.push(newStop);
        route.pathCoordinates.push(newStop.coordinate);
        lastLat = newStop.coordinate.latitude;
        lastLng = newStop.coordinate.longitude;
      }
    });
    
    setBusStops(stops);
    setRouteCoordinates(routesWithPaths.reduce((acc, route) => {
      acc[route.id] = route.pathCoordinates;
      return acc;
    }, {}));
  };

  const showRouteStops = (routeId) => {
    setSelectedRoute(routeId);
    setShowBusStops(true);
  };

  const showStopDetails = (stop) => {
    setSelectedRoute(stop);
    setShowRouteDetails(true);
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: stop.coordinate.latitude,
        longitude: stop.coordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const renderRouteLines = () => {
    if (!showBusStops || !selectedRoute || !routeCoordinates[selectedRoute]) {
      return null;
    }
    
    const route = busRoutes.find(r => r.id === selectedRoute);
    
    return (
      <Polyline
        coordinates={routeCoordinates[selectedRoute]}
        strokeColor={route.color}
        strokeWidth={4}
        lineDashPattern={[10, 10]}
      />
    );
  };

  const renderBusStopMarkers = () => {
    if (!showBusStops) return null;
    
    const filteredStops = selectedRoute 
      ? busStops.filter(stop => stop.routeId === selectedRoute)
      : busStops;
    
    return filteredStops.map(stop => (
      <Marker
        key={stop.id}
        coordinate={stop.coordinate}
        title={stop.name}
        description={`Ruta: ${stop.routeName}`}
        onPress={() => showStopDetails(stop)}
      >
        <View style={[styles.busStopMarker, { backgroundColor: stop.routeColor }]}>
          <FontAwesome5 name="bus" size={16} color="white" />
        </View>
      </Marker>
    ));
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#333333']} style={styles.container}>
      <StatusBar style="light" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Rutas y Paradas</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
        </View>
      ) : (
        <>
          <View style={styles.mapContainer}>
            {location ? (
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Mi ubicación"
                  description="Estás aquí"
                >
                  <View style={styles.currentLocationMarker}>
                    <View style={styles.currentLocationDot} />
                  </View>
                </Marker>
                
                {renderRouteLines()}
                {renderBusStopMarkers()}
              </MapView>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg || "No se pudo obtener la ubicación"}</Text>
              </View>
            )}
            
            <View style={styles.mapButtonsContainer}>
              <TouchableOpacity 
                style={[styles.mapButton, followUser ? styles.mapButtonActive : null]}
                onPress={centerOnLocation}
              >
                <MaterialIcons 
                  name={followUser ? "my-location" : "location-searching"} 
                  size={24} 
                  color={followUser ? "white" : "#FFD700"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.mapButton, showBusStops ? styles.mapButtonActive : null]}
                onPress={() => setShowBusStops(!showBusStops)}
              >
                <FontAwesome5 
                  name="bus" 
                  size={20} 
                  color={showBusStops ? "white" : "#FFD700"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Lista de rutas */}
          <View style={styles.routesContainer}>
            <Text style={styles.routesTitle}>Rutas disponibles</Text>
            <FlatList
              data={busRoutes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.routeItem, 
                    { backgroundColor: item.color },
                    selectedRoute === item.id && styles.selectedRouteItem
                  ]}
                  onPress={() => showRouteStops(item.id)}
                >
                  <FontAwesome5 name="bus" size={20} color="white" />
                  <Text style={styles.routeItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.routesList}
            />
          </View>
          
         {/* Modal de detalles de parada */}
<Modal
  visible={showRouteDetails}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowRouteDetails(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {selectedRoute ? 
            (selectedRoute.name || `Parada de ${selectedRoute.routeName || 'ruta desconocida'}`) : 
            'Detalles de parada'}
        </Text>
        <TouchableOpacity onPress={() => setShowRouteDetails(false)}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {selectedRoute && (
        <>
          <View style={[styles.routeBadge, { backgroundColor: selectedRoute.routeColor || '#CCCCCC' }]}>
            <Text style={styles.routeBadgeText}>
              {selectedRoute.routeName || 'Ruta no especificada'}
            </Text>
          </View>
          
          <Text style={styles.scheduleTitle}>Horarios</Text>
          {selectedRoute.schedule ? (
            <FlatList
              data={selectedRoute.schedule}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleTime}>{item.time || '--:--'}</Text>
                  <Text style={[
                    styles.scheduleStatus,
                    item.status === 'Retrasado' ? styles.delayedStatus : styles.onTimeStatus
                  ]}>
                    {item.status || 'Sin información'}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noScheduleText}>No hay horarios disponibles</Text>
          )}
        </>
      )}
    </View>
  </View>
</Modal>
        </>
      )}
    </LinearGradient>
  );
}

// ... (los estilos permanecen igual)

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  titleContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    zIndex: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  mapContainer: {
    width: width,
    height: height * 0.6,
    marginTop: 80,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorText: {
    color: '#FF5722',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  mapButtonsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'column',
  },
  mapButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  mapButtonActive: {
    backgroundColor: '#1E88E5',
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  busStopMarker: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  routesContainer: {
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
  },
  routesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  routesList: {
    paddingVertical: 10,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  selectedRouteItem: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  routeItemText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  routeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  routeBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  onTimeStatus: {
    color: '#4CAF50',
  },
  delayedStatus: {
    color: '#FF5722',
  },
});


