// src/utils/fecha.js
export function tiempoRelativo(fechaISO) {
  if (!fechaISO) return '';
  const ahora = new Date();
  const fecha = new Date(fechaISO);
  const diffMs = ahora - fecha;

  const min = Math.floor(diffMs / (1000 * 60));
  if (min < 1) return 'Hace instantes';
  if (min < 60) return `Hace ${min} minuto${min === 1 ? '' : 's'}`;

  const horas = Math.floor(min / 60);
  if (horas < 24) return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;

  const dias = Math.floor(horas / 24);
  return `Hace ${dias} día${dias === 1 ? '' : 's'}`;
}

export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
