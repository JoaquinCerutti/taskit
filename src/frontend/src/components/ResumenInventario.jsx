'use client';

import {
  Layers,
  Package,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function ResumenInventario({ insumos }) {
  // Calcular categorías únicas utilizadas en los insumos
  const categoriasUnicasUsadas = Array.from(
    new Set(insumos.map(i => i.categoria?.nombre).filter(Boolean))
  );

  // Calcular métricas generales
  const totalItems = insumos.reduce((acc, i) => acc + i.cantidad, 0);
  const costoTotal = insumos.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0);
  const stockBajo = insumos.filter(i => i.cantidad < (i.stockMinimo || 10)).length;

  const formatearNumero = (n) => n.toLocaleString('es-AR');

  // Tarjetas resumen
  const tarjetas = [
    {
      titulo: 'Categorías',
      valor: categoriasUnicasUsadas.length,
      icono: <Layers className="text-blue-500" />,
      fondo: 'bg-blue-100',
    },
    {
      titulo: 'Items totales',
      valor: formatearNumero(totalItems),
      icono: <Package className="text-green-600" />,
      fondo: 'bg-green-100',
    },
    {
      titulo: 'Costo total',
      valor: `$${formatearNumero(costoTotal)}`,
      icono: <DollarSign className="text-purple-600" />,
      fondo: 'bg-purple-100',
    },
    {
      titulo: 'Productos con stock bajo',
      valor: stockBajo,
      icono: <AlertCircle className="text-yellow-600" />,
      fondo: 'bg-yellow-100',
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tarjetas.map((t, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-full ${t.fondo}`}>
              {t.icono}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{t.valor}</h3>
              <p className="text-gray-500 text-sm">{t.titulo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
