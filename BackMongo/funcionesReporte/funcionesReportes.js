

async function calcularInformacionReporte(actividades) {
    // Calcular la ganancia total por proyecto
    const gananciaPorProyecto = actividades.reduce((result, actividad) => {
      const proyectoId = actividad.proyecto._id.toString(); // Convertir a cadena para comparar
      if (!result[proyectoId]) {
        result[proyectoId] = {
          proyecto: actividad.proyecto.nombre_proyecto,
          gananciaTotal: 0,
        };
      }
      result[proyectoId].gananciaTotal += actividad.total_tarifa || 0;
      result[proyectoId].gananciaTotal = parseFloat(result[proyectoId].gananciaTotal.toFixed(2)); // Redondear a dos decimales
  
      return result;
    }, {});
  
    // Calcular los ingresos totales del usuario
    const ingresosTotales = actividades.reduce((total, actividad) => {
      total += actividad.total_tarifa || 0;
      return total;
    }, 0);
  
    // Redondear los ingresos totales a dos decimales
    const ingresosTotalesDosDecimales = parseFloat(ingresosTotales.toFixed(2));
  
    return { gananciaPorProyecto, ingresosTotales: ingresosTotalesDosDecimales };
  }
  
  
  module.exports = {
    calcularInformacionReporte,
  };
  