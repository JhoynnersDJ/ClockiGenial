const express = require('express');
const router = express.Router();
const Actividad = require('../Modelo/ActividadModel');
const Usuario = require('../Modelo/UsuarioModel');
const {calcularInformacionReporte} = require('../funcionesReporte/funcionesReportes');


// Obtener actividades diarias con nombre de proyecto y nombre de cliente
router.post('/informe-diario', async (req, res) => {
  try {
    const { fecha, id_usuario } = req.body;

    // Obtener actividades para la fecha específica y cargar los datos del proyecto y cliente asociados
    const actividadesDiarias = await Actividad.find({ fecha_registro: fecha, usuario: id_usuario })
      .populate({
        path: 'proyecto',
        model: 'Proyecto',
        populate: {
          path: 'cliente',
          model: 'Cliente',
          select: 'nombre_cliente', // Puedes seleccionar los campos que desees del cliente
        },
        select: 'nombre_proyecto cliente tarifa_total', // Incluimos el campo cliente y tarifa_total
      })
      .exec();

    // Log de proyectos antes de calcular la ganancia total
    console.log('Proyectos para el cálculo de ganancia total:', actividadesDiarias.map(actividad => actividad.proyecto));

    // Obtener información del usuario
    const usuario = await Usuario.findById(id_usuario).select('nombre apellido email').exec();

    // Calcular la información del reporte utilizando la función modular
    const { gananciaPorProyecto, ingresosTotales } = await calcularInformacionReporte(actividadesDiarias);

    res.status(200).json({ actividadesDiarias, usuario, gananciaPorProyecto, ingresosTotales });
  } catch (error) {
    console.error('Error al obtener informe diario:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe diario' });
  }
});


// Endpoint para obtener informe semanal
router.post('/informe-semanal/', async (req, res) => {
  try {
    const { fecha_inicio, id_usuario } = req.body;

    // Convertir la cadena de fecha de inicio a un objeto Date
    const fechaInicio = new Date(fecha_inicio);

// Calcula las fechas de inicio y fin de la semana que contiene la fecha de inicio
const primerDiaSemana = new Date(fechaInicio);
const diaSemana = fechaInicio.getDay();
const diferenciaDias = diaSemana >= 1 ? diaSemana - 0 : 6; // Si es domingo, restamos 1 día; de lo contrario, restamos la cantidad de días transcurridos desde el lunes
primerDiaSemana.setDate(fechaInicio.getDate() - diferenciaDias);

const ultimoDiaSemana = new Date(primerDiaSemana);
ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

    // Realiza una consulta para obtener las actividades en el rango de fechas y del usuario específico
    const actividadesSemana = await Actividad.find({
      fecha_registro: {
        $gte: primerDiaSemana.toISOString().split('T')[0], // Convertir a formato YYYY-MM-DD
        $lte: ultimoDiaSemana.toISOString().split('T')[0],
      },
      usuario: id_usuario, // Agrega esta condición para filtrar por usuario
    })
      .populate({
        path: 'proyecto',
        model: 'Proyecto',
        populate: {
          path: 'cliente',
          model: 'Cliente',
          select: 'nombre_cliente',
        },
        select: 'nombre_proyecto cliente tarifa_total',
      })
      .exec();

    // Log de proyectos antes de calcular la ganancia total
    console.log('Proyectos para el cálculo de ganancia total:', actividadesSemana.map(actividad => actividad.proyecto));

    // Calcular la ganancia por proyecto y los ingresos totales
    const gananciaPorProyecto = actividadesSemana.reduce((result, actividad) => {
      const proyectoId = actividad.proyecto ? actividad.proyecto._id.toString() : null; // Convertir a cadena para comparar
      if (proyectoId) {
        if (!result[proyectoId]) {
          result[proyectoId] = {
            proyecto: actividad.proyecto.nombre_proyecto,
            gananciaTotal: 0,
          };
        }
        result[proyectoId].gananciaTotal += actividad.total_tarifa || 0;
        result[proyectoId].gananciaTotal = parseFloat(result[proyectoId].gananciaTotal.toFixed(2)); // Redondear a dos decimales
      }
      return result;
    }, {});

    // Calcular los ingresos totales del usuario
    const ingresosTotales = actividadesSemana.reduce((total, actividad) => {
      total += actividad.total_tarifa || 0;
      return total;
    }, 0);

    // Redondear los ingresos totales a dos decimales
    const ingresosTotalesDosDecimales = parseFloat(ingresosTotales.toFixed(2));

    // Resto del código para procesar y enviar la respuesta

    res.status(200).json({
      informeSemanal: {
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
        gananciaPorProyecto,
        ingresosTotales: ingresosTotalesDosDecimales,
      },
    });
  } catch (error) {
    console.error('Error al obtener informe semanal:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe semanal' });
  }
});



module.exports = router;
