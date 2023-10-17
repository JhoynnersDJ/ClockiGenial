import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../controladores/AuthProvider';

function Perfil() {
  const { currentUser, signOut } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual

  return (
    <View>
      <Text>Perfil</Text>
      <Text>{currentUser.correo}</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}

export default Perfil;
