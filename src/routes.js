import { randomUUID } from 'node:crypto';

import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if (!title) return res.writeHead(400).end(JSON.stringify({message: "Campo 'title' nao esta prensente"}));
            if (!description) return res.writeHead(400).end(JSON.stringify({message: "Campo 'description' nao esta prensente"}));

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(), 
            };

            database.create('tasks', task);

            return res.writeHead(201).end();
        },
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;

            const tasks = database.select('tasks', {
                title: search,
                description: search
            });

            return res.end(JSON.stringify(tasks));
        },
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            const update =  database.update('tasks', id, {title, description});

            if (!update) return res.writeHead(400).end(JSON.stringify({message: "task nao localizada"}));

            return res.writeHead(204).end();
        },
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const remove = database.delete('tasks', id);

            if (!remove) return res.writeHead(400).end(JSON.stringify({message: "task nao localizada"}));

            return res.writeHead(204).end();
        },
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const update =  database.updateStatusTask('tasks', id);

            if (!update) return res.writeHead(400).end(JSON.stringify({message: "task nao localizada"}));

            return res.writeHead(204).end();
        },
    },
];