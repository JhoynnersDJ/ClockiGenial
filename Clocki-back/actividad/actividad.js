const express = require('express');
const router = express.Router();
const { db, collection, doc, addDoc} = require('firebase/firestore'); // Ajusta las importaciones según tu versión

// Ruta para registrar una actividad
router.post('/registro-actividad', async (req, res) => {
  try {
    const { nombre_actividad, id_proyecto, id_usuario } = req.body;

    // Crea un nuevo documento en la colección "actividades"
    const actividadesRef = collection(db, 'actividades');

    // Define los datos de la actividad
    const actividadData = {
      nombre_actividad: nombre_actividad,
      proyecto: id_proyecto ? doc(db, 'proyectos', id_proyecto) : null, //referencia al proyecto
      usuario: doc(db, 'usuarios', id_usuario), //referencia al usuario
    };

    // Guarda la actividad en Firestore
    const nuevaActividadRef = await addDoc(actividadesRef, actividadData);

    res.status(201).json({ message: 'Actividad registrada con éxito', actividadId: nuevaActividadRef.id });
  } catch (error) {
    console.error('Error al registrar actividad:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar actividad' });
  }
});

module.exports = router;
