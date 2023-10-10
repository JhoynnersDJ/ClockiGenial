import React from 'react';
import { View, Text, Button } from 'react-native';
import { useContext } from '../../controladores/AuthProvider';

function Perfil() {
    // const { currentUser, signOut } = useAuth();

    //Correo de Ejemplo
    const currentUser = {email: "richardael14@gmail.com"};
    const signOut = () => {
        console.log("Cerrar sesión");
    }

  return (
    <View>
      <Text>Usuario actual: {currentUser.email}</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}

export default Perfil;
