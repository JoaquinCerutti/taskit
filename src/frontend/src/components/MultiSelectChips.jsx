'use client';

import { useEffect, useState } from 'react';

/**
 * items: [{ id:number, label:string }]
 * value: number[]
 * onChange: (ids:number[]) => void
 * label: string
 * includeAll: agrega chip "Todos"
 */
export default function MultiSelectChips({
  items = [],
  value = [],
  onChange,
  label = '',
  includeAll = true
}) {
  const [selected, setSelected] = useState(value);
  useEffect(() => setSelected(value ?? []), [value]);

  const allId = -1;

  const toggle = (id) => {
    if (includeAll && id === allId) {
      // seleccionar o deseleccionar todo
      if (selected.length === items.length) {
        setSelected([]);
        onChange?.([]);
      } else {
        const all = items.map(i => i.id);
        setSelected(all);
        onChange?.(all);
      }
      return;
    }

    const isSelected = selected.includes(id);
    const next = isSelected ? selected.filter(x => x !== id) : [...selected, id];

    setSelected(next);
    onChange?.(next);
  };

  const isAllActive = includeAll && items.length > 0 && selected.length === items.length;

  const clsOn  = 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm';
  const clsOff = 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50';

  return (
    <div>
      {label && <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>}
      <div className="flex flex-wrap gap-2">
        {includeAll && (
          <button
            type="button"
            onClick={() => toggle(allId)}
            className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition ${isAllActive ? clsOn : clsOff}`}
          >
            Todos
          </button>
        )}
        {items.map(item => {
          const active = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition ${active ? clsOn : clsOff}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
