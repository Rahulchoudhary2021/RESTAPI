import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import * as pg from 'pg';
const app = fastify({ logger: true });
//Data Base configurations uesed here
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'apidata',
  password: 'admin',
  port: 1999,
});

interface Task {
  title: string;
  description: string;
}
//Used Get reuquest thta is fetching data from databse
app.get('/tasks', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tasks');
    client.release();
    reply.send(result.rows);
  } catch (err) {
    reply.status(500).send(err);
  }
});
//Used POST request thAt is inserting data into database
app.post('/tasks', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { title, description }: Task = request.body as Task;
    // Validate request body
    if (!title || !description) {
      reply.status(400).send('Title and description are required');
      return;
    }
    const client = await pool.connect();
    const result = await client.query('INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *', [title, description]);
    client.release();
    reply.send(result.rows[0]);
  } catch (err) {
    reply.status(500).send(err);
  }
});

app.get('/tasks/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const idParam = request.params.id;
    if (typeof idParam === 'string') {
      const taskId = parseInt(idParam, 10);
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
      client.release();
      if (result.rows.length === 0) {
        reply.status(404).send('Task not found');
      } else {
        reply.send(result.rows[0]);
      }
    } else {
      reply.status(400).send('Invalid task ID');
    }
  } catch (err) {
    reply.status(500).send(err);
  }
});

app.put('/tasks/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: Task }>, reply: FastifyReply) => {
  try {
    const taskId = parseInt(request.params.id, 10);
    const { title, description } = request.body as Task;
    // Validate request body
    if (!title || !description) {
      reply.status(400).send('Title and description are required');
      return;
    }
    const client = await pool.connect();
    const result = await client.query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, taskId]);
    client.release();
    if (result.rows.length === 0) {
      reply.status(404).send('Task not found');
    } else {
      reply.send(result.rows[0]);
    }
  } catch (err) {
    reply.status(500).send(err);
  }
});

app.delete('/tasks/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const taskId = parseInt(request.params.id, 10);
    const client = await pool.connect();
    const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
    client.release();
    if (result.rows.length === 0) {
      reply.status(404).send('Task not found');
    } else {
      reply.send(result.rows[0]);
    }
  } catch (err) {
    reply.status(500).send(err);
  }
});
//Flow Starts from here.
const start = async () => {
  try {
    const address = await app.listen({ port: 3000 });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
