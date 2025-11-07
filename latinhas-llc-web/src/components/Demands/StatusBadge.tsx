import type { DemandStatus } from "@/types/demandTypes"

interface StatusBadgeProps {
  status: DemandStatus
}

function formatStatus(status: DemandStatus): string {
  switch (status) {
    case 'PLANEJAMENTO':
      return 'PLANEJAMENTO'
    case 'EM_ANDAMENTO':
      return 'EM ANDAMENTO' 
    case 'CONCLUIDO':
      return 'CONCLUÍDO' 
    default:
      return status
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorClasses = ''

  switch (status) {
    case 'PLANEJAMENTO':
      colorClasses = 'bg-pink-100 text-pink-700'
      break
    
    case 'EM_ANDAMENTO': 
      colorClasses = 'bg-cyan-100 text-cyan-700'
      break

    case 'CONCLUIDO':
      colorClasses = 'bg-green-100 text-green-700'
      break

    default:
      colorClasses = 'bg-gray-100 text-gray-700'
  }

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium 
        ${colorClasses}
      `}
    >
      {formatStatus(status)}
    </span>
  )
}