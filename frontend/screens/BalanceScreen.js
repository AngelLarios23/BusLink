import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BalanceScreen(props) {
  const { saldo, pasajes } = props.route.params; // Obtener saldo y pasajes pasados por props

  return (
    <View style={styles.container}>
      <Text style={styles.saldoText}>Saldo disponible: ${saldo}</Text>
      <Text style={styles.pasajesText}>Pasajes disponibles: {pasajes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saldoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  pasajesText: {
    fontSize: 18,
    color: 'black',
  },
});
