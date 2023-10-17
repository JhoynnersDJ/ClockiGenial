import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import axios from "axios";

const Cronometro = ({ activity, isActive, onActivate, onDeactivate }) => {
  const [segundos, setSegundos] = useState(activity.segundos);
  const [minutos, setMinutos] = useState(activity.minutos);
  const [horas, setHoras] = useState(activity.horas);

  useEffect(() => {
    let intervalo = null;
    if (isActive) {
      intervalo = setInterval(() => {
        if (segundos === 59) {
          setSegundos(0);
          if (minutos === 59) {
            setMinutos(0);
            setHoras(horas + 1);
          } else {
            setMinutos(minutos + 1);
          }
        } else {
          setSegundos(segundos + 1);
        }
      }, 1000);
    } else if (!isActive && segundos !== 0) {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [isActive, segundos, minutos, horas]);

  const toggleCronometro = () => {
    if (isActive) {
      onDeactivate();
    } else {
      onActivate(activity.id);
    }
  };

  const completarActividad = () => {
    
    }
  return (
    <View>
      <Text>
        {horas.toString().padStart(2, "0")}:
        {minutos.toString().padStart(2, "0")}:
        {segundos.toString().padStart(2, "0")}
      </Text>
      <View style = {{flexDirection: "row", gap: 20}}>
      <Button
        title={isActive ? "Detener" : "Iniciar"}
        onPress={toggleCronometro}
      />
      <Button
        title="Completar"
        onPress={() => completarActividad(activity.id)}
        />
          </View>
    </View>
  );
};

export default Cronometro;
