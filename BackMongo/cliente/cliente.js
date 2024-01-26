const express = require('express');
const router = express.Router();
const Cliente = require('../Modelo/ClienteModel');
const Usuario = require('../Modelo/UsuarioModel');

router.post('/registro-cliente', async (req, res) => {
  try {
    const { nombre_cliente, id_usuario, descripcion_cliente, cargo_cliente, email_cliente, tel_cliente } = req.body;

    // Verifica si el usuario existe antes de continuar
    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Crea un nuevo documento en la colección "clientes"
    const nuevoClienteData = {
      nombre_cliente,
      usuario: id_usuario,
      descripcion_cliente,
      cargo_cliente: cargo_cliente !== undefined ? cargo_cliente : null,
      email_cliente: email_cliente || null, // Asegura que sea nulo si no se proporciona
      tel_cliente: tel_cliente || null, // Asegura que sea nulo si no se proporciona
    };

    const nuevoCliente = new Cliente(nuevoClienteData);

    // Guarda el cliente en MongoDB
    await nuevoCliente.save();

    res.status(201).json({ message: 'Cliente registrado con éxito', clienteId: nuevoCliente._id });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar cliente' });
  }
});



// Endpoint para borrar un cliente por su ID
router.delete('/eliminar-cliente/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params;

    // Borrar el cliente por su ID
    const resultado = await Cliente.findByIdAndDelete(id_cliente);

    if (resultado) {
      res.status(200).json({ message: 'Cliente borrado correctamente' });
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al borrar cliente:', error);
    res.status(500).json({ error: 'Ocurrió un error al borrar el cliente' });
  }
});

// Endpoint para obtener todos los clientes de un usuario
router.post('/lista-cliente', async (req, res) => {
  try {
    const { id_usuario } = req.body;

    // Verifica si el usuario existe antes de continuar
    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Busca todos los clientes asociados al usuario
    const clientes = await Cliente.find({ usuario: id_usuario });

    res.status(200).json({ clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener clientes' });
  }
});

// Endpoint para actualizar clientes
router.put('/editar-cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_cliente, descripcion_cliente, cargo_cliente, email_cliente, tel_cliente } = req.body;

    // Verifica si el cliente existe antes de continuar
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ error: 'El cliente no existe' });
    }

    // Actualiza los campos del cliente, excluyendo id_usuario
    cliente.nombre_cliente = nombre_cliente || cliente.nombre_cliente;
    cliente.descripcion_cliente = descripcion_cliente || cliente.descripcion_cliente;
    cliente.cargo_cliente = cargo_cliente !== undefined ? cargo_cliente : cliente.cargo_cliente;
    cliente.email_cliente = email_cliente || null; // Asegura que sea nulo si no se proporciona
    cliente.tel_cliente = tel_cliente || null; // Asegura que sea nulo si no se proporciona

    // Guarda los cambios en MongoDB
    await cliente.save();

    res.status(200).json({ message: 'Cliente actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar cliente' });
  }
});


module.exports = router;
