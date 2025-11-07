import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { generateSKU } from "../utils/generate-sku"

export async function getDemands(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/demands', async (request, reply) => {
      const sku = generateSKU()

      try {
        const demands = await prisma.demand.findMany({
          include: {
            items: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return { demands }
      } catch (error) {
        console.error("Erro ao criar demanda:", error)
        return reply.status(500).send({
          message: "Ocorreu um erro ao criar a demanda",
        })
      }
    }
  )
}
