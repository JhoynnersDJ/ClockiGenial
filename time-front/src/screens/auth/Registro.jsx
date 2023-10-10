import React from 'react'
import { Text, View, Button, TextInput } from 'react-native'
import axios from 'axios'

const Registro = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const registrarUsuario = async () => {
        try {
            const respuesta = await axios.post("http://192.168.1.50:8000/registro", {
                email: email,
                password: password,
            });
            console.log(respuesta);
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <View>
      <Text>Registro</Text>
      <Text>Correo</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text>Contraseña</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Registrar" onPress={registrarUsuario} />
    </View>
    
  )
}

export default Registro