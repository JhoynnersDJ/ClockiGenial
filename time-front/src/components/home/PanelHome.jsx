import React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Actividades from './actividades/Actividades';
import Proyectos from './Proyectos';
import PaletaColor from '../../tema/PaletaColor';

const PanelHome = ({modulo, setModulo}) => {
  const Stack = createStackNavigator();
  const TabTop = createMaterialTopTabNavigator();

  //Quiero que si mi panel muestra Actividades Modulo sea Actividades y si muestra Proyectos Modulo sea Proyectos

  const getInitialRouteName = () => {
    if (modulo === 'Actividades') {
      return 'Actividades';
    } else if (modulo === 'Proyectos') {
      return 'Proyectos';
    } else {
      return 'Actividades'; // Set a default value if modulo is neither 'Actividades' nor 'Proyectos'
    }
  };

  return (
     <TabTop.Navigator initialRouteName={getInitialRouteName()}>
      <TabTop.Screen
        name="Actividades"
        component={Actividades}
        options={{
          tabBarLabel: 'Actividades',
          //quiero que el color que muestra la view activa deje de ser azul y sea PaletaColor.primary
          tabBarIndicatorStyle: { backgroundColor: PaletaColor.primary },
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'semibold' },
        }}
        listeners={
          {
          focus: () => setModulo('Actividades'),
        }
        }
      />
      <TabTop.Screen
        name="Proyectos"
        component={Proyectos}
        options={{
          tabBarLabel: 'Proyectos',
          tabBarIndicatorStyle: { backgroundColor: PaletaColor.primary },
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'semibold' },
        }}
        listeners={
          {
          focus: () => setModulo('Proyectos'),
        }
        }
      />
    </TabTop.Navigator>
  );
};

export default PanelHome;