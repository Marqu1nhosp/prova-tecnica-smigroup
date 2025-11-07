import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Demand, EditDemandItemPayload } from "@/types/demandTypes";
import { updateDemandItem, deleteDemandItem } from "../../services/api";
import { DemandModal } from "./DemandModal";
import { formatDate } from "@/utils/formatDate";
import { isAxiosError } from "axios";

// Schema de validação
const EditDemandItemSchema = z.object({
  backendId: z.string().optional(),
  sku: z.string().nonempty("O SKU é obrigatório"),
  description: z.string().optional(),
  plannedTotal: z.number(),
  plannedProduced: z.number().min(0, "O total produzido não pode ser negativo"),
});

const EditDemandSchema = z.object({
  items: z.array(EditDemandItemSchema),
});

export type EditDemand = z.infer<typeof EditDemandSchema>;

interface DemandModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  demand: Demand | null;
  onDemandUpdated: (updatedDemand: Demand) => void;
}

export function DemandModalEdit({ isOpen, onClose, demand, onDemandUpdated }: DemandModalEditProps) {
  // Configuração do React Hook Form
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<EditDemand>({
    resolver: zodResolver(EditDemandSchema),
    defaultValues: {
      items: [{ backendId: undefined, sku: "", description: "", plannedTotal: 1, plannedProduced: 0 }],
    },
  });

  // Gerenciamento de array de itens
  const { fields, remove } = useFieldArray({ control, name: "items", keyName: "fieldId" });

  // páginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalItems = fields.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedFields = fields.slice(startIndex, endIndex);

  // Preenche o formulário com os itens existentes
  useEffect(() => {
    if (demand) {
      reset({
        items: demand.items.length > 0
          ? demand.items.map((item) => ({
            backendId: item.id,
            sku: item.sku,
            description: item.description,
            plannedTotal: item.plannedTotal,
            plannedProduced: item.plannedProduced,
          }))
          : [{
            backendId: undefined,
            sku: "",
            description: "",
            plannedTotal: demand.plannedTotal,
            plannedProduced: 0,
          }],
      });
      setCurrentPage(1);
    }
  }, [demand, reset]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // deletar item
  async function handleDeleteItem(index: number, item: { backendId?: string }) {
    if (!item.backendId) {
      toast.info("Item removido da tabela.");
      remove(index);
      return;
    }
    try {
      await deleteDemandItem(item.backendId);
      toast.error("Item removido.");
      remove(index);
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      let message = "Não foi possível remover o item.";
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          message = "Item já não existia no servidor. Removido localmente.";
          toast.warning(message);
          remove(index);
          return;
        } else {
          message = error.response?.data?.message || "Erro de rede/servidor.";
        }
      }
      toast.error(message);
    }
  }


  async function handleEditItem(data: EditDemand) {
    if (!demand) return;

    try {
      // Atualiza apenas os itens que já existem
      const updatedItems: Demand["items"] = await Promise.all(
        data.items
          .filter((item) => item.backendId) // ignora itens novos
          .map(async (item) => {
            const payload = {
              demandId: demand.id,
              sku: item.sku,
              description: item.description || "Sem descrição",
              plannedTotal: Number(item.plannedTotal) || 0,
              plannedProduced: Number(item.plannedProduced) || 0,
            };

            await updateDemandItem(item.backendId!, payload as EditDemandItemPayload);

            const originalItem = demand.items.find((i) => i.id === item.backendId);

            return {
              id: item.backendId!,
              createdAt: originalItem?.createdAt || new Date().toISOString(),
              ...payload,
            };
          })
      );

      // Recalcula totais e status da demanda
      const { totalPlanned, totalProduced } = (demand.items ?? []).reduce(
        (acc, item) => ({
          totalPlanned: acc.totalPlanned + Number(item.plannedTotal ?? 0),
          totalProduced: acc.totalProduced + Number(item.plannedProduced ?? 0),
        }),
        { totalPlanned: 0, totalProduced: 0 }
      );


      let status: Demand["status"];
      if (totalProduced === 0) status = "PLANEJAMENTO";
      else if (totalProduced >= totalPlanned) status = "CONCLUIDO";
      else status = "EM_ANDAMENTO";

      const updatedDemand: Demand = { ...demand, items: updatedItems, plannedTotal: totalPlanned, status };
      onDemandUpdated(updatedDemand);

      toast.success("Itens atualizados com sucesso.");
      onClose();
    } catch (error) {
      let message = "Erro desconhecido ao atualizar itens.";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || `Erro de rede: ${error.message}`;
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.error("Erro ao atualizar itens:", message);
      toast.error(message);
    }
  }


  return (
    <DemandModal isOpen={isOpen} onClose={onClose} title="Editar demanda">
      <form
        onSubmit={handleSubmit(handleEditItem)}
        className="p-8 bg-white rounded-xl shadow-lg max-w-5xl w-full mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">
            {formatDate(demand?.startDate ?? "", demand?.endDate ?? "")}
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-300">
              <tr className="text-xs font-semibold uppercase text-gray-500">
                <th className="py-3 px-4 text-center rounded-tl-lg">SKU</th>
                <th className="py-3 px-4 text-center">Descrição</th>
                <th className="py-3 px-4 text-center">Total Planejado (Tons)</th>
                <th className="py-3 px-4 text-center">Total Produzido (Tons)</th>
                <th className="py-3 px-4 text-center rounded-tr-lg">Remover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedFields.length > 0 ? (
                paginatedFields.map((field, index) => {
                  const globalIndex = startIndex + index;
                  return (
                    <tr key={field.fieldId} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          {...register(`items.${globalIndex}.sku`)}
                          disabled={!!field.backendId}
                          className="w-full text-center border rounded px-2 py-1 disabled:bg-transparent disabled:border-none disabled:text-gray-500"
                        />
                        {errors.items?.[globalIndex]?.sku && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.items[globalIndex]?.sku?.message}
                          </p>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          {...register(`items.${globalIndex}.description`)}
                          disabled={!!field.description}
                          className="w-full border text-center rounded px-2 py-1 disabled:bg-transparent disabled:border-none disabled:text-gray-500"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          {...register(`items.${globalIndex}.plannedTotal`, { valueAsNumber: true })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          {...register(`items.${globalIndex}.plannedProduced`, { valueAsNumber: true })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(globalIndex, fields[globalIndex])}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Nenhum item cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end mt-4 gap-2 px-4 mb-2">
          <span className="text-gray-600 text-sm">
            {totalItems === 0 ? "0 - 0" : `${startIndex + 1} - ${endIndex}`} of {totalItems}
          </span>

          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white">
            Salvar
          </button>
        </div>
      </form>
    </DemandModal>
  );
}
