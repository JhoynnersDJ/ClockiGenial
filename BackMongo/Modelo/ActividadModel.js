const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  nombre_actividad: {
    type: String,
    required: true
  },
  completado: {
    type: Boolean,
    default: false
  },
  duracion_total: {
    type: Number,
    required: true
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto'
  },
  tarifa: {
    type: Number,
    required: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  hora_registro: {
    type: String,
    required: true
  },
  total_tarifa: {
    type: Number,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

const Actividad = mongoose.model('Actividad', actividadSchema);

module.exports = Actividad;