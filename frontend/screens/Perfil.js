import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';

export default function Perfil() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/perfil.png')} style={styles.perfilImage}></Image>
      <Text>Nombre de Usuario: </Text>
      <Text>Folio de Tarjeta: </Text>
      <Text>CURP: </Text>
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
  perfilImage:{
    height: 120,
    width: 120,
    borderRadius: 100
}
});
