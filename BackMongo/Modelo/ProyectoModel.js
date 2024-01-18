const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre_proyecto: String,
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  descripcion: String,
  categoria: Number,
  fecha_proyecto: String,
  hora_proyecto: String,
  completado: { type: Boolean, default: false },
  contador: { type: Number, default: 0 }, // Campo contador inicializado en 0
});

const Proyecto = mongoose.model('Proyecto', ProyectoSchema);

module.exports = Proyecto;