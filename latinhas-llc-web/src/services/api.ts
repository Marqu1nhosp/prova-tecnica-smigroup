import axios, { AxiosError } from 'axios'
import type { CreateDemandItemPayload, CreateDemandPayload, Demand, DemandItem, EditDemandPayload, EditDemandItemPayload } from '@/types/demandTypes';


export const api = axios.create({
  baseURL: 'http://localhost:3333/',
})

interface ApiFetchResponse {
  demands: Demand[]
}

export async function getAllDemands(): Promise<Demand[]> {
  try {
    const response = await api.get<ApiFetchResponse>('/demands');
    return response.data.demands;

  } catch (error) {
    console.error("Erro ao buscar demandas:", error);

    throw new Error("Falha ao carregar as demandas.");
  }
}


export async function fetchDemands(): Promise<Demand[]> {
  try {
    const response = await api.get<ApiFetchResponse>('/demands');
    return response.data.demands;

  } catch (error) {
    console.error("Erro ao buscar demandas:", error);

    throw new Error("Falha ao carregar as demandas.");
  }
}

export async function deleteDemand(id: string): Promise<void> {
  try {
    await api.delete(`/demands/${id}`);

  } catch (error) {
    console.error(`Erro ao deletar demanda com ID ${id}:`, error);
    throw new Error("Falha ao remover a demanda.");
  }

}

export async function createDemand(data: CreateDemandPayload): Promise<Demand> {
  try {
    const response = await api.post<Demand>('/demands', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || "Falha ao salvar a nova demanda."
      console.error("Erro ao criar demanda:", message)
      throw new Error(message)
    }

    console.error("Erro desconhecido ao criar demanda:", error)
    throw new Error("Falha ao salvar a nova demanda.")
  }
}


export async function updateDemand(id: string, data: EditDemandPayload): Promise<Demand> {
  try {
    const response = await api.patch<Demand>(`/demands/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Erro ao atualizar demanda com ID ${id}:`, error)
    throw new Error("Falha ao atualizar a demanda.")
  }
}

export async function createDemandItem(demandId: string, data: CreateDemandItemPayload): Promise<DemandItem> {
  try {
    const response = await api.post<DemandItem>('/items', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || "Falha ao adicionar o novo item à demanda."
      console.error(`Erro ao criar item para a demanda ${demandId}:`, message)
      throw new Error(message)
    }
    console.error(`Erro desconhecido ao criar item para a demanda ${demandId}:`, error)
    throw new Error("Falha ao adicionar o novo item à demanda.")
  }
}

export async function deleteDemandItem(id: string) {
  try {
    await api.delete(`/items/${id}`);

  } catch (error) {
    console.error(`Erro ao deletar demanda com ID ${id}:`, error);
    throw new Error("Falha ao remover a demanda.");
  }
}

export async function updateDemandItem(id: string, data: EditDemandItemPayload): Promise<Demand> {
  try {
    const response = await api.patch<Demand>(`/items/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Erro ao atualizar demanda com ID ${id}:`, error)
    throw new Error("Falha ao atualizar a demanda.")
  }
}
