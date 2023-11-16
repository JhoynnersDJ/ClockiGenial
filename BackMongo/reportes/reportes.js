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

router.get('/reporte-semanal/:fechaInicio/:id_usuario', async (req, res) => {
  try {
    const { fechaInicio, id_usuario } = req.params;

    // Parsea la fecha de inicio proporcionada por el cliente
    const fechaInicioCliente = parseISO(fechaInicio);

    // Obtén la fecha de fin de la semana basada en la fecha proporcionada por el cliente
    const fechaFinSemana = endOfWeek(fechaInicioCliente, { weekStartsOn: 1 });

    // Formatea las fechas según tu formato preferido (por ejemplo, 'AA-MM-DD')
    const fechaInicioFormateada = format(fechaInicioCliente, 'yyyy-MM-dd');
    const fechaFinFormateada = format(fechaFinSemana, 'yyyy-MM-dd');
    console.log('Fecha de inicio formateada:', fechaInicioFormateada);
    console.log('Fecha de fin formateada:', fechaFinFormateada);
    // Consultar actividades dentro del intervalo de la semana
    const actividadesSemana = await Actividad.find({
      usuario: id_usuario,
      fecha_registro: {
        $gte: new Date(fechaInicioFormateada),
        $lte: new Date(fechaFinFormateada),
      },
    });

    // En el lugar donde procesas y presentas la información:
    const informeSemanal = {
      rango_fechas: {
        inicio: fechaInicioFormateada,
        fin: fechaFinFormateada,
      },
      actividades: actividadesSemana.map(actividad => ({
        id_actividad: actividad._id,
        nombre_actividad: actividad.nombre_actividad,
        duracion_total: actividad.duracion_total,
        // Otros campos que desees incluir
      })),
    };
    console.log('Actividades encontradas:', actividadesSemana);
    // Puedes enviar informeSemanal como respuesta a tu cliente
    res.status(200).json(informeSemanal);
  } catch (error) {
    console.error('Error al obtener el informe semanal:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe semanal' });
  }
});





module.exports = router;
