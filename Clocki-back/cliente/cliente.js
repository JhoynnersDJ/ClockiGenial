const express = require('express');
const router = express.Router();
const { collection, addDoc, doc} = require('firebase/firestore'); // Ajusta las importaciones según tu versión
const {db} = require ('../database/firebase');

// Ruta para registrar un cliente
router.post('/registro-cliente', async (req, res) => {
    try {
      const { nombre_cliente, id_proyecto } = req.body;
  
      // Crea un nuevo documento en la colección "clientes"
      const clientesRef = collection(db, 'clientes');
  
      // Define los datos del cliente
      const clienteData = {
        nombre_cliente: nombre_cliente,
        proyecto: proyectoRef = doc(db, 'proyectos', id_proyecto) // Referencia al proyecto
      };
  
      // Guarda el cliente en Firestore
      const nuevoClienteRef = await addDoc(clientesRef, clienteData);
  
      res.status(201).json({ message: 'Cliente registrado con éxito', clienteId: nuevoClienteRef.id });
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      res.status(500).json({ error: 'Ocurrió un error al registrar cliente' });
    }
  });
  
  module.exports = router;