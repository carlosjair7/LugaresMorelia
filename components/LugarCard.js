import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text } from '@rneui/themed';

export default function LugarCard({ lugar, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card containerStyle={styles.card}>
        <Image source={lugar.imagen} style={styles.imagen} />
        <Card.Title>{lugar.nombre}</Card.Title>
        <Card.Divider />
        <Text style={styles.descripcion}>{lugar.descripcion}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 0, overflow: 'hidden', marginBottom: 16 },
  imagen: { width: '100%', height: 180, resizeMode: 'cover' },
  descripcion: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 8 },
});