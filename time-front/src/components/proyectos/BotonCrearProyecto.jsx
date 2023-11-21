import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";

const BotonCrearProyecto = ({navigation}) => {
  return (
    <TouchableOpacity className="absolute bottom-2 right-0" onPress={() => navigation.navigate("CrearProyecto")}>
    <Ionicons name="add-circle" size={60} color="#6d28d9" />
    </TouchableOpacity>
  )
}

export default BotonCrearProyecto