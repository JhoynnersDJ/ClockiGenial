const express = require('express');
const router = express.Router();
const { collection, doc, addDoc, getDoc} = require('firebase/firestore');
const {db} = require ('../database/firebase');

//registrar un proyecto
router.post('/registro-proyecto', async (req, res) => {
    try {
      const { nombre_proyecto, id_cliente, id_actividad } = req.body;
  
      // Verifica si la actividad existe antes de continuar
      const actividadRef = doc(db, 'actividades', id_actividad);
      const actividadSnapshot = await getDoc(actividadRef);
  
      if (!actividadSnapshot.exists()) {
        res.status(404).json({ error: 'La actividad no existe' });
        return;
      }
  
      // Crea un nuevo documento en la colección "proyectos"
      const proyectosRef = collection(db, 'proyectos');
  
      // Define los datos del proyecto
      const proyectoData = {
        nombre_proyecto: nombre_proyecto,
        cliente: id_cliente ? doc(db, 'clientes', id_cliente) : null, // Referencia al cliente (puede ser nulo)
        actividad: actividadRef, // Referencia a la actividad (obligatorio)
      };
  
      // Guarda el proyecto en Firestore
      const nuevoProyectoRef = await addDoc(proyectosRef, proyectoData);
  
      res.status(201).json({ message: 'Proyecto registrado con éxito', proyectoId: nuevoProyectoRef.id });
    } catch (error) {
      console.error('Error al registrar proyecto:', error);
      res.status(500).json({ error: 'Ocurrió un error al registrar proyecto' });
    }
  });
  
  module.exports = router;
