import { SquarePen, Trash } from 'lucide-react'
import type { Demand } from '@/types/demandTypes'
import { formatDate } from '../../utils/formatDate'
import { StatusBadge } from './StatusBadge'

interface DemandRowProps {
  demand: Demand
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DemandRow({ demand, onEdit, onDelete }: DemandRowProps) {
  // Soma todos os plannedTotal e plannedProduced dos itens
  const totalPlanned = (demand.items ?? []).reduce(
    (acc, item) => acc + (item.plannedTotal ? Number(item.plannedTotal) : 0),
    0
  );

  const totalProduced = (demand.items ?? []).reduce(
    (acc, item) => acc + (item.plannedProduced ? Number(item.plannedProduced) : 0),
    0
  );

  // Define status dinamicamente
  let status: Demand['status']
  if (totalProduced === 0) {
    status = 'PLANEJAMENTO'
  } else if (totalProduced >= totalPlanned) {
    status = 'CONCLUIDO'
  } else {
    status = 'EM_ANDAMENTO'
  }

  return (
    <tr className="text-sm text-gray-700 hover:bg-gray-50">
      <td className="py-3 px-4">
        <button
          onClick={() => onEdit(demand.id)}
          className="text-blue-600 hover:text-blue-800"
          title="Editar Demanda"
        >
          <SquarePen />
        </button>
      </td>

      
      <td className="py-3 px-4 whitespace-nowrap">
        {formatDate(demand.startDate, demand.endDate)}
      </td>

      <td className="py-3 px-4">{demand.items.length}</td>

  
      <td className="py-3 px-4">{Number(totalPlanned || 0).toLocaleString('pt-BR')}</td>
      <td className="py-3 px-4">{Number(totalProduced || 0).toLocaleString('pt-BR')}</td>


      <td className="py-3 px-4">
        <StatusBadge status={status} />
      </td>

      <td className="py-3 px-4">
        <button
          onClick={() => onDelete(demand.id)}
          className="text-orange-600 hover:text-orange-800"
          title="Remover Demanda"
        >
          <Trash />
        </button>
      </td>
    </tr>
  )
}
