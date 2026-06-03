const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/listar', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'listar.html')
    );
});

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'banco_livros',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});

app.post('/add-livro', (req, res) => {
    const { titulo, autor, nota, categoria, descricao } = req.body;

    const checkSql = 'SELECT * FROM livros WHERE titulo = ?';

    db.query(checkSql, [titulo], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro no servidor");
        }
    
        if (results.length > 0) {
                return res.send(`
                    <script>
                        alert("O livro '${titulo}' já está cadastrado no sistema!");
                        window.history.back(); 
                    </script>
                `);
        }

        const sql = 'INSERT INTO livros (titulo, autor, nota, categoria, descricao) VALUES (?, ?, ?, ?, ?)';

        db.query(sql, [titulo, autor, nota, categoria, descricao], (err, result) => {
            if (err) {
                console.error(err);
                return res.send(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Erro</title>
                    <link rel="stylesheet" href="/styles/style.css">
                </head>
                <body class="body-resultado">
                    <div class="telaErro">
                        <h1>Erro ao cadastar o livro!</h1>

                        <a href="/" class="botao">Voltar</a>
                    </div>
                </body>
                </html>
                `);
            }
        
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Sucesso</title>
                    <link rel="stylesheet" href="/styles/style.css">
                </head>
                <body class="body-resultado">
                    <div class="telaSucesso">
                        <h1>Livro cadastrado com sucesso!</h1>
                        <p>Confira seus livros cadastrados clicando no botão "Listar" abaixo.</p>

                        <div class="lado-a-lado">
                            <a href="/listar" class="botao">Listar</a>
                            <a href="/" class="botao">Voltar</a>
                        </div>
                    </div>
                </body>
                </html>
            `);
        });
    });
});

app.get('/livros', (req, res) => {
    const sql = 'SELECT * FROM livros';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/add-teste', (req, res) => {
    const sql = "INSERT INTO livros (titulo, autor, nota, categoria, descricao) VALUES ('Teste', 'nometeste', '3', 'Aventura', 'descricaoTeste')";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Livro teste inserido');
    });
});

app.delete('/livros/:id', (req, res) => {
    const { id } = req.params;
    db.query(
        'DELETE FROM livros WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                mensagem: 'Livro removido com sucesso!'
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});