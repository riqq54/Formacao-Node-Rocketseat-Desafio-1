export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (req, res) => {
            return res.end()
        }
    },
    {
        method: 'DELETE',
        path: '/tasks/:id',
        handler: (req, res) => {
            return res.end()
        }
    }
]