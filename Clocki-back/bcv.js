const { getMonitor } = require('consulta-dolar-venezuela');

async function obtenerPrecioBCV() {
  try {
    const respuesta = await getMonitor('BCV', 'price', false);
    
    const precioBCV = respuesta.bcv.price;
    console.log(precioBCV);
    return precioBCV;
    
  } catch (error) {
    throw error;
  }
}

module.exports = { obtenerPrecioBCV };