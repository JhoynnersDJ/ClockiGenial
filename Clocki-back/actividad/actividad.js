const express = require('express');
const router = express.Router();
const { collection, doc, addDoc, getDoc} = require('firebase/firestore'); // Ajusta las importaciones según tu versión
const {db} = require ('../database/firebase');

// Ruta para registrar una actividad y su tiempo
router.post('/registro-actividad', async (req, res) => {
  try {
    const { nombre_actividad, id_proyecto, id_usuario, horas, minutos, segundos } = req.body;

    // Obtiene la fecha actual en formato "DD/MM/AA"
    const fechaRegistro = new Date().toLocaleDateString('es-ES');

    // 1. Crea un nuevo documento en la colección de actividades
    const actividadesRef = collection(db, 'actividades');
    const actividadData = {
      nombre_actividad: nombre_actividad,
      proyecto: id_proyecto ? doc(db, 'proyectos', id_proyecto) : null,
      usuario: doc(db, 'usuarios', id_usuario),
    };

    // Guarda la actividad en Firestore y obtén su ID
    const nuevaActividadRef = await addDoc(actividadesRef, actividadData);
    const actividadId = nuevaActividadRef.id;

    // 2. Crea un nuevo documento en la colección de registro de tiempo
    const registroTiempoRef = collection(db, 'registro_tiempo');
    const tiempoData = {
      actividad: doc(db, 'actividades', actividadId), // Referencia a la actividad
      duracion: {
        horas: horas,
        minutos: minutos,
        segundos: segundos,
      }, // Duración de la actividad en formato de objeto
      fecha: fechaRegistro, // Fecha en formato DD/MM/AA
      nombre_actividad: nombre_actividad, // Nombre de la actividad
    };

    // Guarda el registro de tiempo en Firestore
    await addDoc(registroTiempoRef, tiempoData);

    res.status(201).json({ message: 'Actividad y tiempo registrados con éxito' });
  } catch (error) {
    console.error('Error al registrar actividad y tiempo:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar actividad y tiempo' });
  }
});

module.exports = router;