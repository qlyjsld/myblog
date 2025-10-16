import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.static(join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'about.html'));
});

app.get('/blog2', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'blog2.html'));
});

app.get('/blog1', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'blog1.html'));
});

app.listen(port, () => console.log('server started'))
