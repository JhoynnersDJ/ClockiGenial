import React from 'react'
import { Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../../controladores/AuthProvider'
import MiPerfil from './MiPerfil'
import Ajustes from './Ajustes'

const PanelPerfil = () => {
    const Stack = createStackNavigator();


  return (
    <Stack.Navigator>
      <Stack.Screen name="MiPerfil" component={MiPerfil} options={{ headerShown: false }} />
      <Stack.Screen name="Ajustes" component={Ajustes} />
    </Stack.Navigator>
  )
}

export default PanelPerfil