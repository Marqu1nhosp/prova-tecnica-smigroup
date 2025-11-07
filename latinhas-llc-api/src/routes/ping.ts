import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

// Schema de resposta para documentação via Zod
const healthResponseSchema = z.object({
  status: z.string(),
  database: z.string(),
});

export async function pingRoute(app: FastifyInstance) {
  // Define o tipo de provider Zod para esta rota
  const appWithZod = app.withTypeProvider<ZodTypeProvider>();

  appWithZod.get('/ping', {
    schema: {
      response: {
        200: healthResponseSchema,
      },
      summary: 'Verifica a saúde da API e a conexão com o banco de dados.',
      tags: ['Health'],
    },
  }, async (request, reply) => {
    let dbStatus = 'Prisma OK';

    try {
      // Tenta uma consulta simples no banco para verificar a conexão
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error('Prisma Connection Failed:', error);
      dbStatus = 'Prisma Failed';
    }

    return reply.status(200).send({
      status: 'API UP',
      database: dbStatus,
    });
  });
}