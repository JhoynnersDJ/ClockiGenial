const express = require('express');
const router = express.Router();
const Cliente = require('../Modelo/ClienteModel');
const Usuario = require('../Modelo/UsuarioModel');

router.post('/registro-cliente', async (req, res) => {
  try {
    const { nombre_cliente, id_usuario, descripcion } = req.body;

    // Verifica si el usuario existe antes de continuar
    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Crea un nuevo documento en la colección "clientes"
    const nuevoCliente = new Cliente({
      nombre_cliente,
      usuario: id_usuario, // Asumiendo que id_usuario es un ObjectId válido
      descripcion,
    });

    // Guarda el cliente en MongoDB
    await nuevoCliente.save();

    res.status(201).json({ message: 'Cliente registrado con éxito', clienteId: nuevoCliente._id });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar cliente' });
  }
});

module.exports = router;
