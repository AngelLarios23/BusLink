import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import appFirebase from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(appFirebase);

export default function Registro(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

 
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.padre}>
                <View style={styles.tarjeta}>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Nombres' style={{ paddingHorizontal: 15 }} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Apellido Paterno' style={{ paddingHorizontal: 15 }} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Apellido Materno' style={{ paddingHorizontal: 15 }} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Fecha de Nacimiento' style={{ paddingHorizontal: 15 }} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='CURP' style={{ paddingHorizontal: 15 }} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Folio de la Tarjeta' style={{ paddingHorizontal: 15 }} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='correo@gmail.com' style={{ paddingHorizontal: 15 }}
                            onChangeText={(text) => setEmail(text)} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Contraseña' style={{ paddingHorizontal: 15 }}
                            onChangeText={(text) => setPassword(text)} secureTextEntry={true} />
                    </View>

                    <View style={styles.PadreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={() => props.navigation.navigate('')}>
                            <Text style={styles.TextoBoton}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
    },
    tarjeta: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cajaTexto: {
        paddingVertical: 20,
        backgroundColor: '#cccccc40',
        borderRadius: 30,
        marginVertical: 10,
        height: 80,
    },
    PadreBoton: {
        alignItems: 'center',
    },
    cajaBoton: {
        backgroundColor: '#525FE1',
        borderRadius: 30,
        paddingVertical: 20,
        width: 150,
        marginTop: 20,
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
    }
});