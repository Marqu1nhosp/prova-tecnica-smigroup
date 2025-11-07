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
  const { totalPlanned, totalProduced } = (demand.items ?? []).reduce(
  (acc, item) => ({
    totalPlanned: acc.totalPlanned + Number(item.plannedTotal ?? 0),
    totalProduced: acc.totalProduced + Number(item.plannedProduced ?? 0),
  }),
  { totalPlanned: 0, totalProduced: 0 }
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

  let tdBgClass = ''
  switch (status) {
    case 'PLANEJAMENTO':
      tdBgClass = 'bg-pink-100'
      break
    case 'EM_ANDAMENTO':
      tdBgClass = 'bg-cyan-100'
      break
    case 'CONCLUIDO':
      tdBgClass = 'bg-green-100'
      break
    default:
      tdBgClass = 'bg-gray-100'
  }

  return (
    <tr className="text-sm text-gray-700 hover:bg-gray-50">
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onEdit(demand.id)}
          className="text-blue-600 hover:text-blue-800"
          title="Editar Demanda"
        >
          <SquarePen />
        </button>
      </td>


      <td className="py-3 px-4 text-center whitespace-nowrap">
        {formatDate(demand.startDate, demand.endDate)}
      </td>

      <td className="py-3 px-4 text-center">{demand.items.length}</td>


      <td className="py-3 px-4 text-center">{Number(totalPlanned || 0).toLocaleString('pt-BR')}</td>
      <td className="py-3 px-4 text-center">{Number(totalProduced || 0).toLocaleString('pt-BR')}</td>


      <td className={`py-3 px-4 text-center ${tdBgClass}`}>
        <StatusBadge status={status} />
      </td>

      <td className="py-3 px-4 text-center">
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
