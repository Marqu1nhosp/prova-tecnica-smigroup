import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { generateSKU } from "../utils/generate-sku"

export async function createDemand(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/demands',
    {
      schema: {
        body: z
          .object({
            startDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
              message: "A data inicial é obrigatória",
            }),
            endDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
              message: "A data final é obrigatória",
            }),
            status: z.enum(["PLANEJAMENTO", "EM_ANDAMENTO", "CONCLUIDO"]).default("PLANEJAMENTO"),
          })
          .refine((data) => data.endDate >= data.startDate, {
            message: "A data final deve ser maior ou igual à data inicial",
            path: ["endDate"],
          }),
      },
    },
    async (request, reply) => {
      const { startDate, endDate, status } = request.body;
      try {
        const demand = await prisma.demand.create({
          data: {
            startDate,
            endDate,
            status,
          },
          include: { items: true },
        });

        return reply.status(201).send(demand);
      } catch (error) {
        console.error("Erro ao criar demanda:", error);
        return reply.status(500).send({
          message: "Ocorreu um erro ao criar a demanda",
        });
      }
    }
  );
}
