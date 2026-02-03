// Importação do banco de dados

import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();
app.use(express.json());
app.use(cors());

// Serve os arquivos da pasta 'public' (seu HTML vai aqui dentro!)

const staticPath = path.join(__dirname, '../../frontend/src');

app.use(express.static(staticPath));

app.get('/', (req, res) => {
    res.redirect('/pages/login/index.html');
});
// ---------------------  G E T  => LISTAR  ---------------------

app.get('/login', async (req, res) => { // *req*  é a requisição que esta sendo feita // e o *res* é a resposta da requisição 
    const [users] = await db.query('SELECT user FROM login');

    res.status(200).json(users);
});

// ---------------------  P U T  => EDITAR ---------------------

app.put('/login/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    try {
        const [result] = await db.query("UPDATE login SET user = ? WHERE id = ?", [user, id]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT_SERVER;
const host = process.env.HOST_SERVER;

app.listen(port, host, () => {
    console.log(`Servidor rodando na porta ${port} e no ${host}`);
});

/* 
    Criar nossa API de Usuários

    -Criar um usuário
    - Listar todos os usuarios
    -Editar um usuario
    -Deletar um usuario

*/