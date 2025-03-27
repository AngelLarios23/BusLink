import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 1. Configuración inicial de Firebase (debe ir primero)
import { app, auth, db } from './firebaseConfig';
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native core'
]);

// 3. Importar pantallas
import Login from './screens/Login';
import Home from './screens/Home';
import Registro from './screens/Registro';
import Payment from './screens/Payment';
import BalanceScreen from './screens/BalanceScreen';
import Chats from './screens/Chats';
import Reportes from './screens/Reportes';
import Sugerencias from './screens/Sugerencias';
import Cuestionario from './screens/Cuestionario';
import Chatbot from './screens/Chatbot';
import Calificaciones from './screens/Calificaciones';
import Administrador from './screens/Administrador';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#525FE1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ 
          title: 'INICIAR SESIÓN',
          headerLeft: () => null // Elimina el botón de retroceso
        }}
      />
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{ 
          headerShown: false,
          gestureEnabled: false // Deshabilita el gesto de retroceso
        }}
      />
      <Stack.Screen name="Registro" component={Registro} options={{ title: 'REGISTRO' }} />
      <Stack.Screen name="Payment" component={Payment} options={{ title: 'PAGOS' }} />
      <Stack.Screen name="BalanceScreen" component={BalanceScreen} options={{ title: 'SALDO' }} />
      <Stack.Screen name="Chats" component={Chats} options={{ title: 'CHATS' }} />
      <Stack.Screen name="Reportes" component={Reportes} options={{ title: 'REPORTES' }} />
      <Stack.Screen name="Sugerencias" component={Sugerencias} options={{ title: 'SUGERENCIAS' }} />
      <Stack.Screen name="Cuestionario" component={Cuestionario} options={{ title: 'CUESTIONARIO' }} />
      <Stack.Screen name="Chatbot" component={Chatbot} options={{ title: 'ASISTENTE' }} />
      <Stack.Screen name="Calificaciones" component={Calificaciones} options={{ title: 'CALIFICACIONES' }} />
      <Stack.Screen name="Administrador" component={Administrador} options={{ title: 'ADMINISTRADOR' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// Exporta las instancias de Firebase para usar en otros componentes
export { app, auth, db };