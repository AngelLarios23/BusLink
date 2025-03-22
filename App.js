import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';
import Home from './screens/Home';
import Registro from './screens/Registro';

export default function App() {

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} 
      options={{
        title: "LOGIN",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"},
      }} />
      <Stack.Screen name="Home" component={Home} 
      options={{
        title: "HOME",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"}
      }} />
      <Stack.Screen name="Registro" component={Registro } 
      options={{
        title: "REGISTER",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"},
      }} />
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
