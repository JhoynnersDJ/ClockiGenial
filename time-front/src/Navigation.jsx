import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from "./controladores/AuthProvider";
import Icon from "react-native-vector-icons/FontAwesome";
import PaletaColor from "./tema/PaletaColor";

//screens protegidas
import Home from "./screens/protegidas/Home";
import Resumen from "./screens/protegidas/Resumen";
import Perfil from "./screens/protegidas/Perfil";

//Screen no protegidas
import Bienvenida from "./screens/auth/Bienvenida";
import Login from "./screens/auth/Login";
import Registro from "./screens/auth/Registro";
import OlvideContraseña from "./screens/auth/OlvideContraseña";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MaterialTopTab = createMaterialTopTabNavigator(); // Nueva adición

// Quiero tener rutas protegidas, donde el usuario que esté logeado pueda acceder a ellas y el que no esté logeado solo pueda acceder a registro, login y olvidé mi contraseña
const Navigation = () => {
  const { currentUser } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual

  return (
    <NavigationContainer>
      {currentUser ? ( // Verifica si el usuario está autenticado
        <>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home';
                } else if (route.name === 'Resumen') {
                  iconName = focused ? 'bar-chart' : 'bar-chart';
                } else if (route.name === 'Perfil') {
                  iconName = focused ? 'user' : 'user';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: PaletaColor.primary,
              inactiveTintColor: PaletaColor.gray,
            }}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Resumen" component={Resumen} />
            <Tab.Screen name="Perfil" component={Perfil} />
          </Tab.Navigator>
        </>
      ) : (
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="Bienvenida"
              component={Bienvenida}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Registro"
              component={Registro}
              options={
                {
                  headerShown: false,
                }
              }
            />

            <Stack.Screen
              name="OlvideContraseña"
              component={OlvideContraseña}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
