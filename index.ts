import express, { type NextFunction } from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pgPromise from 'pg-promise'

import jwt from 'jsonwebtoken'
import { createSecretKey } from 'crypto'
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000

const pgp = pgPromise()
const db = pgp('postgres://postgres:passwd@localhost:5432/myblog')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const secret = 'm4b10g'
const secretKey = createSecretKey(Buffer.from(secret))

app.use(cors())
app.use(express.static(join(__dirname, 'dist')))
app.use(express.json())
app.use(cookieParser())

const auth = (req: any, res: any, next: NextFunction) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json({ message: 'access_token missing' })

    try {
        const payload = jwt.verify(token, secretKey)
        req.payload = payload
        return next()
    }
    catch (e) {
        res.status(401).json({ message: 'access_token invalid' })
    }
}

app.post('/api/auth', auth, (req: any, res, next) => {
    res.status(200).json(req.payload)
})

app.post('/api/login', async (req, res, next) => {
    try {
        const params = { username: req.body.username }
        const row = await db.any('SELECT * FROM users WHERE username = ${username}', params)
        if (row.length != 1) throw Error('incorrect')

        const valid = await bcrypt.compare(req.body.passwd, row[0].passwd)
        if (!valid) throw Error('incorrect')

        const token = jwt.sign({ username: params.username }, secretKey, { expiresIn: '1h' })
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ token: token })
    }
    catch (e) {
        const err = e as Error
        res.status(401).json({ message: err.message })
    }
})

app.get('/api/comments', async (req, res, next) => {
    try {
        const comments = await db.any('SELECT * FROM COMMENTS')
        res.status(200).json(comments)
    }
    catch (e) {
        res.status(400).json({ message: 'GET /api/comments failed' })
    }
})

app.get('/api/comments/count', async (req, res, next) => {
    try {
        const count = await db.any('SELECT COUNT(*) FROM COMMENTS')
        res.status(200).json(count)
    }
    catch (e) {
        res.status(400).json({ message: 'GET /api/comments/count failed' })
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
            ORDER BY id DESC\
            OFFSET ${offset}\
            LIMIT ${size}', params)
        res.status(200).json(comments)
    }
    catch (e) {
        res.status(400).json({ message: 'GET /api/comments failed' })
    }
})

app.post('/api/comments', auth, async (req, res, next) => {
    const { username, comment } = req.body
    const params = { username, comment }
    try {
        const comments = await db.any(
            'INSERT INTO COMMENTS(username, comment)\
            VALUES(${username}, ${comment});', params)
        res.status(201).json({ message: 'POST /api/comments succeeded' })
    }
    catch (e) {
        res.status(400).json({ message: 'POST /api/comments failed' })
    }
})

app.delete('/api/comments/:id', auth, async (req, res, next) => {
    const params = { id: req.params.id }
    try {
        const comments = await db.none(
            'DELETE FROM COMMENTS WHERE id = ${id}', params)
        res.status(204).json({ message: 'DELETE /api/comments succeeded' })
    }
    catch (e) {
        res.status(400).json({ message: 'DELETE /api/comments failed' })
    }
})

app.listen(port, () => console.log('server started'))
