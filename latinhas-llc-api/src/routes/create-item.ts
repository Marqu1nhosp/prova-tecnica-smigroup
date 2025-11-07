import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function createItem(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/items',
        {
            schema: {
                body: z.object({
                    sku: z.string().nonempty("O SKU é obrigatório"),
                    description: z.string().nonempty("A descrição é obrigatória"),
                    plannedTotal: z.coerce.number().min(0, "O total deve ser maior que zero"),
                    plannedProduced: z.coerce.number().min(0, "O total deve ser maior ou igual a zero"),
                    demandId: z.string().uuid("O demandId é obrigatório")
                })
            },
        },
        async (request, reply) => {
            const { sku, description, plannedTotal, plannedProduced, demandId } = request.body
          
            try {
                const item = await prisma.item.create({
                    data: {
                        sku,
                        description,
                        plannedTotal,
                        plannedProduced,
                        demand: {
                            connect: { id: demandId }
                        }
                    },
                })

                return reply.status(201).send(item)
            } catch (error) {
                console.error("Erro ao criar item:", error)
                return reply.status(500).send({
                    message: "Ocorreu um erro ao criar a item",
                })
            }
        }
    )
}
