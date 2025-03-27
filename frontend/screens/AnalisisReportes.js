import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal,
  RefreshControl
} from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ANALISIS_CONFIG = {
  palabrasPositivas: ["bueno", "excelente", "genial", "puntual", "rápido", "cómodo", "limpio"],
  palabrasNegativas: ["malo", "terrible", "horrible", "tarde", "sucio", "lento", "incomodo"],
  stopwords: ["de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "por", "un", "para"]
};

const AnalisisReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState('recientes');
  const [showFilters, setShowFilters] = useState(false);

  const analizarSentimiento = useCallback((texto = '') => {
    const palabras = texto.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(palabra => 
        palabra.length > 2 && 
        !ANALISIS_CONFIG.stopwords.includes(palabra)
      );
    
    let puntaje = 0;
    palabras.forEach(palabra => {
      if (ANALISIS_CONFIG.palabrasPositivas.includes(palabra)) puntaje++;
      if (ANALISIS_CONFIG.palabrasNegativas.includes(palabra)) puntaje--;
    });

    const exclamacionesPositivas = (texto.match(/!+/g) || []).length;
    const exclamacionesNegativas = (texto.match(/¡+/g) || []).length;
    
    puntaje += exclamacionesPositivas * 0.5;
    puntaje -= exclamacionesNegativas * 0.5;

    return puntaje > 1 ? 'positivo' : puntaje < -1 ? 'negativo' : 'neutral';
  }, []);

  const fetchReportes = useCallback(() => {
    const reportsRef = ref(db, 'reports');
    setLoading(true);

    const unsubscribe = onValue(reportsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) {
          setReportes([]);
          return;
        }

        const reportesArray = Object.entries(data).map(([id, report]) => ({
          id,
          ...report,
          sentimiento: analizarSentimiento(report.message),
          fecha: report.timestamp ? new Date(report.timestamp).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Sin fecha'
        }));

        setReportes(reportesArray);
      } catch (error) {
        console.error("Error procesando datos:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    });

    return () => off(reportsRef, 'value', unsubscribe);
  }, [analizarSentimiento]);

  useEffect(() => {
    const unsubscribe = fetchReportes();
    return unsubscribe;
  }, [fetchReportes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportes();
  };

  const reportesFiltrados = useMemo(() => {
    const copia = [...reportes];
    switch (filtro) {
      case 'recientes': 
        return copia.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      case 'antiguos':
        return copia.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      case 'positivos':
        return copia.filter(r => r.sentimiento === 'positivo');
      case 'negativos':
        return copia.filter(r => r.sentimiento === 'negativo');
      default:
        return copia;
    }
  }, [reportes, filtro]);

  const ReporteItem = React.memo(({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.ruta}>{item.route}</Text>
        <Text style={[
          styles.sentimiento,
          item.sentimiento === 'positivo' && styles.positivo,
          item.sentimiento === 'negativo' && styles.negativo
        ]}>
          {item.sentimiento.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.mensaje}>{item.message}</Text>
      <View style={styles.footer}>
        <Text style={styles.usuario}>{item.usuarioEmail}</Text>
        <Text style={styles.fecha}>{item.fecha}</Text>
      </View>
    </View>
  ));

  if (loading && !refreshing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#806480" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Análisis de Reportes</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Icon name="filter-list" size={28} color="#806480" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reportesFiltrados}
        renderItem={({ item }) => <ReporteItem item={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay reportes disponibles</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#806480']}
            tintColor="#806480"
          />
        }
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <Modal visible={showFilters} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por:</Text>
            {['recientes', 'antiguos', 'positivos', 'negativos'].map(opcion => (
              <TouchableOpacity 
                key={opcion} 
                style={styles.filterOption}
                onPress={() => {
                  setFiltro(opcion);
                  setShowFilters(false);
                }}
              >
                <Text style={styles.filterText}>{opcion.charAt(0).toUpperCase() + opcion.slice(1)}</Text>
                {filtro === opcion && <Icon name="check" size={20} color="#806480" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#806480',
    backgroundColor: '#121212'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  title: {
    color: '#806480',
    fontSize: 20,
    fontWeight: 'bold'
  },
  listContent: {
    paddingBottom: 20
  },
  item: {
    padding: 16,
    margin: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2D2D2D'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  ruta: {
    color: '#806480',
    fontWeight: 'bold',
    fontSize: 16
  },
  mensaje: {
    color: '#FFF',
    marginVertical: 8,
    lineHeight: 22
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  usuario: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic'
  },
  fecha: {
    color: '#888',
    fontSize: 12
  },
  sentimiento: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden'
  },
  positivo: {
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  negativo: {
    color: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalTitle: {
    color: '#806480',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D'
  },
  filterText: {
    color: '#FFF'
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#806480',
    borderRadius: 5,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16
  }
});

export default React.memo(AnalisisReportes);