import { fastify } from 'fastify'
import fastifyCors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { createDemand } from './routes/create-demand'
import { getDemands } from './routes/get-demands';
import { deleteDemand } from './routes/delete-demand';
import { editDemand } from './routes/edit-demandt';
import { getDemandId } from './routes/get-demand-id';
import { pingRoute } from './routes/ping';
import { createItem } from './routes/create-item';
import { editItem } from './routes/edit-item';
import { deleteItem } from './routes/delete-item';


export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
// Registro de Rotas
app.register(createDemand)
app.register(getDemands)
app.register(deleteDemand)
app.register(editDemand)
app.register(getDemandId)
app.register(createItem)
app.register(editItem)
app.register(deleteItem)
app.register(pingRoute)


const PORT = Number(process.env.PORT) || 3333;

app.listen({
    port: PORT,
    host: '0.0.0.0'
}).then(() => {
    console.log('HTTP server running!')
})