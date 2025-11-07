import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DemandModal } from "./DemandModal"
import { createDemand, createDemandItem } from "../../services/api"
import type { CreateDemandPayload, Demand } from "@/types/demandTypes"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { Plus, Trash2 } from "lucide-react"

const createDemandFormSchema = z
    .object({
        startDate: z.string().nonempty("A data inicial é obrigatória"),
        endDate: z.string().nonempty("A data final é obrigatória"),
        items: z.array(
            z.object({
                sku: z.string().nonempty("O SKU do item é obrigatório"),
                description: z.string().optional(),
                plannedTotal: z.number().min(1, "O total deve ser maior que zero"),
                plannedProduced: z.number(),
            })
        ),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
        message: "A data final deve ser maior ou igual à data inicial",
        path: ["endDate"],
    })

type CreateDemand = z.infer<typeof createDemandFormSchema>

interface DemandModalCreateProps {
    isOpen: boolean
    onClose: () => void
    onDemandCreated: (newDemand: Demand) => void
}

export function DemandModalCreate({ isOpen, onClose, onDemandCreated }: DemandModalCreateProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateDemand>({
        resolver: zodResolver(createDemandFormSchema),
        defaultValues: {
            startDate: "",
            endDate: "",
            items: [{ sku: "", plannedTotal: 0, description: "", plannedProduced: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    })

    async function handleCreateDemand(data: CreateDemand) {
        console.log("Modal create", data)
        try {
            const demandPayload: CreateDemandPayload = {
                startDate: data.startDate,
                endDate: data.endDate,
            }

            const createdDemand = await createDemand(demandPayload)
            const demandId = createdDemand.id

            const createdItems = []
            for (const item of data.items) {
                const payload = {
                    demandId,
                    sku: item.sku,
                    description: item.description ?? "",
                    plannedTotal: item.plannedTotal,
                    plannedProduced: item.plannedProduced ?? 0,
                }

                const createdItem = await createDemandItem(demandId, payload)
                createdItems.push(createdItem)
            }

            const demandWithItems: Demand = { ...createdDemand, items: createdItems }

            onDemandCreated(demandWithItems)
            onClose()
            reset()
            toast.success("Demanda e itens criados com sucesso!")
        } catch (error) {
            let message = "Erro ao criar a demanda e seus itens."
            if (isAxiosError(error)) {
                message = error.response?.data?.message || `Erro de rede: ${error.message}`
            } else if (error instanceof Error) {
                message = error.message
            }
            toast.error(message)
        }
    }

    return (
        <DemandModal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Demanda">
            <form onSubmit={handleSubmit(handleCreateDemand)} className="p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-black mb-6">Adicionar Nova Demanda</h2>

                {/* Campos principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Data Inicial</label>
                        <input type="date" {...register("startDate")} className="w-full border border-gray-400 rounded-lg p-3" />
                        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Data Final</label>
                        <input type="date" {...register("endDate")} className="w-full border border-gray-400 rounded-lg p-3" />
                        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
                    </div>
                </div>

                {/* Itens */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Itens da Demanda</h3>
                    <button
                        type="button"
                        onClick={() => append({ sku: "", plannedTotal: 0, description: "", plannedProduced: 0 })}
                        className="flex items-center w-64 border-dashed text-white px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700"
                    >
                        <Plus size={20} />
                        <span className="ml-2">ADICIONAR NOVO ITEM</span>
                    </button>
                </div>

                {fields.map((item, index) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-start border border-gray-300 p-4 rounded-lg"
                    >
                        {/* SKU */}
                        <div className="flex flex-col w-40">
                            <label className="block text-sm font-medium text-black mb-2 truncate">SKU</label>
                            <input
                                type="text"
                                {...register(`items.${index}.sku` as const)}
                                className="w-full border border-gray-400 rounded-lg p-3"
                            />
                            {errors.items?.[index]?.sku && (
                                <p className="text-red-500 text-sm mt-1">{errors.items[index]?.sku?.message}</p>
                            )}
                        </div>

                        {/* Descrição */}
                        <div className="flex flex-col w-40 ml-9">
                            <label className="block text-sm font-medium text-black mb-2 truncate">Descrição</label>
                            <input
                                type="text"
                                {...register(`items.${index}.description` as const)}
                                className="w-full border border-gray-400 rounded-lg p-3"
                            />
                            {errors.items?.[index]?.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.items[index]?.description?.message}</p>
                            )}
                        </div>

                        {/* Total Planejado */}
                        <div className="flex flex-col w-40 ml-18">
                            <label className="block text-sm font-medium text-black mb-2 truncate">Total Planejado</label>
                            <input
                                type="number"
                                {...register(`items.${index}.plannedTotal` as const, { valueAsNumber: true })}
                                className="w-full border border-gray-400 rounded-lg p-3"
                            />
                            {errors.items?.[index]?.plannedTotal && (
                                <p className="text-red-500 text-sm mt-1">{errors.items[index]?.plannedTotal?.message}</p>
                            )}
                        </div>

                        {/* Botão remover pequeno */}
                        <div className="flex justify-center items-end ml-24 mt-10">
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                ))}

                {/* Botões */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
                    >
                        Salvar
                    </button>
                </div>
            </form>
        </DemandModal>
    )
}
