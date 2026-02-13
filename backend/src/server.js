// Importação do banco de dados

import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { error } from 'console';              

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Serve os arquivos da pasta 'public' (seu HTML vai aqui dentro!)

const staticPath = path.join(__dirname, '../../frontend/src');

app.use(express.static(staticPath));
// ---------------------  G E T  => LISTAR  ---------------------

app.get('/auth', async (req, res) => { // *req*  é a requisição que esta sendo feita // e o *res* é a resposta da requisição 
    const puxarDados = "SELECT * FROM pessoas WHERE id = ?;";
    const valores = 2;
    const dadosRecebidos = await db.query(puxarDados, valores); // isso se torna um arry, os valores das querys vem na primeira posição do array (ou seja array[0])
    res.json(dadosRecebidos[0]);
    res.status(200);
});

const port = process.env.PORT_SERVER;
const host = process.env.HOST_SERVER;

app.listen(port, host, () => {
    console.log(`Servidor rodando na porta ${port} e no ${host}`);
});

console.log(process.env.SECRET_KEY)
/* 
    Criar nossa API de Usuários

    -Criar um usuário
    -Listar todos os usuarios
    -Editar um usuario
    -Deletar um usuario

*/