const mongoose = require('mongoose');

// Modelo para la colección "RegistroTiempo"
const RegistroTiempoSchema = new mongoose.Schema({
    actividad: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad', required: true },
    duracion: {
      horas: Number,
      minutos: Number,
      segundos: Number,
    },
    fecha: String,
    costo_intervalo: Number,
  });
  
  
  const RegistroTiempo = mongoose.model('RegistroTiempo', RegistroTiempoSchema);
  
  module.exports = RegistroTiempo;