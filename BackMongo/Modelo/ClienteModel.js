const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre_cliente: {
    type: String,
    required: true
  },
  // Otros campos del cliente
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;