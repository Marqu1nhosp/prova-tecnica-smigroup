export type DemandStatus = "PLANEJAMENTO" | "EM_ANDAMENTO" | "CONCLUIDO"

export interface DemandItem {
    plannedProduced: number
    id: string
    sku: string
    description?: string
    plannedTotal: number
    demandId: string
    createdAt: string
}

export interface CreateDemandItemPayload {
    sku: string
    description?: string
    plannedTotal: number
    demandId: string
}

export interface Demand {
  data: any
  id: string
  sku: string
  startDate: string 
  endDate: string
  plannedTotal: number
  plannedProduced: number 
  status: DemandStatus
  items: DemandItem[]
}

export interface CreateDemandPayload {
  startDate: string
  endDate: string
}

export interface EditDemandItemPayload {
  demandId: string
  description?: string
  plannedTotal?: number
  plannedProduced ?: number
}

export interface EditDemandPayload {
  startDate: string
  endDate: string
  plannedTotal: number
  plannedProduced: number 
  status: DemandStatus
}