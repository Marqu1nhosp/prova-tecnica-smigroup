import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function editDemand(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/demands/:demandId', {
        schema: {
            params: z.object({
                demandId: z.string().uuid(),
            }),
                body: z
                    .object({
                        startDate: z
                            .coerce.date()
                            .refine((d) => !isNaN(d.getTime()), {
                                message: "A data inicial é obrigatória",
                            }),
                        endDate: z
                            .coerce.date()
                            .refine((d) => !isNaN(d.getTime()), {
                                message: "A data final é obrigatória",
                            }),
                        status: z
                            .enum(["PLANEJAMENTO", "EM_ANDAMENTO", "CONCLUIDO"])
                            .default("PLANEJAMENTO"),
                    })
                    .refine((data) => data.endDate >= data.startDate, {
                        message: "A data final deve ser maior ou igual à data inicial",
                        path: ["endDate"],
                    }),
        },
    }, async (request, reply) => {
        const demandId = request.params.demandId;
        const { startDate, endDate,status } = request.body

        try {
            const existingDemand = await prisma.demand.findUnique({
                where: { id: demandId },
            });

            if (!existingDemand) {
                reply.code(404).send({ message: 'Demanda não encontrada' });
                return;
            }

            const updatedDemand = await prisma.demand.update({
                where: { id: demandId },
                data: {
                    startDate,
                    endDate,
                    status,
                },
            });

            reply.code(200).send(updatedDemand);
        } catch (error) {
            console.error("Erro ao editar Demanda:", error);
            reply.code(500).send({ message: 'Erro ao editar Demanda' });
        }
    });
}
