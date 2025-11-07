import { fetchDemands, deleteDemand } from '../services/api'
import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import type { Demand } from '@/types/demandTypes'
import { DemandsTable } from '../components/Demands/DemandsTable'
import { Plus } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { DemandModalCreate } from '../components/Demands/DemandModalCreate'
import { DemandModalEdit } from '@/components/Demands/DemandModalEdit'
import { Footer } from '@/components/Footer'


export function DemandsPage() {
  const [demands, setDemands] = useState<Demand[]>([])
  const [isAddModalOpenCreate, setIsAddModalOpenCreate] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null)

  // Carrega as demandas ao montar
  async function loadDemands() {
    try {
      const data = await fetchDemands()
      setDemands(data)
    } catch (error) {
      console.error("Erro ao carregar demandas:", error)
    }
  }

  useEffect(() => {
    loadDemands()
  }, [])

  // Editar demanda
  function handleEdit(id: string) {
    const demandToEdit = demands.find(demand => demand.id === id)
    if (!demandToEdit) return

    setSelectedDemand(demandToEdit)
    setIsEditModalOpen(true)
  }

  // Atualiza uma demanda editada
  function handleDemandUpdated(updatedDemand: Demand) {
    setDemands(prev =>
      prev.map(demand => (demand.id === updatedDemand.id ? updatedDemand : demand))
    )
  }

  // Adiciona nova demanda sem precisar dar F5
  async function handleDemandCreated(newDemand: Demand) {
    // se quiser recarregar a lista completa:
    // await loadDemands()

    // ou apenas adiciona a nova demanda manualmente:
    setDemands(prevDemands => [newDemand, ...prevDemands])
    toast.success(" Demanda criada com sucesso!")
  }

  // Deleta demanda
  async function handleDelete(id: string) {
    try {
      await deleteDemand(id)
      setDemands(prevDemands => prevDemands.filter(demand => demand.id !== id))
      toast.error("Demanda deletada.")
    } catch (err) {
      console.error("Erro ao deletar demanda:", err)
      toast.error("Não foi possível remover a demanda.")
    }
  }

  // Abre modal de criação
  function handleAdd() {
    setIsAddModalOpenCreate(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          DEMANDAS DE PRODUÇÃO DE LATINHAS
        </h2>

        <Toaster richColors />

        <div className="mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus size={20} />
            <span className="ml-2 font-normal">ADICIONAR</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DemandsTable
            demands={demands}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <DemandModalCreate
        isOpen={isAddModalOpenCreate}
        onClose={() => setIsAddModalOpenCreate(false)}
        onDemandCreated={handleDemandCreated}
      />

      <DemandModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        demand={selectedDemand}
        onDemandUpdated={handleDemandUpdated}
      />

      <Footer />
    </div>
  )
}
