const mongoose = require('mongoose');

// Modelo para la colección "Actividades"
const ActividadSchema = new mongoose.Schema({
  nombre_actividad: String,
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', default: null },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
  duracion_total: {
    horas: Number,
    minutos: Number,
    segundos: Number,
  },
  tarifa: Number,
  completado: Boolean,
  fecha_registro: String,
  hora_registro: String,
  costo_intervalo: Number,
  total_tarifa: Number,
});

const Actividad = mongoose.model('Actividad', ActividadSchema);

module.exports = Actividad;