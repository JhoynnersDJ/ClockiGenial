const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre_proyecto: String,
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  descripcion: String,
  categoria: Number,
  fecha_proyecto: String,
  hora_proyecto: String,
});

const Proyecto = mongoose.model('Proyecto', ProyectoSchema);

module.exports = Proyecto;