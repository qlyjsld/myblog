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

app.listen(port, () => console.log('server started'))
