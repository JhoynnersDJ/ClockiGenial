const express = require('express');
const router = express.Router();
const { collection, doc, addDoc, getDoc, query, where, getDocs, updateDoc} = require('firebase/firestore'); // Ajusta las importaciones según tu versión
const {db} = require ('../database/firebase');

// Ruta para registrar una actividad y su tiempo
router.post('/registro-actividad', async (req, res) => {
  try {
    const { nombre_actividad, id_proyecto, id_usuario, horas, minutos, segundos, tarifa } = req.body;

    // Obtiene la fecha actual en formato "DD/MM/AA"
    const fechaRegistro = new Date().toLocaleDateString('es-ES');

    // 1. Crea un nuevo documento en la colección de actividades
    const actividadesRef = collection(db, 'actividades');
    const actividadData = {
      nombre_actividad: nombre_actividad,
      proyecto: id_proyecto ? doc(db, 'proyectos', id_proyecto) : null,
      usuario: doc(db, 'usuarios', id_usuario),
      duracion_total: {
        horas: horas,
        minutos: minutos,
        segundos: segundos,
      },  // Duración total inicial
      tarifa: tarifa !== undefined ? tarifa : null, // Si tarifa no está presente, se establece como null
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

// Ruta para actualizar una actividad
router.post('/actualizar-actividad', async (req, res) => {
  try {
    const { id_actividad, horas, minutos, segundos } = req.body;

    // Crea un nuevo registro de tiempo
    const registroTiempoRef = collection(db, 'registro_tiempo');
    const tiempoData = {
      actividad: doc(db, 'actividades', id_actividad), // Referencia a la actividad
      duracion: {
        horas: horas,
        minutos: minutos,
        segundos: segundos,
      }, // Duración de la actividad en formato de objeto
      fecha: new Date().toLocaleDateString('es-ES'), // Fecha en formato DD/MM/AA
    };

    // Guarda el registro de tiempo en Firestore
    await addDoc(registroTiempoRef, tiempoData);

    // Actualiza la duración total
    const registroTiempoQuery = query(registroTiempoRef, where('actividad', '==', doc(db, 'actividades', id_actividad)));
    const registroTiempoSnapshot = await getDocs(registroTiempoQuery);

    let totalHoras = 0;
    let totalMinutos = 0;
    let totalSegundos = 0;

    registroTiempoSnapshot.forEach((doc) => {
      const tiempo = doc.data().duracion;
      totalHoras += tiempo.horas;
      totalMinutos += tiempo.minutos;
      totalSegundos += tiempo.segundos;
    });

    // Ajusta los minutos y segundos si superan 60
    totalMinutos += Math.floor(totalSegundos / 60);
    totalSegundos = totalSegundos % 60;
    totalHoras += Math.floor(totalMinutos / 60);
    totalMinutos = totalMinutos % 60;

    // Actualiza el campo 'duracion_total' en la actividad
    await updateDoc(doc(db, 'actividades', id_actividad), {
      duracion_total: {
        horas: totalHoras,
        minutos: totalMinutos,
        segundos: totalSegundos,
      },
    });

    res.status(201).json({ message: 'Registro de tiempo y duración actualizados con éxito' });
  } catch (error) {
    console.error('Error al actualizar actividad y tiempo:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar actividad y tiempo' });
  }
});

module.exports = router;


