async function calcularInformacionReporte(actividades) {
  // Calcular la ganancia total por proyecto
  const gananciaPorProyectoArray = actividades.reduce((result, actividad) => {
      const proyectoId = actividad.proyecto._id.toString(); // Convertir a cadena para comparar
      const proyecto = {
          proyecto: actividad.proyecto.nombre_proyecto,
          gananciaTotal: parseFloat((actividad.total_tarifa || 0).toFixed(2)),
      };
      result.push(proyecto);
      return result;
  }, []);

  // Calcular los ingresos totales del usuario
  const ingresosTotales = actividades.reduce((total, actividad) => {
      total += actividad.total_tarifa || 0;
      return total;
  }, 0);

  // Redondear los ingresos totales a dos decimales
  const ingresosTotalesDosDecimales = parseFloat(ingresosTotales.toFixed(2));

  return { gananciaPorProyecto: gananciaPorProyectoArray, ingresosTotales: ingresosTotalesDosDecimales };
}

module.exports = {
  calcularInformacionReporte,
};
