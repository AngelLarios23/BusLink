import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';

export default function Registro() {
  return (
    <View style={styles.container}>
      <Text>Este es el registro</Text>
      <Image source={require('../assets/perfil.png')} style={styles.profile}></Image>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile:{
    borderRadius:100,
    width:100,
    height:100
  }
});
