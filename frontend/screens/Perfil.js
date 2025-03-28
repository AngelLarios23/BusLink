import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import appFirebase from '../credenciales';
import { getAuth } from 'firebase/auth';

const db = getDatabase(appFirebase);
const auth = getAuth(appFirebase);

export default function PerfilUsuario(props) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        
        if (user) {
            const userRef = ref(db, 'users/' + user.uid);
            
            const unsubscribe = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setUserData(data);
                setLoading(false);
            }, (error) => {
                console.error(error);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            props.navigation.navigate('Login');
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#525FE1" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Perfil de Usuario</Text>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Nombres:</Text>
                    <Text style={styles.info}>{userData?.name || 'No disponible'}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Apellido Paterno:</Text>
                    <Text style={styles.info}>{userData?.apepat || 'No disponible'}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Apellido Materno:</Text>
                    <Text style={styles.info}>{userData?.apemat || 'No disponible'}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Fecha de Nacimiento:</Text>
                    <Text style={styles.info}>{userData?.fecnac || 'No disponible'}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>CURP:</Text>
                    <Text style={styles.info}>{userData?.curp || 'No disponible'}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Folio de Tarjeta:</Text>
                    <Text style={styles.info}>{userData?.folio || 'No disponible'}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Correo Electrónico:</Text>
                    <Text style={styles.info}>{userData?.email || 'No disponible'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#525FE1',
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        color: '#666',
    },
});