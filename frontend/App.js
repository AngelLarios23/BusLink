import 'react-native-gesture-handler'; 
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';
import Home from './screens/Home';
import Registro from './screens/Registro';
import Payment from './screens/Payment';
import BalanceScreen from './screens/BalanceScreen'
import Chats from './screens/Chats'
import Reportes from './screens/Reportes'
import Sugerencias from './screens/Sugerencias'
import Cuestionario from './screens/Cuestionario'
import Chatbot from './screens/Chatbot'
import Calificaciones from './screens/Calificaciones'




import Administrador from './screens/Administrador'

export default function App() {

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      {/*
      <Stack.Screen name="Login" component={Login} 
      options={{
        title: "LOGIN",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"},
      }} />
       */}
      <Stack.Screen name="Home" component={Home}  />
      <Stack.Screen name="Registro" component={Registro } 
      options={{
        title: "REGISTER",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"},
      }} />
      <Stack.Screen name='Payment' component={Payment}></Stack.Screen>
      <Stack.Screen name="BalanceScreen" component={BalanceScreen} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Reportes" component={Reportes} />
      <Stack.Screen name="Sugerencias" component={Sugerencias} />
      <Stack.Screen name="Cuestionario" component={Cuestionario} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
      <Stack.Screen name="Calificaciones" component={Calificaciones} />
      <Stack.Screen name="Administrador" component={Administrador} />


    </Stack.Navigator>
  );
}

  return (
     <NavigationContainer>
      <MyStack/>
     </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
