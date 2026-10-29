import { View, Text, StyleSheet } from 'react-native';

export default function AcercaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Acerca de</Text>
      <Text style={styles.texto}>
        App de lugares misteriosos de Morelia, Michoacán.{'\n\n'}
        Desarrollada con React Native + Expo Go SDK 54.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  texto: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 24 },
});