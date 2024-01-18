const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre_cliente: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  descripcion_cliente:String,
  cargo_cliente:String,
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;