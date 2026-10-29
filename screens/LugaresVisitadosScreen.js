import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const CLAVE_STORAGE = 'lugares_visitados_v1';

export default function LugaresVisitadosScreen({ navigation, route }) {
  const [visitas, setVisitas] = useState([]);

  // Se ejecuta cada vez que la pantalla recibe el foco (al regresar de la cámara)
  useFocusEffect(
    useCallback(() => {
      cargarVisitas().then((actuales) => {
        if (route.params?.fotoUri && route.params?.timestamp) {
          const nueva = {
            id:      String(route.params.timestamp),
            fotoUri: route.params.fotoUri,
            lat:     route.params.lat,
            lng:     route.params.lng,
            fecha:   route.params.fecha,
          };
          const existe = actuales.find((v) => v.id === nueva.id);
          if (!existe) {
            const actualizadas = [nueva, ...actuales];
            persistir(actualizadas);
            setVisitas(actualizadas);
          }
          navigation.setParams({ fotoUri: undefined, timestamp: undefined });
        } else {
          setVisitas(actuales);
        }
      });
    }, [route.params?.timestamp])
  );

  const cargarVisitas = async () => {
    try {
      const json = await AsyncStorage.getItem(CLAVE_STORAGE);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Error al leer AsyncStorage:', e);
      return [];
    }
  };

  const persistir = async (datos) => {
    try {
      await AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
    } catch (e) {
      console.error('Error al guardar en AsyncStorage:', e);
    }
  };

  const borrarVisita = (id) => {
    Alert.alert('Borrar visita', '¿Eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar', style: 'destructive',
        onPress: () => {
          const filtradas = visitas.filter((v) => v.id !== id);
          setVisitas(filtradas);
          persistir(filtradas);
        },
      },
    ]);
  };

  const borrarTodo = () => {
    Alert.alert('Borrar todo', '¿Eliminar todas las visitas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar todo', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(CLAVE_STORAGE);
          setVisitas([]);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.fotoUri }} style={styles.foto} />
      <View style={styles.cardInfo}>
        {item.lat != null ? (
          <>
            <Text style={styles.coordsLabel}>Coordenadas GPS</Text>
            <Text style={styles.coords}>
              {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
            </Text>
          </>
        ) : (
          <Text style={styles.sinGps}>Sin coordenadas GPS</Text>
        )}
        <Text style={styles.fecha}>{item.fecha}</Text>
      </View>
      <TouchableOpacity
        style={styles.btnBorrarItem}
        onPress={() => borrarVisita(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.btnBorrarItemTexto}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.contenedor}>

      <TouchableOpacity
        style={styles.btnCamara}
        onPress={() => navigation.navigate('Camara')}
        activeOpacity={0.85}
      >
        <Text style={styles.btnCamaraTexto}>📷  Fotografiar este lugar</Text>
        <Text style={styles.btnCamaraSub}>Guarda foto + coordenadas GPS</Text>
      </TouchableOpacity>

      {visitas.length > 0 && (
        <Text style={styles.contador}>
          {visitas.length} lugar{visitas.length !== 1 ? 'es' : ''} registrado{visitas.length !== 1 ? 's' : ''}
        </Text>
      )}

      <FlatList
        data={visitas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📷</Text>
            <Text style={styles.vacioTitulo}>Sin registros aún</Text>
            <Text style={styles.vacioTexto}>
              Toca el botón verde para abrir la cámara,{'\n'}
              tomar una foto y registrar tus coordenadas GPS.
            </Text>
          </View>
        }
        ListFooterComponent={
          visitas.length > 1 ? (
            <TouchableOpacity style={styles.btnBorrarTodo} onPress={borrarTodo}>
              <Text style={styles.btnBorrarTodoTexto}>Borrar todos los registros</Text>
            </TouchableOpacity>
          ) : null
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  contenedor:         { flex: 1, backgroundColor: '#f4f4f2' },
  btnCamara:          { backgroundColor: '#059669', margin: 14, borderRadius: 14, padding: 16, alignItems: 'center', elevation: 4 },
  btnCamaraTexto:     { color: '#fff', fontWeight: '800', fontSize: 16 },
  btnCamaraSub:       { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  contador:           { fontSize: 12, color: '#888', fontWeight: '600', marginHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card:               { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 14, marginBottom: 10, borderRadius: 14, overflow: 'hidden', elevation: 2 },
  foto:               { width: 92, height: 92 },
  cardInfo:           { flex: 1, padding: 12, justifyContent: 'center', gap: 4 },
  coordsLabel:        { fontSize: 10, fontWeight: '700', color: '#059669', textTransform: 'uppercase' },
  coords:             { fontSize: 13, fontWeight: '700', color: '#1a1a1a' },
  sinGps:             { fontSize: 13, color: '#aaa' },
  fecha:              { fontSize: 11, color: '#999', marginTop: 2 },
  btnBorrarItem:      { padding: 12, justifyContent: 'center' },
  btnBorrarItemTexto: { fontSize: 14, color: '#ccc', fontWeight: '700' },
  vacio:              { alignItems: 'center', marginTop: 48, paddingHorizontal: 36 },
  vacioEmoji:         { fontSize: 52, marginBottom: 12 },
  vacioTitulo:        { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  vacioTexto:         { textAlign: 'center', fontSize: 14, color: '#888', lineHeight: 22 },
  btnBorrarTodo:      { marginHorizontal: 14, marginTop: 8, borderRadius: 10, padding: 14, alignItems: 'center', backgroundColor: '#fee2e2' },
  btnBorrarTodoTexto: { color: '#991b1b', fontWeight: '700', fontSize: 14 },
});