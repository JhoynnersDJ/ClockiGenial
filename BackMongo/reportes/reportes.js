const express = require('express');
const router = express.Router();
const Actividad = require('../Modelo/ActividadModel');
const Usuario = require('../Modelo/UsuarioModel');
const {calcularInformacionReporte} = require('../funcionesReporte/funcionesReportes');
const { obtenerPrecioBCV } = require('../bcv');



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

    // Obtener información del usuario
    const usuario = await Usuario.findById(id_usuario).select('nombre apellido email cargo departamento num_tel empresa').exec();

    // Calcular la información del reporte utilizando la función modular
    const { gananciaPorProyecto, ingresosTotales } = await calcularInformacionReporte(InformeDiario);

    res.status(200).json({ InformeDiario, usuario, gananciaPorProyecto, ingresosTotales });
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
        $gte: primerDiaSemana.toISOString().split('T')[0],
        $lte: ultimoDiaSemana.toISOString().split('T')[0],
      },
      usuario: id_usuario,
    })
      .populate({
        path: 'proyecto',
        model: 'Proyecto',
        populate: {
          path: 'cliente',
          model: 'Cliente',
          select: 'nombre_cliente',
        },
        select: 'nombre_proyecto cliente total_tarifa descripcion',
      })
      .select('nombre_actividad duracion_total tarifa total_tarifa')
      .exec();

    // Calcular la ganancia por proyecto, los ingresos totales y la duración total del informe
    const { gananciaPorProyecto, ingresosTotales, duracionTotalInforme } = actividadesSemana.reduce(
      (result, actividad) => {
        const proyectoId = actividad.proyecto ? actividad.proyecto._id.toString() : null;

        // Convertir la duración de cada actividad a segundos
        const duracionActividadSegundos =
          (actividad.duracion_total.horas || 0) * 3600 +
          (actividad.duracion_total.minutos || 0) * 60 +
          (actividad.duracion_total.segundos || 0);

        result.duracionTotalInforme += isNaN(duracionActividadSegundos) ? 0 : duracionActividadSegundos;

        if (proyectoId) {
          if (!result.gananciaPorProyecto[proyectoId]) {
            result.gananciaPorProyecto[proyectoId] = {
              proyecto: actividad.proyecto.nombre_proyecto,
              descripcion: actividad.proyecto.descripcion,
              gananciaTotal: 0,
              tarifa: actividad.tarifa || 0,
            };
          }
          result.gananciaPorProyecto[proyectoId].gananciaTotal += actividad.total_tarifa || 0;
          result.gananciaPorProyecto[proyectoId].gananciaTotal = parseFloat(
            result.gananciaPorProyecto[proyectoId].gananciaTotal.toFixed(2)
          );
        }

        result.ingresosTotales += actividad.total_tarifa || 0;

        return result;
      },
      { gananciaPorProyecto: {}, ingresosTotales: 0, duracionTotalInforme: 0 }
    );

    // Calcular el monto del BCV
    const montoBCV = await obtenerPrecioBCV();

    // Multiplicar el monto del BCV por ingresosTotales
    const montoTotal = montoBCV * ingresosTotales;

    // Redondear el resultado a dos decimales
    const montoTotalRedondeado = parseFloat(montoTotal.toFixed(2));

    // Obtener información del usuario
    const usuario = await Usuario.findById(id_usuario).select('nombre apellido email departamento cargo empresa num_tel').exec();

    // Convertir la duración total del informe a formato horas, minutos, segundos
    const duracionTotalFormato = convertirDuracionAFormato(duracionTotalInforme);

    // Función para convertir la duración total a formato horas, minutos, segundos
    function convertirDuracionAFormato(duracionTotal) {
      const horas = Math.floor(duracionTotal / 3600);
      const minutos = Math.floor((duracionTotal % 3600) / 60);
      const segundos = Math.floor(duracionTotal % 60);
      return {
        horas,
        minutos,
        segundos,
      };
    }

    // Mapear las actividades para incluir el nombre del proyecto y del cliente
    const actividadesConProyectoYCliente = actividadesSemana.map(actividad => ({
      id_actividad: actividad._id,
      nombre_actividad: actividad.nombre_actividad,
      duracion_total: actividad.duracion_total,
      tarifa: actividad.tarifa || 0,
      total_tarifa: actividad.total_tarifa || 0,
      nombre_proyecto: actividad.proyecto ? actividad.proyecto.nombre_proyecto : '', // Incluir el nombre del proyecto si existe
      nombre_cliente: actividad.proyecto && actividad.proyecto.cliente ? actividad.proyecto.cliente.nombre_cliente : '', // Incluir el nombre del cliente si existe
    }));

    // Formatear gananciaPorProyecto con corchetes
    const gananciaPorProyectoFormateada = Object.values(gananciaPorProyecto);

    res.status(200).json({
      informeSemanal: {
        rango_fechas: {
          inicio: primerDiaSemana.toISOString().split('T')[0],
          fin: ultimoDiaSemana.toISOString().split('T')[0],
        },
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          departamento: usuario.departamento,
          cargo:usuario.cargo,
          empresa:usuario.empresa,
          num_tel:usuario.num_tel,
        },
        actividades: actividadesConProyectoYCliente,
        gananciaPorProyecto: gananciaPorProyectoFormateada,
        ingresosTotalesbcv: montoTotalRedondeado, // Utilizar la versión formateada
        ingresosTotales: parseFloat(ingresosTotales.toFixed(2)), // Redondear ingresosTotales a dos decimales
        duracion_total_informe:
         duracionTotalFormato,
      },
    });

  } catch (error) {
    console.error('Error al obtener informe semanal:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe semanal' });
  }
});










// Endpoint para obtener informe mensual
router.post('/informe-mensual', async (req, res) => {
  try {
    const { mes, año, id_usuario } = req.body;

    // Verificar que mes y año sean valores válidos
    if (mes < 1 || mes > 12 || año < 1900) {
      return res.status(400).json({ error: 'Mes o año inválido' });
    }

    // Calcular las fechas de inicio y fin del mes
    const primerDiaMes = new Date(año, mes - 1, 1);
    const ultimoDiaMes = new Date(año, mes, 0);

    // Realizar una consulta para obtener las actividades en el rango de fechas y del usuario específico
    const actividadesMes = await Actividad.find({
      fecha_registro: {
        $gte: primerDiaMes.toISOString().split('T')[0], // Convertir a formato YYYY-MM-DD
        $lte: ultimoDiaMes.toISOString().split('T')[0],
      },
      usuario: id_usuario, // Agregar esta condición para filtrar por usuario
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

    // Calcular la ganancia por proyecto y los ingresos totales
    const gananciaPorProyecto = actividadesMes.reduce((result, actividad) => {
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
    const ingresosTotales = actividadesMes.reduce((total, actividad) => {
      total += actividad.total_tarifa || 0;
      return total;
    }, 0);

    // Redondear los ingresos totales a dos decimales
    const ingresosTotalesDosDecimales = parseFloat(ingresosTotales.toFixed(2));

    // Obtener información del usuario
    const usuario = await Usuario.findById(id_usuario).select('nombre apellido email cargo empresa num_tel').exec();

    // Resto del código para procesar y enviar la respuesta

    res.status(200).json({
      informeMensual: {
        rango_fechas: {
          inicio: primerDiaMes.toISOString().split('T')[0],
          fin: ultimoDiaMes.toISOString().split('T')[0],
        },
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          empresa:usuario.empresa,
          cargo:usuario.cargo,
          num_tel:usuario.num_tel,
        },
        actividades: actividadesMes.map(actividad => ({
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
    console.error('Error al obtener informe mensual:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe mensual' });
  }
});



module.exports = router;
