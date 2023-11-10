const express = require('express');
const router = express.Router();
const Actividad = require('../Modelo/ActividadModel');
const RegistroTiempo = require('../Modelo/RegistroTiempoModel');

router.post('/registro-actividad', async (req, res) => {
  try {
    const { nombre_actividad, id_proyecto, id_usuario, horas, minutos, segundos, tarifa } = req.body;

    const fechaHoraActual = new Date();
    const fechaActual = fechaHoraActual.toLocaleDateString('es-ES');
    const horaActual = fechaHoraActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Crea un nuevo documento en la colección de Actividades
    const nuevaActividad = new Actividad({
      nombre_actividad,
      proyecto: id_proyecto, // Asumiendo que id_proyecto es un ObjectId válido
      usuario: id_usuario, // Asumiendo que id_usuario es un ObjectId válido
      duracion_total: { horas, minutos, segundos },
      tarifa: tarifa !== undefined ? tarifa : null,
      completado: false,
      fecha_registro: fechaActual,
      hora_registro: horaActual,
    });

    // Guarda la actividad en MongoDB
    const actividadGuardada = await nuevaActividad.save();

    // 2. Crea un nuevo documento en la colección de RegistroTiempo
    const nuevoRegistroTiempo = new RegistroTiempo({
      actividad: actividadGuardada._id,
      duracion: { horas, minutos, segundos },
      fecha: fechaActual,
      hora: horaActual,
      nombre_actividad,
    });

    // Guarda el registro de tiempo en MongoDB
    await nuevoRegistroTiempo.save();

    res.status(201).json({ actividadData: actividadGuardada });
  } catch (error) {
    console.error('Error al registrar actividad y tiempo:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar actividad y tiempo' });
  }
});

//Endpoint para actualizar actividades
router.post('/actualizar-actividad', async (req, res) => {
    try {
      const { id_actividad, horas, minutos, segundos } = req.body;
  
      // Crea un nuevo registro de tiempo
      const nuevoRegistroTiempo = new RegistroTiempo({
        actividad: id_actividad,
        duracion: { horas, minutos, segundos },
        fecha: new Date().toLocaleDateString('es-ES'),
      });
  
      // Guarda el registro de tiempo en MongoDB
      const registroTiempoGuardado = await nuevoRegistroTiempo.save();
  
      // Obtiene la tarifa de la actividad
      const actividad = await Actividad.findById(id_actividad);
      const tarifa = actividad.tarifa;
  
      // Calcula el costo_intervalo multiplicando la tarifa por la duración del registro de tiempo en horas
      const tiempoHorasFloat = horas + (minutos / 60) + (segundos / 3600);
      const costo_intervalo = tarifa * tiempoHorasFloat;
  
      // Actualiza el campo 'costo_intervalo' en el registro de tiempo
      registroTiempoGuardado.costo_intervalo = costo_intervalo;
      await registroTiempoGuardado.save();
  
      // Calcula la duración total
      const registroTiempo = await RegistroTiempo.find({ actividad: id_actividad });
      let totalHoras = 0;
      let totalMinutos = 0;
      let totalSegundos = 0;
  
      registroTiempo.forEach((tiempo) => {
        const duracion = tiempo.duracion;
        totalHoras += duracion.horas;
        totalMinutos += duracion.minutos;
        totalSegundos += duracion.segundos;
      });
  
      // Ajusta los minutos y segundos si superan 60
      totalMinutos += Math.floor(totalSegundos / 60);
      totalSegundos = totalSegundos % 60;
      totalHoras += Math.floor(totalMinutos / 60);
      totalMinutos = totalMinutos % 60;
  
      // Actualiza el campo 'duracion_total' en la actividad
      await Actividad.findByIdAndUpdate(id_actividad, {
        duracion_total: {
          horas: totalHoras,
          minutos: totalMinutos,
          segundos: totalSegundos,
        },
        $push: { registro_tiempo: registroTiempoGuardado._id },
      });
  
      // Calcula la total_tarifa multiplicando la tarifa por la duración total en horas
      const totalHorasFloat = totalHoras + (totalMinutos / 60) + (totalSegundos / 3600);
      const total_tarifa = tarifa * totalHorasFloat;
  
      // Actualiza el campo 'total_tarifa' en la actividad
      await Actividad.findByIdAndUpdate(id_actividad, {
        total_tarifa: total_tarifa,
      });
  
      res.status(201).json({ message: 'Registro de tiempo y duración actualizados con éxito' });
    } catch (error) {
      console.error('Error al actualizar actividad y tiempo:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar actividad y tiempo' });
    }
  });
module.exports = router;
