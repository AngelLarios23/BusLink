import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from './firebaseConfig'; // Asegúrate de que la ruta de importación sea correcta
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar íconos

const AnalisisReportes = () => {
  const [reportes, setReportes] = useState([]); // Estado para almacenar los reportes
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar/ocultar el modal de filtros
  const [filtro, setFiltro] = useState("ruta"); // Estado para almacenar el filtro seleccionado

  // Listas de palabras clave para el análisis de sentimientos
  const palabrasPositivas = [
    "bueno", "excelente", "genial", "feliz", "contento", "satisfecho", "maravilloso", "agradable", "perfecto", "increíble",
    "rápido", "amable", "gentil", "educado", "buen", "bien", "capacitado", "puntual", "eficiente", "organizado",
    "limpio", "fresco", "moderno", "cómodo", "seguro", "atento", "respetuoso"
  ];

  const palabrasNegativas = [
    "malo", "terrible", "horrible", "triste", "enojado", "frustrado", "molesto", "feo", "huele", "cola", "pésimo", "desagradable",
    "sobaco", "axila", "patas", "colgada", "culero", "chingada", "chingadera", "sucio", "asqueroso", "cochino", "podrido", "basura",
    "grosero", "maleducado", "irrespetuoso", "desconsiderado", "abusivo", "tarde", "retrasado", "ineficiente", "lento", "desorganizado",
    "viejo", "destartalado", "roto", "descompuesto", "inseguro", "incómodo", "pinche", "mierda", "cagada"
  ];

  // Lista de stopwords en español
  const stopwords = [
    "de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "por", "un", "para", "con", "no", "una", "su", "al", "es", "lo", "como", "más", "pero", "sus", "le", "ya", "o", "fue", "este", "ha", "sí", "porque", "esta", "son", "entre", "está", "cuando", "muy", "sin", "sobre", "ser", "tiene", "también", "me", "hasta", "hay", "donde", "quien", "desde", "todo", "nos", "durante", "estados", "todos", "uno", "les", "ni", "contra", "otros", "fueron", "ese", "eso", "ante", "ellos", "e", "esto", "mí", "antes", "algunos", "qué", "unos", "yo", "otro", "otras", "otra", "él", "tanto", "esa", "estos", "mucho", "quienes", "nada", "muchos", "cual", "sea", "poco", "ella", "estar", "había", "estas", "estaba", "estamos", "algunas", "algo", "nosotros"
  ];

  // Función para eliminar stopwords de un mensaje
  const eliminarStopwords = (mensaje) => {
    return mensaje
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Eliminar signos de puntuación
      .split(" ") // Dividir el mensaje en palabras
      .filter((palabra) => !stopwords.includes(palabra)) // Eliminar stopwords
      .join(" "); // Unir las palabras restantes
  };

  // Función para analizar el sentimiento del mensaje
  const analizarSentimiento = (mensaje) => {
    if (!mensaje) return "neutral"; // Si no hay mensaje, devolver neutral

    const mensajeLimpio = eliminarStopwords(mensaje); // Eliminar stopwords
    const palabras = mensajeLimpio.split(" "); // Dividir el mensaje en palabras
    let puntaje = 0;

    // Contar palabras positivas y negativas
    palabras.forEach((palabra) => {
      if (palabrasPositivas.includes(palabra)) {
        puntaje += 1;
      } else if (palabrasNegativas.includes(palabra)) {
        puntaje -= 1;
      }
    });

    // Determinar el sentimiento basado en el puntaje
    if (puntaje > 0) {
      return "positivo";
    } else if (puntaje < 0) {
      return "negativo";
    } else {
      return "neutral";
    }
  };

  // Obtener los reportes de Firebase
  useEffect(() => {
    const reportesRef = ref(database, 'reports'); // Ruta correcta: 'reports'
    console.log("Ruta de Firebase:", reportesRef.toString()); // Depuración: Verifica la ruta

    onValue(reportesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Datos obtenidos de Firebase:", data); // Depuración: Verifica qué datos se están obteniendo

      if (data) {
        // Convertir el objeto de reportes en un array
        const reportesArray = Object.keys(data).map((key) => ({
          id: key, // Usar el ID único de Firebase como clave
          ...data[key], // Copiar el resto de los datos del reporte
          sentimiento: analizarSentimiento(data[key].message), // Agregar el sentimiento al reporte
        }));

        console.log("Reportes antes de ordenar:", reportesArray); // Depuración: Verifica los datos antes de ordenar

        // Aplicar el filtro seleccionado
        const reportesFiltrados = aplicarFiltro(reportesArray, filtro);

        // Actualizar el estado con los reportes filtrados y ordenados
        setReportes(reportesFiltrados);
      } else {
        // Si no hay datos, establecer el estado como un array vacío
        setReportes([]);
      }
      setLoading(false); // Finalizar la carga
    }, (error) => {
      console.error("Error al obtener los reportes:", error); // Manejo de errores
      setLoading(false); // Finalizar la carga incluso si hay un error
    });
  }, [filtro]); // El efecto se ejecuta cuando cambia el filtro

  // Función para aplicar el filtro seleccionado
  const aplicarFiltro = (reportesArray, filtro) => {
    let reportesFiltrados = [...reportesArray]; // Crear una copia del array original

    switch (filtro) {
      case "ruta":
        reportesFiltrados.sort((a, b) => (a.route || "").localeCompare(b.route || ""));
        break;
      case "positivos":
        reportesFiltrados = reportesFiltrados.filter((item) => item.sentimiento === "positivo");
        break;
      case "negativos":
        reportesFiltrados = reportesFiltrados.filter((item) => item.sentimiento === "negativo");
        break;
      case "neutrales":
        reportesFiltrados = reportesFiltrados.filter((item) => item.sentimiento === "neutral");
        break;
      case "masViejo":
        reportesFiltrados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case "masActual":
        reportesFiltrados.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      default:
        break;
    }

    return reportesFiltrados;
  };

  // Formatear la fecha y hora
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = new Date(timestamp); // Convertir la cadena a un objeto Date
    return date.toLocaleString(); // Formato legible (fecha y hora local)
  };

  // Renderizar cada reporte
  const renderReporte = ({ item }) => (
    <View style={styles.reporteItem}>
      <Text style={styles.reporteText}>Ruta: {item.route}</Text> {/* Usar `route` */}
      <Text style={styles.reporteText}>Descripción: {item.message}</Text> {/* Usar `message` */}
      <Text style={styles.reporteText}>Fecha y Hora: {formatDateTime(item.timestamp)}</Text>
      <Text style={[
        styles.reporteText,
        item.sentimiento === "positivo" && styles.sentimientoPositivo,
        item.sentimiento === "negativo" && styles.sentimientoNegativo,
        item.sentimiento === "neutral" && styles.sentimientoNeutral,
      ]}>
        Sentimiento: {item.sentimiento}
      </Text>
    </View>
  );

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#806480" /> {/* Cambiado a morado cenizo */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de filtro */}
      <TouchableOpacity style={styles.filtroButton} onPress={() => setModalVisible(true)}>
        <Icon name="filter-list" size={30} color="#806480" /> {/* Cambiado a morado cenizo */}
      </TouchableOpacity>

      {/* Modal de filtros */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por:</Text>
            <TouchableOpacity onPress={() => { setFiltro("ruta"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Ruta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFiltro("positivos"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Solo positivos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFiltro("negativos"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Solo negativos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFiltro("neutrales"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Solo neutrales</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFiltro("masViejo"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Más viejo al más actual</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFiltro("masActual"); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Más actual al más viejo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Reportes Ordenados por {filtro}</Text>
      {reportes.length > 0 ? (
        <FlatList
          data={reportes}
          renderItem={renderReporte}
          keyExtractor={(item) => item.id} // Usar el ID único de Firebase como clave
          contentContainerStyle={styles.reportesList}
        />
      ) : (
        <Text style={styles.noReportesText}>No hay reportes registrados.</Text>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    padding: 16,
  },
  title: {
    color: '#806480', // Morado cenizo
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reportesList: {
    paddingBottom: 20,
  },
  reporteItem: {
    backgroundColor: '#1a1a1a', // Un tono más claro de negro para los elementos
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reporteText: {
    color: '#fff', // Texto blanco para contraste
    fontSize: 14,
    marginBottom: 5,
  },
  noReportesText: {
    color: '#806480', // Morado cenizo
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  sentimientoPositivo: {
    color: '#4CAF50', // Verde para sentimiento positivo
  },
  sentimientoNegativo: {
    color: '#F44336', // Rojo para sentimiento negativo
  },
  sentimientoNeutral: {
    color: '#FFEB3B', // Amarillo para sentimiento neutral
  },
  filtroButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: '#1a1a1a', // Un tono más claro de negro para el modal
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#806480', // Morado cenizo
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    color: '#fff', // Texto blanco para contraste
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default AnalisisReportes;