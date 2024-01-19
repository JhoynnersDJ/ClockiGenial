const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre_cliente: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  descripcion_cliente: String,
  cargo_cliente: String,
  email_cliente: { type: String, default: null }, // Campo opcional de email_cliente
  tel_cliente: { type: String, default: null }, // Campo opcional de tel_cliente
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;
