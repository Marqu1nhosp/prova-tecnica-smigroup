import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'
import { prisma } from "../lib/prisma"

export async function deleteDemand(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/demands/:demandId', {
        schema: {
            params: z.object({
                demandId: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const demandId = request.params.demandId

        try {
            const existingDemand = await prisma.demand.findUnique({
                where: {
                    id: demandId,
                },    
            })

             if (!demandId){
                reply.code(404).send({ message: 'Demanda não encontrado.'})
             }

             await prisma.demand.delete({
                where: {
                    id: demandId,
                }
             })
        } catch (error) {
             reply.code(500).send({ message: 'Erro ao deletar demanda.' });
        }
    })
}