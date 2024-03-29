const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    default: null
  },
  num_tel: {
    type: String,
    default: null
  },
  departamento: {
    type: String,
    default: null
  },
  empresa: {
    type: String,
    default: null
  },
  verificado: {
    type: Boolean,
    default: false
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  token_recuperacion: {
    type: String
  },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol'
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;