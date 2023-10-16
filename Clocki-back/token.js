function generarCodigoRecuperacion(longitud) {
    let codigo = '';
    for (let i = 0; i < longitud; i++) {
      const digito = Math.floor(Math.random() * 10); // Genera un dígito aleatorio del 0 al 9
      codigo += digito;
    }
    return codigo;
  }
  
  module.exports = { generarCodigoRecuperacion };