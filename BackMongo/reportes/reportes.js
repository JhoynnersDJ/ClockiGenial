const express = require('express');
const router = express.Router();
const Actividad = require('../Modelo/ActividadModel');
// Obtener actividades diarias
router.get('/informe-diario/:fecha', async (req, res) => {
  try {
    const fecha = req.params.fecha;
    console.log(fecha);
    // Obtener actividades para la fecha específica
    const actividadesDiarias = await Actividad.find({
      fecha_registro: fecha,
    });

    // Puedes realizar cálculos adicionales o formatear los resultados según sea necesario

    res.status(200).json({ actividadesDiarias });
  } catch (error) {
    console.error('Error al obtener informe diario:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el informe diario' });
  }
});

// Otras rutas para informes semanales y mensuales

module.exports = router;
