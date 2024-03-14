// index.ts
import fastify from 'fastify';
import tasksRoutes from './routes/tasks';

const server = fastify();

(async () => {
  try {
    await server.register(require('fastify-postgres'), {
      connectionString: 'postgres://postgres:admin@host:1999/apidata',
    });

    server.register(tasksRoutes);

    const address = await server.listen(3000);
    console.log(`Server listening on ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
