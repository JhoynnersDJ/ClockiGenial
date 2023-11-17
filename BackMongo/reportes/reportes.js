const express = require('express');
const router = express.Router();
const Actividad = require('../Modelo/ActividadModel');
const { startOfWeek, endOfWeek, format, parseISO } = require('date-fns');



// Obtener actividades diarias
router.get('/informe-diario/:fecha', async (req, res) => {
  try {
    const fecha = req.params.fecha;
    console.log(fecha);
    // Obtener actividades para la fecha específica
    const actividadesDiarias = await Actividad.find({
      fecha_registro: fecha,
    });

    // Puedes realizar cálculos adicionales o formatear los resultados según sea necesario

    res.status(200).json({ actividadesDiarias });
  } catch (error) {
    console.error('Error al obtener informe diario:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe diario' });
  }
});

// Endpoint para obtener informe semanal
router.get('/informe-semanal/:fecha_inicio', async (req, res) => {
  try {
    // Convertir la cadena de fecha de inicio a un objeto Date
    const fechaInicio = new Date(req.params.fecha_inicio);

    // Calcula las fechas de inicio y fin de la semana que contiene la fecha de inicio
    const primerDiaSemana = new Date(fechaInicio);
    primerDiaSemana.setDate(fechaInicio.getDate() - fechaInicio.getDay() + (fechaInicio.getDay() === 0 ? -6 : 1));
    const ultimoDiaSemana = new Date(fechaInicio);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

    // Realiza una consulta para obtener las actividades en el rango de fechas
    const actividadesSemana = await Actividad.find({
      fecha_registro: {
        $gte: primerDiaSemana.toISOString().split('T')[0], // Convertir a formato YYYY-MM-DD
        $lte: ultimoDiaSemana.toISOString().split('T')[0],
      },
    });

    // Procesa y presenta la información como desees
    const informeSemanal = {
      rango_fechas: {
        inicio: primerDiaSemana.toISOString().split('T')[0],
        fin: ultimoDiaSemana.toISOString().split('T')[0],
      },
      actividades: actividadesSemana.map(actividad => ({
        id_actividad: actividad._id,
        nombre_actividad: actividad.nombre_actividad,
        duracion_total: actividad.duracion_total,
        // Otros campos que desees incluir
      })),
    };

    res.status(200).json(informeSemanal);
  } catch (error) {
    console.error('Error al obtener informe semanal:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe semanal' });
  }
});





module.exports = router;
