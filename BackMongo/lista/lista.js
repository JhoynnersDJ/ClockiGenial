const express = require('express');
const { obtenerPrecioBCV } = require('../bcv');
const Actividad = require('../Modelo/ActividadModel');
const Proyecto = require('../Modelo/ProyectoModel');
const Cliente = require('../Modelo/ClienteModel');
const Usuario = require('../Modelo/UsuarioModel');
const RegistroTiempo = require('../Modelo/RegistroTiempoModel');

const router = express.Router();

router.get('/lista-tiempo/:id_actividad', async (req, res) => {
  try {
    const { id_actividad } = req.params;

    // Busca los registros de tiempo relacionados con la actividad por su ID
    const registrosTiempo = await RegistroTiempo.find({ actividad: id_actividad });


    const registrosTiempoResponse = registrosTiempo.map((registro) => ({
      id_registro: registro._id,
      nombre_actividad: registro.actividad.nombre_actividad,
      duracion: registro.duracion,
      fecha: registro.fecha,
      costo_intervalo: registro.costo_intervalo !== undefined ? registro.costo_intervalo.toFixed(2) : null,
    }));

    res.status(200).json(registrosTiempoResponse);
  } catch (error) {
    console.error('Error al obtener registros de tiempo:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener registros de tiempo' });
  }
});


// Endpoint que lista las actividades no completadas del usuario
router.get('/actividades-por-usuario-completado/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Obtén el precio del dólar en Bolívares (BS)
    const precioBCV = await obtenerPrecioBCV();

    // Busca las actividades no completadas del usuario por su ID
    const actividadesUsuario = await Actividad.find({ usuario: id_usuario, completado: true });

    const actividades = [];

    for (const actividad of actividadesUsuario) {
      const {
        _id: id_actividad,
        nombre_actividad,
        duracion_total,
        proyecto,
        tarifa,
        completado,
        fecha_registro,
        hora_registro,
        total_tarifa,
      } = actividad;

      // Verifica si total_tarifa y costo_intervalo no son undefined antes de aplicar toFixed(2)
      const total_tarifaDosDecimales = typeof total_tarifa === 'number' ? total_tarifa.toFixed(2) : null;

      let nombre_proyecto = null;
      let categoria = null;
      let nombre_cliente = null;
      let total_tarifa_bs = null; // Agregamos el campo total_tarifa_bs
      if (proyecto) {
        const proyectoDoc = await Proyecto.findById(proyecto);

        if (proyectoDoc) {
          nombre_proyecto = proyectoDoc.nombre_proyecto;
          categoria = proyectoDoc.categoria;

          if (proyectoDoc.cliente) {
            const clienteDoc = await Cliente.findById(proyectoDoc.cliente);
            if (clienteDoc) {
              nombre_cliente = clienteDoc.nombre_cliente;

              // Calcula total_tarifa_bs multiplicando total_tarifa por el precio del BCV
              total_tarifa_bs = total_tarifa * precioBCV;
            }
          }
        }
      }
      const total_tarifaDosDecimales_bs = typeof total_tarifa_bs === 'number' ? total_tarifa_bs.toFixed(2) : null;

      actividades.push({
        id_actividad,
        nombre_actividad,
        duracion_total,
        tarifa,
        fecha_registro,
        hora_registro,
        nombre_proyecto,
        categoria,
        completado,
        total_tarifa: total_tarifaDosDecimales,
        nombre_cliente,
        total_tarifa_bs: total_tarifaDosDecimales_bs
      });
    }

    res.status(200).json({ actividadesCompletadas: actividades });
  } catch (error) {
    console.error('Error al obtener actividades no completadas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener actividades no completadas' });
  }
});





// Endpoint que lista las actividades no completadas del usuario
router.get('/actividades-por-usuario-no-completado/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Obtén el precio del dólar en Bolívares (BS)
    const precioBCV = await obtenerPrecioBCV();

    // Busca las actividades no completadas del usuario por su ID
    const actividadesUsuario = await Actividad.find({ usuario: id_usuario, completado: false });

    const actividades = [];

    for (const actividad of actividadesUsuario) {
      const {
        _id: id_actividad,
        nombre_actividad,
        duracion_total,
        proyecto,
        tarifa,
        completado,
        fecha_registro,
        hora_registro,
        total_tarifa,
      } = actividad;

      // Verifica si total_tarifa y costo_intervalo no son undefined antes de aplicar toFixed(2)
      const total_tarifaDosDecimales = typeof total_tarifa === 'number' ? total_tarifa.toFixed(2) : null;

      let nombre_proyecto = null;
      let categoria = null;
      let nombre_cliente = null;
      let total_tarifa_bs = null; // Agregamos el campo total_tarifa_bs
      if (proyecto) {
        const proyectoDoc = await Proyecto.findById(proyecto);

        if (proyectoDoc) {
          nombre_proyecto = proyectoDoc.nombre_proyecto;
          categoria = proyectoDoc.categoria;

          if (proyectoDoc.cliente) {
            const clienteDoc = await Cliente.findById(proyectoDoc.cliente);
            if (clienteDoc) {
              nombre_cliente = clienteDoc.nombre_cliente;

              // Calcula total_tarifa_bs multiplicando total_tarifa por el precio del BCV
              total_tarifa_bs = total_tarifa * precioBCV;
            }
          }
        }
      }
      const total_tarifaDosDecimales_bs = typeof total_tarifa_bs === 'number' ? total_tarifa_bs.toFixed(2) : null;

      actividades.push({
        id_actividad,
        nombre_actividad,
        duracion_total,
        tarifa,
        fecha_registro,
        hora_registro,
        nombre_proyecto,
        categoria,
        completado,
        total_tarifa: total_tarifaDosDecimales,
        nombre_cliente,
        total_tarifa_bs: total_tarifaDosDecimales_bs
      });
    }

    res.status(200).json({ actividadesNoCompletadas: actividades });
  } catch (error) {
    console.error('Error al obtener actividades no completadas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener actividades no completadas' });
  }
});

//endpoint que lista los proyectos de dicho usuario
router.get('/proyectos-por-usuario/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Busca los proyectos del usuario por su ID
    const proyectosUsuario = await Proyecto.find({ usuario: id_usuario });

    const proyectosResponse = [];

    for (const proyecto of proyectosUsuario) {
      const {
        _id,
        nombre_proyecto,
        categoria,
        descripcion,
        cliente,
      } = proyecto;

      let nombre_cliente = null;

      if (cliente) {
        const clienteDoc = await Cliente.findById(cliente);
        if (clienteDoc) {
          nombre_cliente = clienteDoc.nombre_cliente;
        }
      }

      proyectosResponse.push({
        id_proyecto: _id,
        nombre_proyecto,
        categoria,
        descripcion,
        nombre_cliente,
      });
    }

    res.status(200).json({ proyectosUsuario: proyectosResponse });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener proyectos' });
  }
});

//Endpoint que lista los clientes de dicho usuario
router.get('/clientes-por-usuario/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Busca los clientes relacionados con el usuario por su ID
    const clientesUsuario = await Cliente.find({ usuario: id_usuario });

    const clientesResponse = clientesUsuario.map((cliente) => ({
      id_cliente: cliente._id,
      nombre_cliente: cliente.nombre_cliente,
    }));

    res.status(200).json({
      clientesUsuario: clientesResponse,
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener clientes' });
  }
});




// Endpoint para obtener actividades por proyecto
router.get('/actividades-por-proyecto/:id_proyecto', async (req, res) => {
  try {
    const { id_proyecto } = req.params;

    // Busca las actividades del proyecto por su ID
    const actividadesPorProyecto = await Actividad.find({ proyecto: id_proyecto });

    const actividadesResponse = [];

    for (const actividad of actividadesPorProyecto) {
      const {
        _id,
        nombre_actividad,
        duracion_total,
        tarifa,
        fecha_registro,
        hora_registro,
        total_tarifa,
      } = actividad;

      actividadesResponse.push({
        id_actividad: _id,
        nombre_actividad,
        duracion_total,
        tarifa,
        fecha_registro,
        hora_registro,
        total_tarifa,
      });
    }

    res.status(200).json({ actividadesPorProyecto: actividadesResponse });
  } catch (error) {
    console.error('Error al obtener actividades por proyecto:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener actividades por proyecto' });
  }
});

module.exports = router;

