import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'
import { prisma } from "../lib/prisma"

export async function deleteItem(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/items/:itemId', {
        schema: {
            params: z.object({
                itemId: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const { itemId } = request.params

        try {
            const existingItem = await prisma.item.findUnique({
                where: { id: itemId }
            })

            if (!existingItem) {
                return reply.code(404).send({ message: 'Item não encontrado.' });
            }

            await prisma.item.delete({
                where: { id: itemId }
            })

            return reply.code(200).send({ message: 'Item deletado com sucesso.' });
        } catch (error) {
            console.error(error);
            return reply.code(500).send({ message: 'Erro ao deletar item.' });
        }
    })
}
