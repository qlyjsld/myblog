import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pgPromise from 'pg-promise'

const app = express()
const port = 3000

const pgp = pgPromise()
const db = pgp('postgres://postgres:passwd@localhost:5432/myblog')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(cors())
app.use(express.static(join(__dirname, 'dist')))
app.use(express.json())

app.get('/api/comments', async (req, res, next) => {
    try {
        const comments = await db.any('SELECT * FROM COMMENTS')
        res.send(comments)
    }
    catch (e) {
        res.send('GET /api/comments failed')
    }
})

app.post('/api/comments', async (req, res, next) => {
    const { userid, comment } = req.body
    const params = { userid, comment }
    try {
        const comments = await db.any(
            'INSERT INTO COMMENTS(userid, comment)\
            VALUES(${userid}, ${comment})', params)
        res.send('POST /api/comments succeeded')
    }
    catch (e) {
        res.send('POST /api/comments failed')
    }
})

app.delete('/api/comments/:id', async (req, res, next) => {
    const params = { id: req.params.id }
    try {
        const comments = await db.none(
            'DELETE FROM COMMENTS WHERE id = ${id}', params)
        res.send('DELETE /api/comments succeeded')
    }
    catch (e) {
        res.send('DELETE /api/comments failed')
    }
})

app.listen(port, () => console.log('server started'))
