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

app.get('/api/comments/count', async (req, res, next) => {
    try {
        const count = await db.any('SELECT COUNT(*) FROM COMMENTS')
        res.send(count)
    }
    catch (e) {
        res.send('GET /api/comments/count failed')
    }
})

app.get('/api/comments/query', async (req, res, next) => {
    try {
        const page = req.query.page == undefined ? '0' : req.query.page as string
        const size = req.query.size == undefined ? '0' : req.query.size as string
        const offset = parseInt(page) * parseInt(size)
        const params = { size, offset }
        const comments = await db.any(
            'SELECT * FROM COMMENTS\
            ORDER BY time ASC\
            LIMIT ${size}\
            OFFSET ${offset}', params)
        res.send(comments)
    }
    catch (e) {
        res.statusCode = 400
        res.send('GET /api/comments failed')
    }
})

app.post('/api/comments', async (req, res, next) => {
    const { username, comment } = req.body
    const params = { username, comment }
    try {
        const comments = await db.any(
            'INSERT INTO COMMENTS(username, comment)\
            VALUES(${username}, ${comment});', params)
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
