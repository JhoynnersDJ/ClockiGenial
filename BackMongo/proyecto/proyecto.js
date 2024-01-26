const express = require('express');
const router = express.Router();
const Proyecto = require('../Modelo/ProyectoModel');
const Usuario = require('../Modelo/UsuarioModel');
const mongoose = require('mongoose');
    
router.post('/registro-proyecto', async (req, res) => {
  try {
    const { nombre_proyecto, id_cliente, id_usuario, descripcion, categoria } = req.body;

    // Obtiene la fecha y hora actual
    const fechaHoraActual = new Date();
    const fechaActualISO = fechaHoraActual.toISOString().split('T')[0];  // Formato YYYY-MM-DD
    const horaActual = fechaHoraActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Verifica si el usuario existe antes de continuar
    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Crea un nuevo documento en la colección "proyectos"
    const nuevoProyectoData = {
      nombre_proyecto,
      usuario: id_usuario, // Asumiendo que id_usuario es un ObjectId válido
      descripcion,
      categoria,
      fecha_proyecto: fechaActualISO,
      hora_proyecto: horaActual,
      completado: false,
    };

    // Añade el campo cliente solo si se proporciona
    if (id_cliente) {
      // Verifica si id_cliente es un ObjectId válido
      if (!mongoose.isValidObjectId(id_cliente)) {
        return res.status(400).json({ error: 'ID de cliente no válido' });
      }
      nuevoProyectoData.cliente = id_cliente;
    }

    const nuevoProyecto = new Proyecto(nuevoProyectoData);

    // Guarda el proyecto en MongoDB
    await nuevoProyecto.save();

    res.status(201).json({ message: 'Proyecto registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar proyecto:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar proyecto' });
  }
});

 // Endpoint para marcar una actividad como completada
 router.post('/proyecto-completado', async (req, res) => {
  try {
    const { id_proyecto } = req.body;

    // Busca la actividad por su ID y el ID del usuario
    const proyecto = await Proyecto.findOne({ _id: id_proyecto });

    if (proyecto) {
      // Actualiza el campo 'completado' a true
      proyecto.completado = true;

      // Guarda los cambios
      await proyecto.save();

      res.status(200).json({ message: 'Proyecto marcado como completada correctamente' });
    } else {
      res.status(404).json({ error: 'Proyecto no encontrada para el usuario proporcionado' });
    }
  } catch (error) {
    console.error('Error al marcar el proyecto como completada:', error);
    res.status(500).json({ error: 'Ocurrió un error al marcar el proyecto como completada' });
  }
});


// Endpoint para borrar un proyecto por su ID
router.delete('/eliminar-proyecto/:id_proyecto', async (req, res) => {
  try {
    const { id_proyecto } = req.params;

    // Verificar si id_proyecto es un ObjectId válido
    if (!mongoose.isValidObjectId(id_proyecto)) {
      return res.status(400).json({ error: 'ID de proyecto no válido' });
    }

    // Borrar el proyecto por su ID
    const resultado = await Proyecto.findByIdAndDelete(id_proyecto);

    if (resultado) {
      res.status(200).json({ message: 'Proyecto borrado correctamente' });
    } else {
      res.status(404).json({ error: 'Proyecto no encontrado' });
    }
  } catch (error) {
    console.error('Error al borrar proyecto:', error);
    res.status(500).json({ error: 'Ocurrió un error al borrar el proyecto' });
  }
});

router.put('/editar-proyecto/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtén el ID del proyecto a editar
    const { nombre_proyecto, descripcion, categoria } = req.body;

    // Verifica si el proyecto existe antes de intentar editarlo
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ error: 'El proyecto no existe' });
    }

    // Actualiza los campos permitidos del proyecto
    await Proyecto.findByIdAndUpdate(id, {
      nombre_proyecto,
      descripcion,
      categoria,
    }, { new: true }); // El parámetro { new: true } devuelve el documento actualizado

    res.status(200).json({ message: 'Proyecto actualizado con éxito' });
  } catch (error) {
    console.error('Error al editar proyecto:', error);
    res.status(500).json({ error: 'Ocurrió un error al editar proyecto' });
  }
});

module.exports = router;