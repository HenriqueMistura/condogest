import React from 'react';

export interface Column<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id?: string | number }>({ columns, data, emptyMessage = 'Nenhum registro encontrado.' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full text-center py-8 text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || index} className="px-6 py-3 font-semibold">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id ?? index} className="border-b border-slate-100 hover:bg-slate-50 even:bg-slate-50/50">
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
