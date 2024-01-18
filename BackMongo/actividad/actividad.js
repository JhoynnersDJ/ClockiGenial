const express = require('express');
const router = express.Router();
const Actividad = require('../Modelo/ActividadModel');
const RegistroTiempo = require('../Modelo/RegistroTiempoModel');
const mongoose = require('mongoose');
const { obtenerPrecioBCV } = require('../bcv');
const Proyecto = require('../Modelo/ProyectoModel');

router.post('/registro-actividad', async (req, res) => {
  try {
    const { nombre_actividad, id_proyecto, id_usuario, horas, minutos, segundos, tarifa } = req.body;

    const fechaHoraActual = new Date();
    const fechaActualISO = fechaHoraActual.toISOString().split('T')[0];  // Formato YYYY-MM-DD
    const horaActual = fechaHoraActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Verifica si id_usuario es un ObjectId válido
    if (!mongoose.isValidObjectId(id_usuario)) {
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    // 1. Crea un nuevo documento en la colección de Actividades
    const nuevaActividadData = {
      nombre_actividad,
      usuario: id_usuario,
      duracion_total: { horas, minutos, segundos },
      tarifa: tarifa !== undefined ? tarifa : null,
      completado: false,
      fecha_registro: fechaActualISO,
      hora_registro: horaActual,
    };

    // Añade el campo proyecto solo si se proporciona
    if (id_proyecto) {
      // Verifica si id_proyecto es un ObjectId válido
      if (!mongoose.isValidObjectId(id_proyecto)) {
        return res.status(400).json({ error: 'ID de proyecto no válido' });
      }
      nuevaActividadData.proyecto = id_proyecto;
    }

    const nuevaActividad = new Actividad(nuevaActividadData);

    // Guarda la actividad en MongoDB
    const actividadGuardada = await nuevaActividad.save();

    // 2. Crea un nuevo documento en la colección de RegistroTiempo
    const nuevoRegistroTiempo = new RegistroTiempo({
      actividad: actividadGuardada._id,
      duracion: { horas, minutos, segundos },
      fecha: fechaActualISO,
      hora: horaActual,
      nombre_actividad,
    });

    // Guarda el registro de tiempo en MongoDB
    await nuevoRegistroTiempo.save();

    // 3. Actualiza el contador del proyecto
    if (id_proyecto) {
      await Proyecto.findOneAndUpdate(
        { _id: id_proyecto },
        { $inc: { contador: 1 } },
        { new: true } // Devuelve el documento actualizado
      );
    }

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
      const tarifaTotalRedondeada = total_tarifa.toFixed(2);
      // Actualiza el campo 'total_tarifa' en la actividad
      await Actividad.findByIdAndUpdate(id_actividad, {
        total_tarifa: tarifaTotalRedondeada,
      });
  
      
      res.status(201).json({ message: 'Registro de tiempo y duración actualizados con éxito' });
    } catch (error) {
      console.error('Error al actualizar actividad y tiempo:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar actividad y tiempo' });
    }
  });



  // Endpoint para marcar una actividad como completada
router.post('/actividad-completada', async (req, res) => {
  try {
    const { id_actividad } = req.body;

    // Busca la actividad por su ID y el ID del usuario
    const actividad = await Actividad.findOne({ _id: id_actividad });

    if (actividad) {
      // Actualiza el campo 'completado' a true
      actividad.completado = true;

      // Guarda los cambios
      await actividad.save();

      res.status(200).json({ message: 'Actividad marcada como completada correctamente' });
    } else {
      res.status(404).json({ error: 'Actividad no encontrada para el usuario proporcionado' });
    }
  } catch (error) {
    console.error('Error al marcar la actividad como completada:', error);
    res.status(500).json({ error: 'Ocurrió un error al marcar la actividad como completada' });
  }
});

// Endpoint para borrar un cliente por su ID
router.delete('/eliminar-actividad/:id_actividad', async (req, res) => {
  try {
    const { id_actividad } = req.params;

    // Verificar si id_actividad es un ObjectId válido
    if (!mongoose.isValidObjectId(id_actividad)) {
      return res.status(400).json({ error: 'ID de actividad no válido' });
    }

    // Borrar el cliente por su ID
    const resultado = await Actividad.findByIdAndDelete(id_actividad);

    if (resultado) {
      res.status(200).json({ message: 'Actividad borrado correctamente' });
    } else {
      res.status(404).json({ error: 'Actividad no encontrado' });
    }
  } catch (error) {
    console.error('Error al borrar actividad:', error);
    res.status(500).json({ error: 'Ocurrió un error al borrar el actividad' });
  }
});

module.exports = router;






