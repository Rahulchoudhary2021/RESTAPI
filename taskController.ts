// taskController.ts
import pool from '../database/db';
import { Task } from '../models/task';

export const createTask = async (task: Task): Promise<Task> => {
  const { title, description, status } = task;
  const query = 'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *';
  const values = [title, description, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const query = 'SELECT * FROM tasks WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const query = 'SELECT * FROM tasks';
  const { rows } = await pool.query(query);
  return rows;
};

export const updateTask = async (id: number, updatedTask: Task): Promise<Task | null> => {
  const { title, description, status } = updatedTask;
  const query = 'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *';
  const values = [title, description, status, id];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const deleteTask = async (id: number): Promise<void> => {
  const query = 'DELETE FROM tasks WHERE id = $1';
  await pool.query(query, [id]);
};
