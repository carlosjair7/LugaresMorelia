import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import lugares from '../data';

export default function MapaScreen() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mapa de Lugares Misteriosos</Text>
        <Text style={styles.subtitulo}>Morelia, Michoacán · {lugares.length} sitios</Text>
      </View>

      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude:       19.7060,
          longitude:      -101.1950,
          latitudeDelta:  0.035,
          longitudeDelta: 0.035,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {lugares.map((lugar) => (
          <Marker
            key={lugar.id}
            coordinate={{ latitude: lugar.lat, longitude: lugar.lng }}
            title={lugar.nombre}
            description={lugar.ubicacion}
            pinColor="#dc2626"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  titulo:    { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  subtitulo: { fontSize: 12, color: '#888', marginTop: 2 },
  mapa:      { flex: 1 },
});