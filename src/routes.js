import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body
            
            if (!title || !description) {
                return res.writeHead(400).end()
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params
            const { title, description } = req.body

            if (!title && !description) {
                return res.writeHead(400).end()
            }

            const [task] = database.select('tasks', {id})

            if (!task) {
                return res.writeHead(400).end('Registro não encontrado')
            }

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                completed_at: task.completed_at,
                created_at: task.created_at,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            const [task] = database.select('tasks', {id})

            if (!task) {
                return res.writeHead(400).end('Registro não encontrado')
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {

            const { id } = req.params

            const [task] = database.select('tasks', {id})

            if (!task) {
                return res.writeHead(400).end('Registro não encontrado')
            }

            if (task.completed_at === null) {
                task.completed_at = new Date()
            } else {
                task.completed_at = null
            }

            database.update('tasks', id, {
                title: task.title,
                description: task.description,
                completed_at: task.completed_at,
                created_at: task.created_at,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    }
]