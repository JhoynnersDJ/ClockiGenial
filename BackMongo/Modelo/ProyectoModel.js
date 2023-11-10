const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  nombre_proyecto: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente'
  },
  // Otros campos del proyecto
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;