import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from './controladores/AuthProvider'

//screens protegidas
import Home from './screens/protegidas/Home'
import Resumen from './screens/protegidas/Resumen'
import Perfil from './screens/protegidas/Perfil'

//Screen no protegidas
import Bienvenida from './screens/auth/Bienvenida'
import Login from './screens/auth/Login'
import Registro from './screens/auth/Registro'
import OlvideContraseña from './screens/auth/OlvideContraseña'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator();

//Quiero tener rutas protegidas, donde el usuario que este logiado pueda acceder a ellas y el que no este logiado solo pueda acceder a registro, login y olvide mi contraseña
const Navigation = () => {
    const { currentUser } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual
    return (
        <NavigationContainer>
            {currentUser ? ( // Verifica si el usuario está autenticado
              <>
                <Tab.Navigator>
                <Tab.Screen name="Home" component={Home} 

                />
                <Tab.Screen name="Resumen" component={Resumen} />
                <Tab.Screen name="Perfil" component={Perfil} />
                </Tab.Navigator>
              </>
            ) : (
                <>
            <Stack.Navigator>
                <Stack.Screen name="Bienvenida" component={Bienvenida} 
                options={
                    {
                        headerShown: false
                    }
                } 
                />
                <Stack.Screen name="Login" component={Login} 
                options={
                    {
                        headerShown: false
                    }
                }
                />
                <Stack.Screen name="Registro" component={Registro} />
                <Stack.Screen name="OlvideContraseña" component={OlvideContraseña} />
            </Stack.Navigator>
            </>
            )}
            

        </NavigationContainer>
      );
    };
    
    export default Navigation;