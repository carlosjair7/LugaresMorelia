import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function DetalleScreen({ route }) {
  const { lugar } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={lugar.imagen} style={styles.imagen} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre}>{lugar.nombre}</Text>
        <Text style={styles.ubicacion}>📍 {lugar.ubicacion}</Text>
        <Text style={styles.historia}>{lugar.historia}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagen: { width: '100%', height: 260, resizeMode: 'cover' },
  cuerpo: { padding: 20 },
  nombre: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  ubicacion: { fontSize: 13, color: '#888', marginBottom: 16 },
  historia: { fontSize: 15, color: '#333', lineHeight: 24 },
});