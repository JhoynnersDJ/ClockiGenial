const express = require('express');
const router = express.Router();
const Proyecto = require('../Modelo/ProyectoModel');
const Usuario = require('../Modelo/UsuarioModel');

    
router.post('/registro-proyecto', async (req, res) => {
  try {
    const { nombre_proyecto, id_cliente, id_usuario, descripcion, categoria } = req.body;

    // Obtiene la fecha y hora actual
    const fechaHoraActual = new Date();
    const fechaActual = fechaHoraActual.toLocaleDateString('es-ES');
    const horaActual = fechaHoraActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Verifica si la actividad existe antes de continuar
    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Crea un nuevo documento en la colección "proyectos"
    const nuevoProyecto = new Proyecto({
      nombre_proyecto,
      cliente: id_cliente, // Asumiendo que id_cliente es un ObjectId válido
      usuario: id_usuario, // Asumiendo que id_usuario es un ObjectId válido
      descripcion,
      categoria,
      fecha_proyecto: fechaActual,
      hora_proyecto: horaActual,
    });

    // Guarda el proyecto en MongoDB
    await nuevoProyecto.save();

    res.status(201).json({ message: 'Proyecto registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar proyecto:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar proyecto' });
  }
});

module.exports = router;