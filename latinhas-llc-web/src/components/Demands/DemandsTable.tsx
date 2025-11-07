import { useState } from "react"
import { DemandRow } from "./DemandRow"
import type { Demand } from "@/types/demandTypes"

interface DemandsTableProps {
  demands: Demand[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DemandsTable({ demands, onEdit, onDelete }: DemandsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const totalItems = demands.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = demands.slice(startIndex, endIndex)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-300">
          <tr className="text-xs font-semibold uppercase text-gray-500">
            <th className="py-3 px-4 text-center">Editar</th>
            <th className="py-3 px-4 text-center">Período</th>
            <th className="py-3 px-4 text-center">SKUs</th>
            <th className="py-3 px-4 text-center">Total Planejado(Tons)</th>
            <th className="py-3 px-4 text-center">Total Produzido(Tons)</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-center">Remover</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {currentItems.length > 0 ? (
            currentItems.map((demand) => (
              <DemandRow
                key={demand.id}
                demand={demand}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                Nenhuma demanda cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      
      <div className="flex items-center justify-end mt-4 gap-2 px-4 mb-2">
        <span className="text-gray-600 text-sm">
          {startIndex + 1} - {endIndex} of {totalItems}
        </span>

        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          &lt;
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  )
}
