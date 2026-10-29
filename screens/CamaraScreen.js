import { useRef, useState } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';

export default function CamaraScreen({ navigation }) {
  const camaraRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Pantalla de carga mientras se verifica el permiso
  if (!permission) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  // Pantalla para solicitar permiso de cámara
  if (!permission.granted) {
    return (
      <View style={styles.centro}>
        <Text style={styles.permisoEmoji}>📷</Text>
        <Text style={styles.permisoTexto}>
          Se necesita permiso de cámara para fotografiar el lugar.
        </Text>
        <TouchableOpacity style={styles.permisoBtn} onPress={requestPermission}>
          <Text style={styles.permisoBtnTexto}>Dar permiso de cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (!camaraRef.current || cargando) return;
    setCargando(true);
    try {
      // 1. Tomar foto
      const foto = await camaraRef.current.takePictureAsync({ quality: 0.7 });

      // 2. Copiar a carpeta permanente para que no se borre
      const dirVisitas = FileSystem.documentDirectory + 'visitas/';
      const dirInfo = await FileSystem.getInfoAsync(dirVisitas);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirVisitas, { intermediates: true });
      }
      const rutaPermanente = dirVisitas + 'visita_' + Date.now() + '.jpg';
      await FileSystem.copyAsync({ from: foto.uri, to: rutaPermanente });

      // 3. Leer coordenadas GPS
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = null, lng = null;
      if (status === 'granted') {
        const ubicacion = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = ubicacion.coords.latitude;
        lng = ubicacion.coords.longitude;
      } else {
        Alert.alert('GPS no disponible', 'La foto se guardará sin coordenadas.');
      }

      // 4. Navegar de regreso a Visitas con los datos
      navigation.navigate('Visitas', {
        fotoUri:   rutaPermanente,
        lat, lng,
        fecha:     new Date().toLocaleString('es-MX'),
        timestamp: Date.now(),
      });

    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto. Inténtalo de nuevo.');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // Visor de la cámara
  // IMPORTANTE: CameraView no acepta hijos — el overlay va en un View separado
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={camaraRef}
        facing="back"
      />

      {/* Overlay encima de la cámara con position absolute */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">

        <View style={styles.gpsIndicador}>
          <Text style={styles.gpsTexto}>GPS activo</Text>
        </View>

        {/* Retícula central */}
        <View style={styles.reticula}>
          <View style={[styles.esquina, styles.esqTL]} />
          <View style={[styles.esquina, styles.esqTR]} />
          <View style={[styles.esquina, styles.esqBL]} />
          <View style={[styles.esquina, styles.esqBR]} />
        </View>

        {/* Botón de captura */}
        <View style={styles.botonesArea}>
          <Text style={styles.instruccion}>
            Toca el botón para fotografiar y registrar coordenadas GPS
          </Text>
          <TouchableOpacity
            style={[styles.btnCaptura, cargando && { opacity: 0.6 }]}
            onPress={tomarFoto}
            disabled={cargando}
          >
            {cargando
              ? <ActivityIndicator color="#059669" size="large" />
              : <View style={styles.circuloInterior} />
            }
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const C = 18, W = 3;
const styles = StyleSheet.create({
  centro:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#000' },
  permisoEmoji:    { fontSize: 52, marginBottom: 16 },
  permisoTexto:    { fontSize: 15, color: '#fff', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  permisoBtn:      { backgroundColor: '#059669', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  permisoBtnTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
  gpsIndicador:    { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  gpsTexto:        { color: '#4ade80', fontWeight: '700', fontSize: 12 },
  reticula:        { position: 'absolute', top: '30%', left: '20%', width: '60%', height: '30%' },
  esquina:         { position: 'absolute', width: C, height: C },
  esqTL:           { top: 0,    left: 0,   borderTopWidth: W,    borderLeftWidth: W,  borderColor: '#fff' },
  esqTR:           { top: 0,    right: 0,  borderTopWidth: W,    borderRightWidth: W, borderColor: '#fff' },
  esqBL:           { bottom: 0, left: 0,   borderBottomWidth: W, borderLeftWidth: W,  borderColor: '#fff' },
  esqBR:           { bottom: 0, right: 0,  borderBottomWidth: W, borderRightWidth: W, borderColor: '#fff' },
  botonesArea:     { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', paddingBottom: 44, paddingTop: 16, backgroundColor: 'rgba(0,0,0,0.45)' },
  instruccion:     { color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center', marginBottom: 20, paddingHorizontal: 32, lineHeight: 18 },
  btnCaptura:      { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  circuloInterior: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
});