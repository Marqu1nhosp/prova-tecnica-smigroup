import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function editItem(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch('/items/:itemId', {
    schema: {
      params: z.object({
        itemId: z.string().uuid(),
      }),
      body: z.object({
        sku: z.string().nonempty("O SKU é obrigatório"),
        description: z.string().nonempty("A descrição é obrigatória"),
        plannedTotal: z.coerce.number().positive("O total deve ser maior que zero"),
        plannedProduced: z.coerce.number().min(0, "O total deve ser maior que zero"),
        demandId: z.string().uuid("O demandId é obrigatório")
      }),
    },
  }, async (request, reply) => {
    const itemId = request.params.itemId;
    const { sku, description, plannedTotal, demandId, plannedProduced } = request.body;

    try {
      const existingItem = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!existingItem) {
        reply.code(404).send({ message: 'Item não encontrado' });
        return;
      }

      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: {
          sku,
          description,
          plannedTotal,
          plannedProduced,
          demandId
        },
      });

      reply.code(200).send(updatedItem);
    } catch (error) {
      console.error("Erro ao editar Item:", error);
      reply.code(500).send({ message: 'Erro ao editar Item' });
    }
  });
}
