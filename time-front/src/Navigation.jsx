import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useAuth } from "./controladores/AuthProvider";
//Screens Auth
import Bienvenida from "./screens/stackauthScreens/Bienvenida";
import Login from "./screens/stackauthScreens/Login";
import Registro from "./screens/stackauthScreens/Registro";
import OlvideContraseña from "./screens/stackauthScreens/OlvideContraseña";

//Screens TabBottom
import Feed from "./screens/tabScreens/Feed";
import Notificaciones from "./screens/tabScreens/Notificaciones";
import Settings from "./screens/tabScreens/Settings";
//Screens HomeStack
import ActivityDetails from "./screens/homeStack/ActivityDetails";
import ProjectDetails from "./screens/homeStack/ProjectDetails";
import GraficasDetails from "./screens/homeStack/GraficasDetails";
import CrearActividad from "./screens/homeStack/Crear/CrearActividad";
import CrearProyecto from "./screens/homeStack/Crear/CrearProyecto";
import EditarActividad from "./screens/homeStack/Editar/EditarActividad";

//Screens Drawer
import Resumen from "./screens/drawerScreens/Resumen";

//Screens TopTab
import Actividades from "./screens/toptapScreens/Actividades";
import Proyectos from "./screens/toptapScreens/Proyectos";

import Ionicons from "react-native-vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import EditarProyecto from "./screens/homeStack/Editar/EditarProyecto";
import CrearCliente from "./screens/homeStack/Crear/CrearCliente";
//Stack Auth
const StackAuth = createNativeStackNavigator();

function StackAuthGroup() {
  return (
    <StackAuth.Navigator>
      <StackAuth.Screen
        name="Bienvenida"
        component={Bienvenida}
        options={{ headerShown: false }}
      />
      <StackAuth.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <StackAuth.Screen
        name="Registro"
        component={Registro}
        options={{ headerShown: false }}
      />
      <StackAuth.Screen
        name="OlvideContraseña"
        component={OlvideContraseña}
        options={{ headerShown: false }}
      />
    </StackAuth.Navigator>
  );
}
//TopTab
const TopTab = createMaterialTopTabNavigator();

function TopTabGroup() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#f1f1f1", height: 50, margin:14, borderRadius: 10, },
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'semibold' },
        tabBarActiveTintColor: "white" ,
        tabBarInactiveTintColor: "#6d28d9",
        tabBarIndicatorStyle: {
          backgroundColor: "#6d28d9",
          borderRadius: 10,
          height: "100%",
        },
      }}
    >
      <TopTab.Screen name="Actividades" component={Actividades} />
      <TopTab.Screen name="Proyectos" component={Proyectos} />
    </TopTab.Navigator>
  );
}

//Drawer
const Drawer = createDrawerNavigator();

function DrawerGroup({ navigation }) {
  const { currentUser } = useAuth();
  return (
    <Drawer.Navigator
    screenOptions={({ route, navigation }) => ({
      headerBackground: () => (
        <View
          style={{
            backgroundColor: "#6d28d9",
            height: 70,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        ></View>
      ),
      headerRight: () => (
        <View className="items-center mx-4">
          <Text className="text-3xl font-bold text-gray-100">
            {route.name === "Home" ? "OmniSolutions" : route.name}
          </Text>
        </View>
      ),
      headerTitleStyle: {
        display: "none",
      },
      headerLeft: () => (
        <Pressable
          className="flex items-center justify-center h-10 w-10 bg-red-300 rounded-full mx-4 my-2 border-2 border-violet-200"
          onPress={() => navigation.openDrawer()}
        >
          <Text className="text-xl font-bold text-red-600 "> {currentUser.nombre[0].toUpperCase()}{currentUser.apellido[0].toUpperCase()} </Text>
        </Pressable>
      ),
      headerStyle: {
        height: 70,
      },
    })}
    >
      <Drawer.Screen
        name="Home"
        component={TabGroup}
      />
      <Drawer.Screen
        name="Resumen"
        component={Resumen}

      />
    </Drawer.Navigator>
  );
}

//Stack
const Stack = createNativeStackNavigator();

function StackGroup() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        title: "",
      }}
    >
      <Stack.Screen name="DrawerGroup" component={DrawerGroup} 
      options={
        {
          headerShown: false
        }
      }
      />
      <Stack.Screen name="ActivityDetails" component={ActivityDetails} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      <Stack.Screen name="GraficasDetails" component={GraficasDetails} />
      <Stack.Screen name="CrearActividad" component={CrearActividad} /> 
      <Stack.Screen name="CrearProyecto" component={CrearProyecto} />
      <Stack.Screen name="CrearCliente" component={CrearCliente}         options={{
          presentation: "modal",
          headerShown: false,
        }} />
      <Stack.Screen name="EditarActividad" component={EditarActividad} />
      <Stack.Screen name="EditarProyecto" component={EditarProyecto} />
    </Stack.Navigator>
  );
}
//Tab
const Tab = createBottomTabNavigator();

function TabGroup() {
  const { currentUser } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6d28d9",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#6d28d9",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "TopTabGroup") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Notificaciones") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Ajustes") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="TopTabGroup" component={TopTabGroup} options={
        {
            title: 'Inicio',
        }
      } />
      <Tab.Screen name="Notificaciones" component={Notificaciones} />
      <Tab.Screen name="Ajustes" component={Settings} />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  const { currentUser } = useAuth();
  return (
    <NavigationContainer>
      {currentUser ? <StackGroup /> : <StackAuthGroup />}
    </NavigationContainer>
  );
};

export default Navigation;
