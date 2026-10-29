import { View, Text, StyleSheet } from 'react-native';

export default function FavoritosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Favoritos</Text>
      <Text style={styles.texto}>
        Aquí aparecerán los lugares que marques como favoritos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  texto: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 24 },
});