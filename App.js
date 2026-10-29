import { NavigationContainer }        from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity }     from 'react-native';

import HomeScreen             from './screens/HomeScreen';
import DetalleScreen          from './screens/DetalleScreen';
import MapaScreen             from './screens/MapaScreen';
import FavoritosScreen        from './screens/FavoritosScreen';
import AcercaScreen           from './screens/AcercaScreen';
import CamaraScreen           from './screens/CamaraScreen';           // NUEVO
import LugaresVisitadosScreen from './screens/LugaresVisitadosScreen'; // NUEVO

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TabIcon = ({ emoji, focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

// Stack: Home → Detalle → Camara → Acerca
function InicioStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: '#065f46' },
        headerTintColor:  '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Lugares Misteriosos',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Acerca')} style={{ marginRight: 4 }}>
              <Text style={{ fontSize: 22 }}>ℹ️</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={({ route }) => ({ title: route.params.lugar.nombre })}
      />
      <Stack.Screen
        name="Camara"
        component={CamaraScreen}
        options={{
          title: 'Tomar foto',
          headerStyle:     { backgroundColor: '#000' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Acerca"
        component={AcercaScreen}
        options={{ title: 'Acerca de' }}
      />
    </Stack.Navigator>
  );
}

// Tab: Inicio | Mapa | Favoritos | Visitas
function MisTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor:   '#059669',
        tabBarInactiveTintColor: '#aaa',
        headerShown:             false,
      }}
    >
      <Tab.Screen name="Inicio" component={InicioStack}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen name="Mapa" component={MapaScreen}
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
          headerShown: true, headerTitle: 'Mapa',
          headerStyle: { backgroundColor: '#065f46' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Tab.Screen name="Favoritos" component={FavoritosScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} />,
          headerShown: true, headerTitle: 'Favoritos',
          headerStyle: { backgroundColor: '#065f46' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Tab.Screen name="Visitas" component={LugaresVisitadosScreen}
        options={{
          tabBarLabel: 'Mis Visitas',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📷" focused={focused} />,
          headerShown: true, headerTitle: 'Lugares Visitados',
          headerStyle: { backgroundColor: '#065f46' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MisTabs />
    </NavigationContainer>
  );
}