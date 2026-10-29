import { FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import LugarCard from '../components/LugarCard';
import lugares from '../data';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Lugares Misteriosos</Text>
      <Text style={styles.subtitulo}>Morelia, Michoacán</Text>
      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LugarCard
            lugar={item}
            onPress={() => navigation.navigate('Detalle', { lugar: item })}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginTop: 20, marginLeft: 16 },
  subtitulo: { fontSize: 14, color: '#888', marginLeft: 16, marginBottom: 8 },
});