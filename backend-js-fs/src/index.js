import Fastify from 'fastify';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });
fastify.register(formBody);

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Servidor corriendo correctamente');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();