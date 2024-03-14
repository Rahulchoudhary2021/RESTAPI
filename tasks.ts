// tasks.ts
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Task } from '../models/task';
import * as TaskController from '../controllers/taskController';

const tasksRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/tasks', async (request, reply) => {
    try {
      const task = request.body as Task;
      const newTask = await TaskController.createTask(task);
      reply.code(201).send(newTask);
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/tasks/:id', async (request, reply) => {
    try {
      //const taskId = parseInt(request.params.id);
      const params: { id: string } = request.params as { id: string };
      const taskId: number = parseInt(params.id);
      const task = await TaskController.getTaskById(taskId);
      if (task) {
        reply.code(200).send(task);
      } else {
        reply.code(404).send({ error: 'Task not found' });
      }
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/tasks', async (request, reply) => {
    try {
      const tasks = await TaskController.getAllTasks();
      reply.code(200).send(tasks);
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/tasks/:id', async (request, reply) => {
    try {
      const params: { id: string } = request.params as { id: string };
      const taskId: number = parseInt(params.id);
      const updatedTask = request.body as Task;
      const task = await TaskController.updateTask(taskId, updatedTask);
      if (task) {
        reply.code(200).send(task);
      } else {
        reply.code(404).send({ error: 'Task not found' });
      }
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/tasks/:id', async (request, reply) => {
    try {
      const params: { id: string } = request.params as { id: string };
      const taskId: number = parseInt(params.id);
      await TaskController.deleteTask(taskId);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
};

export default tasksRoutes;
